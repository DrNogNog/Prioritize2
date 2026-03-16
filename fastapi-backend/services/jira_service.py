import requests
from requests.auth import HTTPBasicAuth
import time
from typing import List, Dict, Optional, Any


def get_all_projects(
    base_url: str,
    email: str,
    api_token: str,
    max_results: int = 50,
    project_type: Optional[str] = None,       # e.g. "software", "service"
    order_by: str = "name"
) -> List[Dict[str, Any]]:
    """
    Fetch ALL visible projects from Jira Cloud using /rest/api/3/project/search.
    
    Returns: list of project dicts (each has 'key', 'name', 'id', 'projectTypeKey', etc.)
    """
    auth = HTTPBasicAuth(email, api_token)
    headers = {"Accept": "application/json"}

    projects: List[Dict[str, Any]] = []
    start_at = 0

    while True:
        params: Dict[str, Any] = {
            "startAt": start_at,
            "maxResults": max_results,
            "orderBy": order_by,
        }
        if project_type:
            params["type"] = project_type

        url = f"{base_url.rstrip('/')}/rest/api/3/project/search"
        response = requests.get(url, auth=auth, headers=headers, params=params)

        if response.status_code != 200:
            raise RuntimeError(
                f"Failed to fetch projects (HTTP {response.status_code}): {response.text}"
            )

        data = response.json()
        new_projects = data.get("values", [])
        projects.extend(new_projects)

        if data.get("isLast", True):
            break

        start_at += max_results
        time.sleep(0.5)  # polite rate limiting

    return projects


def get_issues_in_project(
    base_url: str,
    email: str,
    api_token: str,
    project_key: str,
    issue_types: Optional[List[str]] = None,
    extra_jql: str = "",
    fields: str = "key,summary,issuetype,status,created,updated,assignee,priority",
    max_results_per_call: int = 100,
    rate_limit_delay: float = 0.6
) -> List[Dict[str, Any]]:
    """
    Fetch ALL issues in a given project using JQL search (/rest/api/3/search).
    
    Supports filtering by issue types (e.g. ["Epic", "Story"]) and extra JQL conditions.
    
    Returns: list of issue dicts
    """
    auth = HTTPBasicAuth(email, api_token)
    headers = {"Accept": "application/json"}

    all_issues: List[Dict[str, Any]] = []
    start_at = 0

    jql = f'project = {project_key}'
    if issue_types:
        types_str = ", ".join(f'"{t}"' for t in issue_types)
        jql += f' AND issuetype in ({types_str})'
    if extra_jql:
        jql += f" {extra_jql}"
    jql += " ORDER BY created ASC"  # change ordering if needed

    while True:
        params: Dict[str, Any] = {
            "jql": jql,
            "startAt": start_at,
            "maxResults": max_results_per_call,
            "fields": fields,
        }

        url = f"{base_url.rstrip('/')}/rest/api/3/search"
        response = requests.get(url, auth=auth, headers=headers, params=params)

        if response.status_code != 200:
            raise RuntimeError(
                f"Failed to fetch issues for {project_key} (HTTP {response.status_code}): {response.text}"
            )

        data = response.json()
        issues = data.get("issues", [])
        all_issues.extend(issues)

        total = data.get("total", 0)
        fetched = len(all_issues)

        print(f"Project {project_key}: fetched {fetched}/{total} issues...")

        if fetched >= total:
            break

        start_at += max_results_per_call
        time.sleep(rate_limit_delay)  # avoid rate limits (~100–150 req/min)

    return all_issues


# ────────────────────────────────────────────────
# Example usage as standalone tools
# ────────────────────────────────────────────────

if __name__ == "__main__":
    # Replace with your real values (never commit them!)
    BASE_URL = "https://your-company.atlassian.net"
    EMAIL    = "your.email@example.com"
    TOKEN    = "ATATTyourVeryLongTokenHere..."

    try:
        # Tool 1: Get all projects
        projects = get_all_projects(BASE_URL, EMAIL, TOKEN)
        print(f"\nFound {len(projects)} projects:")
        for p in projects:
            print(f"• {p.get('key')} → {p.get('name')} (type: {p.get('projectTypeKey')})")

        # Tool 2: Get issues from one project
        project_key = "KAN"  # ← change this
        epics = get_issues_in_project(
            BASE_URL, EMAIL, TOKEN,
            project_key=project_key,
            issue_types=["Epic"],
            fields="key,summary,issuetype,status,created,updated,assignee,priority,customfield_10008"  # e.g. epic link
        )
        print(f"\nFound {len(epics)} Epics in {project_key}")

    except Exception as e:
        print(f"Error: {e}")