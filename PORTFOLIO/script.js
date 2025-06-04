document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadResumeBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Check if the elements exist to prevent errors if running on other pages
    if (downloadBtn && loadingSpinner) {
        const resumePath = downloadBtn.getAttribute('href'); // Get the resume PDF path

        downloadBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default download immediately

            // Show the loading spinner
            loadingSpinner.classList.add('active');

            // Simulate loading time (e.g., 2 seconds)
            setTimeout(() => {
                // Create a temporary anchor element to trigger download
                const tempLink = document.createElement('a');
                tempLink.href = resumePath;
                tempLink.download = 'NIVESH_R_RESUME.pdf'; // Suggested filename for download (matches your file)
                document.body.appendChild(tempLink);
                tempLink.click(); // Programmatically click the link to start download
                document.body.removeChild(tempLink); // Clean up the temporary link

                // Hide the loading spinner
                loadingSpinner.classList.remove('active');
            }, 1000); // 2000 milliseconds = 2 seconds
        });
    }
});