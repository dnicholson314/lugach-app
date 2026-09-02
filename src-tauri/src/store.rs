use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

// Keys used to look up values inside settings.json
const API_KEY_STORE_KEY: &str = "canvas_api_key";
const API_URL_STORE_KEY: &str = "canvas_api_url";

// --- API Key ---

/// Called from the frontend to save the user's Canvas API key.
#[tauri::command]
pub fn save_api_key(app: AppHandle, api_key: String) -> Result<(), String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;
    store.set(API_KEY_STORE_KEY, serde_json::json!(api_key));
    store.save().map_err(|e| e.to_string())
}

/// Called from the frontend to retrieve a previously saved API key.
/// Returns `Some(key)` if one exists, or `None` if not yet set.
#[tauri::command]
pub fn get_api_key(app: AppHandle) -> Result<Option<String>, String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;
    Ok(store
        .get(API_KEY_STORE_KEY)
        .and_then(|v| v.as_str().map(|s| s.to_string())))
}

// --- API URL ---

/// Called from the frontend to save the user's Canvas instance URL.
#[tauri::command]
pub fn save_api_url(app: AppHandle, api_url: String) -> Result<(), String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;
    store.set(API_URL_STORE_KEY, serde_json::json!(api_url));
    store.save().map_err(|e| e.to_string())
}

/// Called from the frontend to retrieve the previously saved Canvas URL.
/// Returns `Some(url)` if one exists, or `None` if not yet set.
#[tauri::command]
pub fn get_api_url(app: AppHandle) -> Result<Option<String>, String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;
    Ok(store
        .get(API_URL_STORE_KEY)
        .and_then(|v| v.as_str().map(|s| s.to_string())))
}

// --- Credentials helper ---

/// Load the Canvas API key and base URL from the persistent store.
/// Returns `Err` with a user-friendly message if either is missing.
pub fn load_credentials(app: &AppHandle) -> Result<(String, String), String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;

    let api_key = store
        .get("canvas_api_key")
        .and_then(|v| v.as_str().map(|s| s.to_string()))
        .ok_or_else(|| "Canvas API key is not set".to_string())?;

    let api_url = store
        .get("canvas_api_url")
        .and_then(|v| v.as_str().map(|s| s.to_string()))
        .ok_or_else(|| "Canvas API URL is not set".to_string())?;

    Ok((api_key, api_url))
}
