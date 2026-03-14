import os
import json
import httpx
from typing import Optional

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_BASE = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")  # ← consider updating default

# Example tool definition (you can move this elsewhere)
jira_search_tool = {
    "type": "function",
    "function": {
        "name": "search_jira_issues",
        "description": "Search for Jira issues using JQL query language",
        "parameters": {
            "type": "object",
            "properties": {
                "jql": {
                    "type": "string",
                    "description": "Jira Query Language (JQL) query string"
                }
            },
            "required": ["jql"],
            "additionalProperties": False
        }
    }
}


async def call_openai(
    prompt: str,
    model: str = DEFAULT_MODEL,
    temperature: float = 0.7,
    max_tokens: int = 1024,
    timeout: float = 120.0,
    tools: Optional[list] = None,
) -> str:
    """
    Call OpenAI Chat Completions API with support for tools (function calling).
    Handles one round of tool execution (most common case).

    Args:
        prompt: User message content
        model: OpenAI model name
        temperature: Sampling temperature
        max_tokens: Maximum tokens to generate
        timeout: Request timeout in seconds
        tools: Optional list of tool definitions

    Returns:
        Final assistant response text

    Raises:
        RuntimeError, TimeoutError, ValueError on failure
    """
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not set in environment variables")

    base_url = OPENAI_API_BASE.rstrip("/")  # just in case
    url = f"{base_url}/chat/completions"

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    messages = [
        {"role": "user", "content": prompt}
    ]

    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    if tools:
        payload["tools"] = tools
        payload["tool_choice"] = "auto"  # or "required", "none"

    async with httpx.AsyncClient() as client:
        # ── First request ────────────────────────────────────────
        try:
            response = await client.post(
                url,
                json=payload,
                headers=headers,
                timeout=timeout
            )
            response.raise_for_status()
            data = response.json()
        except httpx.TimeoutException:
            raise TimeoutError(f"OpenAI request timed out after {timeout} seconds")
        except httpx.HTTPStatusError as e:
            error_body = e.response.text if e.response else ""
            raise RuntimeError(
                f"OpenAI API error {e.response.status_code}: {error_body}"
            ) from e
        except Exception as e:
            raise RuntimeError(f"Failed to call OpenAI: {str(e)}") from e

        if not data.get("choices"):
            raise ValueError("OpenAI returned no choices in response")

        message = data["choices"][0]["message"]

        # No tool calls → return content directly
        if "tool_calls" not in message or not message["tool_calls"]:
            return message.get("content") or ""

        # ── Handle tool calls (currently supports only 1 call) ───────
        if len(message["tool_calls"]) > 1:
            print("Warning: multiple tool calls received, using only the first one")

        tool_call = message["tool_calls"][0]
        function_name = tool_call["function"]["name"]
        try:
            function_args = json.loads(tool_call["function"]["arguments"])
        except json.JSONDecodeError:
            raise ValueError("OpenAI returned invalid JSON in tool arguments")

        if function_name == "search_jira_issues":
            try:
                from services.jira_service import search_jira_issues  # late import
                tool_result = await search_jira_issues(function_args["jql"])
            except Exception as exc:
                tool_result = {"error": f"Tool execution failed: {str(exc)}"}
        else:
            tool_result = {"error": f"Unknown function: {function_name}"}

        # Prepare second request with tool result
        tool_message = {
            "role": "tool",
            "tool_call_id": tool_call["id"],
            "name": function_name,
            "content": json.dumps(tool_result, ensure_ascii=False)
        }

        # Build full message history for second call
        messages = [
            {"role": "user", "content": prompt},
            message,           # assistant message with tool_calls
            tool_message
        ]

        payload["messages"] = messages
        # Optional: remove tools if you don't want another round
        # payload.pop("tools", None)

        # ── Second request (tool result → final answer) ─────────
        try:
            response = await client.post(
                url,
                json=payload,
                headers=headers,
                timeout=timeout
            )
            response.raise_for_status()
            data = response.json()
        except Exception as e:
            raise RuntimeError(f"Second OpenAI call failed: {str(e)}") from e

        if not data.get("choices"):
            raise ValueError("OpenAI returned no choices in second response")

        final_message = data["choices"][0]["message"]
        final_content = final_message.get("content")

        if not final_content:
            raise ValueError("Final response has no content")

        return final_content