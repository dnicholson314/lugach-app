mod canvas;
mod store;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            store::save_api_key,
            store::get_api_key,
            store::save_api_url,
            store::get_api_url,
            canvas::courses::get_courses,
            canvas::students::get_students
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
