const onSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    console.log("Form email element:", form.email);
    const emailFile = document.getElementById('fileInput').files[0];
    const emailContent = form.email.value.trim();
    if (!emailContent && !emailFile) {
        alert('Please enter an email text or upload a file.');
        return;
    }
    
    console.log("Email content being sent:", emailContent);
    if (emailFile) {
        console.log("Email file being sent:", emailFile);
        const body = new FormData();
        body.append('file', emailFile)
        try {
            const response = await fetch("/uploadfile", {
                method: 'POST',
                
                body: body
            });
    
            if (response.ok) {
                const responseText = await response.text()
                const data = JSON.parse(responseText);
                
                
                // Display all the response data in a more structured way
                document.querySelector('.result').innerHTML = `
                    <h2>Resultado</h2>
                    <div class="classification-result">
                        <p><strong>Classification:</strong> ${data.classification || 'N/A'}</p>
                        ${data.accuracy ? `<p><strong>Accuracy:</strong> ${data.accuracy}</p>` : ''}
                        ${data.keywords ? `<p><strong>Keywords:</strong> ${data.keywords.join(', ')}</p>` : ''}
                        ${data.quick_responses ? 
                            `<div class="quick-responses">
                                <p><strong>Quick Responses:</strong></p>
                                <ul>${data.quick_responses.map(resp => `<li>${resp}</li>`).join('')}</ul>
                             </div>` : ''}
                    </div>
                `;
            } else {
                const errorText = await response.text();
                console.error("API Error:", errorText);
                let errorMessage = "Unknown error";
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.detail || errorData.error || JSON.stringify(errorData);
                } catch {
                    errorMessage = errorText;
                }
                alert(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert(`Error: ${error.message}`);
        }
    } else  {
        try {
            const response = await fetch("/classify", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailContent
                })
            });
    
            if (response.ok) {
                const responseText = await response.text()
                const data = JSON.parse(responseText);
                
                
                // Display all the response data in a more structured way
                document.querySelector('.result').innerHTML = `
                    <h2>Resultado</h2>
                    <div class="classification-result">
                        <p><strong>Classification:</strong> ${data.classification || 'N/A'}</p>
                        ${data.accuracy ? `<p><strong>Accuracy:</strong> ${data.accuracy}</p>` : ''}
                        ${data.keywords ? `<p><strong>Keywords:</strong> ${data.keywords.join(', ')}</p>` : ''}
                        ${data.quick_responses ? 
                            `<div class="quick-responses">
                                <p><strong>Quick Responses:</strong></p>
                                <ul>${data.quick_responses.map(resp => `<li>${resp}</li>`).join('')}</ul>
                             </div>` : ''}
                    </div>
                `;
            } else {
                const errorText = await response.text();
                console.error("API Error:", errorText);
                let errorMessage = "Unknown error";
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.detail || errorData.error || JSON.stringify(errorData);
                } catch {
                    errorMessage = errorText;
                }
                alert(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert(`Error: ${error.message}`);
        }
    }
    
};
const onSelectFile = (event) => {}
const form = document.getElementById('classify-form');
form.addEventListener('submit', onSubmit);
