async function previewUrl() {
    let url = document.getElementById("urlInput").value;
    
    try {
        let response = await fetch("/api/v1/urls/preview?url=" + encodeURIComponent(url));
        
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        let previewHTML = await response.text();
        displayPreviews(previewHTML);
        
    } catch (error) {
        displayPreviews(`An error occurred: ${error.message}`);
    }
}

function displayPreviews(previewHTML) {
    // This function updates the page with the HTML content or error message
    document.getElementById("url_previews").innerHTML = previewHTML;
}
