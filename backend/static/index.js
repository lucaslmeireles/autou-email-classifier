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
                        ${
                          data.keywords
                            ? `<p><strong>Indicadores:</strong> ${data.keywords.join(
                                ", "
                              )}</p>
                              <p class="classification-result-indicators">
                                Com base nesses indicadores seu texto foi classificado
                              </p>
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
  console.log("Form email element:", form.email);
  const emailFile = document.getElementById("fileInput").files[0];
  const emailContent = form.email.value.trim();
  if (!emailContent && !emailFile) {
    alert("Please enter an email text or upload a file.");
    return;
  }

  //There're two endpoints, one for only text and one for file, in this IF statement
  //we check wich one is the user sending
  if (emailFile) {
    const body = new FormData();
    body.append("file", emailFile);
    try {
      const response = await fetch("/uploadfile", {
        method: "POST",
        body: body,
      });

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
  } else {
    try {
      const response = await fetch("/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailContent,
        }),
      });

      if (response.ok) {
        const responseText = await response.text();
        const data = JSON.parse(responseText);
        mountResults(data);
        resetForm();
      } else {
        const errorText = await response.text();
        console.error("API Error:", errorText);
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
  }
};

const form = document.getElementById("classify-form");
form.addEventListener("submit", onSubmit);
