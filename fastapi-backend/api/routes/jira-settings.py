from fastapi import FastAPI, HTTPException, Request
from typing import Optional
import logging
from db.models import JiraSettings

app = FastAPI(
    title="Jira Settings API",
    description="Endpoint to save Jira connection settings",
)

# Set up basic logging (like console.log in Next.js)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/api/jira-settings")
async def save_jira_settings(settings: JiraSettings):
    """
    Accepts POST with JSON body: { baseUrl, email, apiToken }
    Validates and logs/saves the data.
    Returns success response (your frontend expects {success: true} or error).
    """
    try:
        # Log (don't log real token in production!)
        logger.info(
            f"Received Jira settings - URL: {settings.base_url}, Email: {settings.email}, "
            f"Token: {'*' * len(settings.api_token)}"
        )

        # Here: do real work
        # - Save to database
        # - Encrypt & store in secure vault / env per user
        # - Test credentials with a small Jira API call (recommended!)
        # Example placeholder:
        # await test_jira_connection(settings)  # you can implement this

        return {
            "success": True,
            "message": "Jira settings saved successfully"
        }

    except Exception as e:
        logger.error(f"Error saving Jira settings: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to save settings. Please try again."
        )