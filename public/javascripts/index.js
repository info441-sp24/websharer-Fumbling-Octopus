async function previewUrl() {
    let url = document.getElementById("urlInput").value;
    
    try {
        // Update the fetch call to the new API endpoint and include the URL as a query parameter
        let response = await fetch("/api/v1/urls/preview?url=" + encodeURIComponent(url));
        
        // Check if the fetch request was successful
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        // Get the text from the response, which should be a string of HTML
        let previewHTML = await response.text();
        
        // Call displayPreviews function with the HTML that came back from the request
        displayPreviews(previewHTML);
    } catch (error) {
        // If there's an error, call displayPreviews function with an error message
        displayPreviews(`An error occurred: ${error.message}`);
    }
}

function displayPreviews(previewHTML) {
    // This function updates the page with the HTML content or error message
    document.getElementById("url_previews").innerHTML = previewHTML;
}
