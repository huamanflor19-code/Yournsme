// Tu clave de API (seguro en repo privado)
const API_KEY = "AIzaSyDGOEA2AtjXUCKmO45RLr3t535438aFFsk";

async function generateImage() {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");
  output.innerHTML = "⏳ Generando imagen...";

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (data.candidates && data.candidates[0].content.parts[0].inlineData) {
      const imageBase64 = data.candidates[0].content.parts[0].inlineData.data;
      const img = document.createElement("img");
      img.src = "data:image/png;base64," + imageBase64;
      output.innerHTML = "";
      output.appendChild(img);
    } else {
      output.innerHTML = "❌ No se pudo generar imagen.";
      console.log(data);
    }
  } catch (err) {
    console.error(err);
    output.innerHTML = "❌ Error al conectar con la API.";
  }
}
