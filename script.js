// ⚠️ Coloca aquí tu API Key (en privado)
const API_KEY = "AIzaSyDGOEA2AtjXUCKmO45RLr3t535438aFFsk";

let lastImageBase64 = null;

async function generateImage() {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");
  const downloadBtn = document.getElementById("downloadBtn");

  output.innerHTML = "⏳ Generando imagen...";
  downloadBtn.style.display = "none";

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.4,
          }
        })
      }
    );

    const data = await response.json();
    console.log("Respuesta completa:", data); // 👀 debug

    if (
      data.candidates &&
      data.candidates[0].content.parts[0].inlineData &&
      data.candidates[0].content.parts[0].inlineData.data
    ) {
      lastImageBase64 = data.candidates[0].content.parts[0].inlineData.data;

      const img = document.createElement("img");
      img.src = "data:image/png;base64," + lastImageBase64;
      output.innerHTML = "";
      output.appendChild(img);

      downloadBtn.style.display = "inline-block";
    } else {
      output.innerHTML = "❌ La API no devolvió imagen (revisa consola).";
    }
  } catch (err) {
    console.error("Error al llamar API:", err);
    output.innerHTML = "❌ Error al conectar con la API.";
  }
}

function downloadImage() {
  if (!lastImageBase64) return;

  const link = document.createElement("a");
  link.href = "data:image/png;base64," + lastImageBase64;
  link.download = "imagen-gemini.png";
  link.click();
}
