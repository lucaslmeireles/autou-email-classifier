/**
 * Mounts the results in the result div
 * @param {Object} data - The data to be mounted
 */
const mountResults = (data) => {
  document.querySelector(".result").style.display = "block";
  document.querySelector(".result").innerHTML = `
                    <h2>Resultado</h2>
                    <div class="classification-result">
                        <p class="classification-result-text">Classificação:${
                          data.classification || "N/A"
                        }</p>
                        ${
                          data.accuracy
                            ? `<p><strong>Eficiência:</strong> ${data.accuracy}</p>`
                            : ""
                        }
                        <p class="classification-result-indicators">
                                Com base nesses indicadores seu texto foi classificado
                        </p>
                        ${
                          data.keywords
                            ? `<p><strong>Indicadores:</strong> ${data.keywords.join(
                                ", "
                              )}</p>
                              
                              `
                            : ""
                        }
                        ${
                          data.quick_responses
                            ? `<div class="quick-responses">
                                <p><strong>Respostas Rápidas:</strong></p>
                                <ul>${data.quick_responses
                                  .map((resp) => `<li>${resp}</li>`)
                                  .join("")}</ul>
                             </div>`
                            : ""
                        }
                    </div>
                `;
};

/**
 * Resets the form after a submission
 */
const resetForm = () => {
  const form = document.getElementById("classify-form");
  const fileInput = document.getElementById("fileInput");
  form.reset();
  fileInput.value = "";
};

/**
 * handles the form submission
 * @param {Event} event - The form submission event
 * @returns {Promise<void>}
 */
const onSubmit = async (event) => {
  event.preventDefault();
  const form = event.target;
  const emailFile = document.getElementById("fileInput").files[0];
  const emailContent = form.email.value.trim();

  // Validate that at least one input is provided
  if (!emailContent && !emailFile) {
    alert("Please enter an email text or upload a file.");
    return;
  }

  try {
    let response;

    // If there's a file, use file upload endpoint
    if (emailFile) {
      const body = new FormData();
      body.append("file", emailFile);
      response = await fetch("/uploadfile", {
        method: "POST",
        body: body,
      });
    }
    // Otherwise use the text endpoint
    else if (emailContent) {
      response = await fetch("/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailContent,
        }),
      });
    }

    if (response.ok) {
      const responseText = await response.text();
      const data = JSON.parse(responseText);
      mountResults(data);
      resetForm();
    } else {
      const errorText = await response.text();
      let errorMessage = "Unknown error";
      try {
        const errorData = JSON.parse(errorText);
        errorMessage =
          errorData.detail || errorData.error || JSON.stringify(errorData);
      } catch {
        errorMessage = errorText;
      }
      alert(`Error: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Submission error:", error);
    alert(`Error: ${error.message}`);
  }
};

const form = document.getElementById("classify-form");
form.addEventListener("submit", onSubmit);
