from pydantic import BaseModel, HttpUrl, EmailStr, Field
from typing import Optional
import logging
from fastapi import FastAPI, HTTPException, Request

app = FastAPI(
    title="Jira Settings API",
    description="Endpoint to save Jira connection settings",
)

# Pydantic model = automatic validation + OpenAPI schema (like Zod in JS)
class JiraSettings(BaseModel):
    base_url: HttpUrl = Field(..., description="Jira instance URL, e.g. https://yourcompany.atlassian.net")
    email: EmailStr = Field(..., description="Atlassian account email")
    api_token: str = Field(..., min_length=20, description="Atlassian API token (keep secret!)")

    class Config:
        json_schema_extra = {
            "example": {
                "base_url": "https://mycompany.atlassian.net",
                "email": "gordon@example.com",
                "api_token": "ATATT3xFfGF0...very-long-token-here"
            }
        }