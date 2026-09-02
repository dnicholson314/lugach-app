use serde::{Deserialize, Serialize};
use tauri::AppHandle;

use crate::{canvas::http::fetch_all_pages, store::load_credentials};

/// A student record returned to the frontend.
#[derive(Debug, Serialize, Clone)]
pub struct Student {
    /// Canvas user ID.
    pub id: u64,
    pub name: String,
    pub email: String,
    /// The student's SIS user ID (e.g. their institutional ID), if set.
    pub sis_user_id: Option<String>,
    /// The Canvas course this student belongs to.
    pub course_id: u64,
}

/// Raw user object returned by the Canvas `/courses/:id/users` endpoint.
/// Field names match the Canvas API exactly.
#[derive(Debug, Deserialize)]
struct RawUser {
    id: u64,
    name: String,
    /// Actual email address; present when `include[]=email` is requested.
    email: Option<String>,
    sis_user_id: Option<String>,
}

/// Fetch all students enrolled in the given `course_id`.
///
/// Returns each student's name, email, SIS user ID, and the course they belong to.
#[tauri::command]
pub async fn get_students(app: AppHandle, course_id: u64) -> Result<Vec<Student>, String> {
    let (api_key, api_url) = load_credentials(&app)?;
    let client = reqwest::Client::new();

    let first_url = format!(
        "{}/api/v1/courses/{}/users?enrollment_type[]=student&include[]=email&include[]=sis_user_id&per_page=100",
        api_url.trim_end_matches('/'),
        course_id
    );

    let raw_students: Vec<RawUser> = fetch_all_pages(&client, &api_key, first_url).await?;

    let students = raw_students
        .into_iter()
        .map(|user| Student {
            id: user.id,
            name: user.name,
            email: user.email.unwrap_or_default(),
            sis_user_id: user.sis_user_id,
            course_id,
        })
        .collect();

    Ok(students)
}
