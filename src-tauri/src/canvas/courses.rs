use serde::{Deserialize, Serialize};
use tauri::AppHandle;

use crate::{canvas::http::fetch_all_pages, store::load_credentials};

/// A minimal view of a Canvas course, serialised to JSON for the frontend.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Course {
    pub id: u64,
    pub name: String,
    /// The course code / short name (e.g. "CS101").
    pub course_code: String,
}

/// Fetch all courses in which the current user has a **Designer** enrollment.
///
/// Pages through the Canvas API automatically (Link header pagination) so that
/// accounts with many courses are handled correctly.
#[tauri::command]
pub async fn get_courses(app: AppHandle) -> Result<Vec<Course>, String> {
    let (api_key, api_url) = load_credentials(&app)?;
    let client = reqwest::Client::new();

    let first_url = format!(
        "{}/api/v1/courses?enrollment_type=designer&per_page=50",
        api_url.trim_end_matches('/')
    );

    fetch_all_pages(&client, &api_key, first_url).await
}
