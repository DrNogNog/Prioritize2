import requests
import time
from typing import List, Dict, Any, Optional


def get_all_asana_projects(
    access_token: str,
    workspace_gid: str,                    # required – get from /workspaces endpoint or UI
    limit: int = 100,
    opt_fields: str = "gid,name,owner,public,team,notes"
) -> List[Dict[str, Any]]:
    """
    Fetch ALL accessible projects in a given Asana workspace.
    
    Returns: list of project dicts (gid, name, owner, etc.)
    """
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }

    projects: List[Dict[str, Any]] = []
    offset: Optional[str] = None

    base_url = "https://app.asana.com/api/1.0"

    while True:
        params: Dict[str, Any] = {
            "limit": limit,
            "opt_fields": opt_fields,
        }
        if offset:
            params["offset"] = offset

        url = f"{base_url}/workspaces/{workspace_gid}/projects"
        response = requests.get(url, headers=headers, params=params)

        if response.status_code != 200:
            raise RuntimeError(
                f"Asana API error {response.status_code}: {response.text}"
            )

        data = response.json()
        new_projects = data.get("data", [])
        projects.extend(new_projects)

        offset = data.get("next_page", {}).get("offset")
        if not offset:
            break

        time.sleep(0.6)  # rate limit safety (~150–200 req/min)

    return projects


def get_tasks_in_asana_project(
    access_token: str,
    project_gid: str,
    task_types: Optional[List[str]] = None,  # e.g. ["milestone"] for Epics, or custom field filter
    extra_params: Optional[Dict] = None,
    limit_per_call: int = 100,
    opt_fields: str = "gid,name,notes,assignee,completed,due_on,projects,memberships,resource_subtype"
) -> List[Dict[str, Any]]:
    """
    Fetch ALL tasks from a specific Asana project (paginated).
    
    Use task_types=["milestone"] to get Epics (if your team uses milestones as epics).
    For custom field "Epic/Story" filtering → use /search/tasks endpoint or post-filter.
    
    Returns: list of task dicts
    """
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }

    all_tasks: List[Dict[str, Any]] = []
    offset: Optional[str] = None

    base_url = "https://app.asana.com/api/1.0"

    while True:
        params: Dict[str, Any] = {
            "limit": limit_per_call,
            "opt_fields": opt_fields,
        }
        if offset:
            params["offset"] = offset
        if extra_params:
            params.update(extra_params)

        url = f"{base_url}/projects/{project_gid}/tasks"
        response = requests.get(url, headers=headers, params=params)

        if response.status_code != 200:
            raise RuntimeError(
                f"Asana API error {response.status_code} for project {project_gid}: {response.text}"
            )

        data = response.json()
        tasks = data.get("data", [])
        all_tasks.extend(tasks)

        offset = data.get("next_page", {}).get("offset")
        if not offset:
            break

        time.sleep(0.6)

    # Optional post-filter example (if using custom field for Epic/Story)
    if task_types:
        filtered = []
        for task in all_tasks:
            subtype = task.get("resource_subtype")
            if "milestone" in task_types and subtype == "milestone":
                filtered.append(task)
            # Add custom field check here if needed (requires opt_fields=...)
        all_tasks = filtered

    return all_tasks


# ────────────────────────────────────────────────
# Example usage
# ────────────────────────────────────────────────

if __name__ == "__main__":
    # Replace with your values (never commit!)
    ASANA_TOKEN = "0/abc123...your_personal_access_token"
    WORKSPACE_GID = "123456789012345"   # ← get from /workspaces or Asana UI URL

    try:
        # Tool 1: List all projects in workspace
        projects = get_all_asana_projects(ASANA_TOKEN, WORKSPACE_GID)
        print(f"Found {len(projects)} projects:")
        for p in projects:
            print(f"• {p['gid']} | {p['name']}")

        # Tool 2: Get Epics (milestones) from one project
        project_gid = "987654321098765"  # ← change this
        epics = get_tasks_in_asana_project(
            ASANA_TOKEN,
            project_gid,
            task_types=["milestone"],           # Epics as milestones
            opt_fields="gid,name,notes,due_on,assignee,resource_subtype"
        )
        print(f"\nFound {len(epics)} Epics/milestones in project {project_gid}")

        # Get normal tasks (stories/tasks)
        stories = get_tasks_in_asana_project(
            ASANA_TOKEN,
            project_gid,
            # no task_types → gets everything; filter post-call if needed
        )
        print(f"Found {len(stories)} tasks total")

    except Exception as e:
        print(f"Error: {e}")