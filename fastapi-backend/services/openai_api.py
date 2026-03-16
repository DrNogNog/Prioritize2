import os
import json
import httpx
import asyncio
from typing import Optional, Dict, Any, List

# Import both services
from services.jira_service import (
    get_all_projects,
    get_issues_in_project,
)
from services.asana_service import (
    get_all_asana_projects,
    get_tasks_in_asana_project,
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_BASE = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# ────────────────────────────────────────────────
# Tool Definitions
# ────────────────────────────────────────────────

# Jira Tools (unchanged)
JIRA_PROJECT_TOOL = {
    "type": "function",
    "function": {
        "name": "get_all_jira_projects",
        "description": "List all accessible Jira projects (keys and names). Use this first to discover project keys.",
        "parameters": {
            "type": "object",
            "properties": {
                "project_type": {"type": "string", "enum": ["software", "service", "business"]},
            },
            "required": [],
        }
    }
}

JIRA_ISSUES_TOOL = {
    "type": "function",
    "function": {
        "name": "get_issues_in_jira_project",
        "description": "Get all issues from a specific Jira project. Filter by issue types if needed.",
        "parameters": {
            "type": "object",
            "properties": {
                "project_key": {"type": "string", "description": "Jira project key, e.g. 'KAN'"},
                "issue_types": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "e.g. ['Epic', 'Story', 'Task']",
                },
                "extra_jql": {"type": "string", "description": "Extra JQL, e.g. 'status = \"In Progress\"'"},
            },
            "required": ["project_key"],
        }
    }
}

# Asana Tools
ASANA_PROJECT_TOOL = {
    "type": "function",
    "function": {
        "name": "get_all_asana_projects",
        "description": (
            "List all accessible Asana projects in your workspace. "
            "Returns project GID and name. Use this to discover project IDs before querying tasks."
        ),
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
        }
    }
}

ASANA_TASKS_TOOL = {
    "type": "function",
    "function": {
        "name": "get_tasks_in_asana_project",
        "description": (
            "Fetch all tasks from a specific Asana project. "
            "Use 'milestone' in task_types to get Epics (if your team uses milestones for epics). "
            "Returns task GID, name, notes, assignee, due date, etc."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "project_gid": {
                    "type": "string",
                    "description": "Asana project GID (numeric string, e.g. '1203456789012345')"
                },
                "task_types": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Filter by subtype, e.g. ['milestone'] for Epics",
                },
            },
            "required": ["project_gid"],
        }
    }
}

USER_ANALYTICS_TOOL = {
    "type": "function",
    "function": {
        "name": "get_user_analytics",
        "description": (
            "Get key user analytics metrics (DAU, retention, sessions, etc.). "
            "Perfect for understanding overall product usage or trends over time."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "time_range": {
                    "type": "string",
                    "enum": ["7d", "30d", "90d", "all"],
                    "description": "Time period to analyze"
                }
            },
            "required": [],
            "additionalProperties": False
        }
    }
}

FEEDBACK_INSIGHTS_TOOL = {
    "type": "function",
    "function": {
        "name": "analyze_feedback_insights",
        "description": (
            "Analyze user feedback text and extract insights, sentiment, themes, "
            "and recommendations. Great for turning raw feedback into actionable product improvements."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "feedback_source": {
                    "type": "string",
                    "description": "Source of feedback (e.g. 'jira', 'asana', 'app_survey', 'intercom')"
                },
                "limit": {
                    "type": "integer",
                    "description": "Max number of feedback items to analyze (default 100)"
                }
            },
            "required": ["feedback_source"],
            "additionalProperties": False
        }
    }
}

HEATMAP_TOOL = {
    "type": "function",
    "function": {
        "name": "get_user_heatmap",
        "description": (
            "Generate click/scroll heatmap data for a specific page or feature. "
            "Returns grid coordinates with intensity (can be rendered as heatmap in frontend)."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "page": {
                    "type": "string",
                    "description": "Page or screen name (e.g. 'settings', 'chat', 'dashboard')"
                },
                "time_range": {
                    "type": "string",
                    "enum": ["7d", "30d", "90d"],
                    "description": "Time period for heatmap data"
                }
            },
            "required": ["page"],
            "additionalProperties": False
        }
    }
}

# Update your combined list
ALL_TOOLS = [
    JIRA_PROJECT_TOOL,
    JIRA_ISSUES_TOOL,
    ASANA_PROJECT_TOOL,
    ASANA_TASKS_TOOL,
    USER_ANALYTICS_TOOL,          # ← NEW
    FEEDBACK_INSIGHTS_TOOL,       # ← NEW
    HEATMAP_TOOL,                 # ← NEW
]


# ────────────────────────────────────────────────
# Unified Tool Executor (handles both Jira and Asana)
# ────────────────────────────────────────────────

async def execute_tool(tool_call: Dict[str, Any]) -> Dict[str, Any]:
    func_name = tool_call["function"]["name"]

    try:
        args = json.loads(tool_call["function"]["arguments"])
    except json.JSONDecodeError:
        return {"error": "Invalid JSON arguments from model"}

    # ────────────────────────────────────────────────
    # Jira tools
    # ────────────────────────────────────────────────
    if func_name in ("get_all_jira_projects", "get_issues_in_jira_project"):
        base_url   = os.getenv("JIRA_BASE_URL")
        email      = os.getenv("JIRA_EMAIL")
        api_token  = os.getenv("JIRA_API_TOKEN")

        if not all([base_url, email, api_token]):
            missing = [k for k, v in {
                "JIRA_BASE_URL": base_url,
                "JIRA_EMAIL": email,
                "JIRA_API_TOKEN": api_token
            }.items() if not v]

            return {
                "error": (
                    f"Jira credentials missing. Please set:\n"
                    f"  export {'  export '.join(missing)}\n\n"
                    "Example:\n"
                    "  export JIRA_BASE_URL='https://your-company.atlassian.net'\n"
                    "  export JIRA_EMAIL='you@example.com'\n"
                    "  export JIRA_API_TOKEN='ATATT...'\n"
                    "Get token: https://id.atlassian.com/manage-profile/security/api-tokens"
                )
            }

        try:
            if func_name == "get_all_jira_projects":
                result = await asyncio.to_thread(
                    get_all_projects,
                    base_url=base_url, email=email, api_token=api_token, **args
                )
                return {"projects": [f"{p.get('key')} - {p.get('name')}" for p in result]}

            elif func_name == "get_issues_in_jira_project":
                result = await asyncio.to_thread(
                    get_issues_in_project,
                    base_url=base_url, email=email, api_token=api_token, **args
                )
                summary = [
                    f"{i['key']}: {i['fields'].get('summary', 'No summary')} "
                    f"({i['fields']['issuetype']['name']}, {i['fields']['status']['name']})"
                    for i in result[:50]
                ]
                return {
                    "issues": summary,
                    "total": len(result),
                    "note": f"Showing first 50 of {len(result)} issues"
                }

        except Exception as exc:
            return {"error": f"Jira tool failed: {str(exc)}"}

    # ────────────────────────────────────────────────
    # Asana tools
    # ────────────────────────────────────────────────
    elif func_name in ("get_all_asana_projects", "get_tasks_in_asana_project"):
        token = os.getenv("ASANA_TOKEN")
        workspace_gid = os.getenv("ASANA_WORKSPACE_GID")

        if not token or not workspace_gid:
            missing = []
            if not token: missing.append("ASANA_TOKEN")
            if not workspace_gid: missing.append("ASANA_WORKSPACE_GID")

            return {
                "error": (
                    f"Asana credentials missing. Please set:\n"
                    f"  export {'  export '.join(missing)}\n\n"
                    "Example:\n"
                    "  export ASANA_TOKEN='0/abc123def456...'\n"
                    "  export ASANA_WORKSPACE_GID='1203456789012345'\n"
                    "Get token: https://app.asana.com/-/account_security → Personal Access Tokens\n"
                    "Workspace GID: usually visible in project URLs or via /workspaces endpoint"
                )
            }

        try:
            if func_name == "get_all_asana_projects":
                result = await asyncio.to_thread(
                    get_all_asana_projects,
                    access_token=token,
                    workspace_gid=workspace_gid,
                    **args
                )
                return {"projects": [f"{p['gid']} - {p['name']}" for p in result]}

            elif func_name == "get_tasks_in_asana_project":
                result = await asyncio.to_thread(
                    get_tasks_in_asana_project,
                    access_token=token,
                    project_gid=args["project_gid"],
                    task_types=args.get("task_types"),
                )
                summary = [
                    f"{t['gid']}: {t.get('name', 'No name')} "
                    f"({t.get('resource_subtype', 'task')}, "
                    f"{'completed' if t.get('completed') else 'incomplete'})"
                    for t in result[:50]
                ]
                return {
                    "tasks": summary,
                    "total": len(result),
                    "note": f"Showing first 50 of {len(result)} tasks"
                }

        except Exception as exc:
            return {"error": f"Asana tool failed: {str(exc)}"}

    # ────────────────────────────────────────────────
    # Analytics / Product Intelligence tools
    # ────────────────────────────────────────────────
    elif func_name in ("get_user_analytics", "analyze_feedback_insights", "get_user_heatmap"):
        try:
            # Late import to avoid circular imports if analytics_service depends on other things
            from services.analytics_service import (
                get_user_analytics,
                analyze_feedback_insights,
                get_user_heatmap,
            )

            if func_name == "get_user_analytics":
                time_range = args.get("time_range", "30d")
                result = await asyncio.to_thread(get_user_analytics, time_range)
                return result

            elif func_name == "analyze_feedback_insights":
                source = args["feedback_source"]
                limit = args.get("limit", 100)
                result = await asyncio.to_thread(analyze_feedback_insights, source, limit)
                return result

            elif func_name == "get_user_heatmap":
                page = args["page"]
                time_range = args.get("time_range", "30d")
                result = await asyncio.to_thread(get_user_heatmap, page, time_range)
                return result

        except ImportError:
            return {"error": "analytics_service module not found. Please implement services/analytics_service.py"}
        except KeyError as e:
            return {"error": f"Missing required argument: {str(e)}"}
        except Exception as exc:
            return {"error": f"Analytics tool failed: {str(exc)}"}

    # ────────────────────────────────────────────────
    # Catch-all
    # ────────────────────────────────────────────────
    else:
        return {"error": f"Unknown tool: {func_name}"}

# ────────────────────────────────────────────────
# call_openai (unchanged except renamed dispatcher)
# ────────────────────────────────────────────────

async def call_openai(
    prompt: str,
    model: str = DEFAULT_MODEL,
    temperature: float = 0.7,
    max_tokens: int = 1024,
    timeout: float = 120.0,
    tools: Optional[List[Dict]] = None,
    max_tool_rounds: int = 3,
) -> str:
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY not set")

    base_url = OPENAI_API_BASE.rstrip("/")
    url = f"{base_url}/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    messages = [{"role": "user", "content": prompt}]
    tool_round = 0

    while tool_round < max_tool_rounds:
        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if tools:
            payload["tools"] = tools
            payload["tool_choice"] = "auto"

        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=payload, headers=headers, timeout=timeout)
            resp.raise_for_status()
            data = resp.json()

        choice = data["choices"][0]
        message = choice["message"]
        messages.append(message)

        if "tool_calls" not in message or not message["tool_calls"]:
            return message.get("content") or ""

        # Execute tools in parallel
        tool_tasks = [execute_tool(tc) for tc in message["tool_calls"]]
        tool_results = await asyncio.gather(*tool_tasks, return_exceptions=True)

        for tc, result in zip(message["tool_calls"], tool_results):
            content = {"error": str(result)} if isinstance(result, Exception) else result
            messages.append({
                "role": "tool",
                "tool_call_id": tc["id"],
                "name": tc["function"]["name"],
                "content": json.dumps(content, ensure_ascii=False)
            })

        tool_round += 1

    raise RuntimeError(f"Max tool rounds ({max_tool_rounds}) reached without final answer")


# ────────────────────────────────────────────────
# Example usage
# ────────────────────────────────────────────────

async def main():
    prompt = (
        "List my Asana projects, then show me the milestones (epics) "
        "in one of them, and also list my Jira projects for comparison."
    )
    try:
        response = await call_openai(
            prompt=prompt,
            tools=ALL_TOOLS,
            model="gpt-4o",  # better reasoning & tool use
            temperature=0.3,
        )
        print("Final answer:\n", response)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    asyncio.run(main())