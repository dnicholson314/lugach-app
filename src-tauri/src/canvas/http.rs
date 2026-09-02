/// Collect all pages of a Canvas paginated endpoint into a `Vec<T>`.
pub async fn fetch_all_pages<T>(
    client: &reqwest::Client,
    api_key: &str,
    first_url: String,
) -> Result<Vec<T>, String>
where
    T: serde::de::DeserializeOwned,
{
    let mut items: Vec<T> = Vec::new();
    let mut next_url: Option<String> = Some(first_url);

    while let Some(url) = next_url.take() {
        let response = client
            .get(&url)
            .header("Authorization", format!("Bearer {}", api_key))
            .send()
            .await
            .map_err(|e| format!("HTTP request failed: {}", e))?;

        if !response.status().is_success() {
            return Err(format!(
                "Canvas API returned an error: {}",
                response.status()
            ));
        }

        next_url = parse_next_link(response.headers());

        let page: Vec<T> = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse Canvas response: {}", e))?;

        items.extend(page);
    }

    Ok(items)
}

/// Extract the URL for the next page from Canvas's `Link` response header.
///
/// Canvas follows RFC 5988.  A typical header value looks like:
/// `<https://…/courses?page=2&per_page=50>; rel="next", <…>; rel="last"`
pub fn parse_next_link(headers: &reqwest::header::HeaderMap) -> Option<String> {
    let link_header = headers.get("link")?.to_str().ok()?;

    for part in link_header.split(',') {
        let mut segments = part.trim().splitn(2, ';');
        let url_part = segments.next()?.trim();
        let rel_part = segments.next()?.trim();

        if rel_part.contains("rel=\"next\"") {
            let url = url_part
                .trim_start_matches('<')
                .trim_end_matches('>')
                .to_string();
            return Some(url);
        }
    }

    None
}
