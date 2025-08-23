const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const fileBtn = document.getElementById("file-btn");
const fileInput = document.getElementById("file-input");

// 🔑 API Key de Gemini (solo para pruebas privadas, no lo subas público)
const API_KEY = "AIzaSyDGOEA2AtjXUCKmO45RLr3t535438aFFsk";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

// Función para agregar mensajes al chat
function addMessage(text, sender = "user") {
  const message = document.createElement("div");
  message.classList.add("message", sender === "user" ? "user-message" : "bot-message");
  message.innerText = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Llamada a la API de Gemini
async function getBotResponse(userMessage) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }]
          }
        ]
      })
    });

    // Si no responde bien la API
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Gemini response:", data);

    // Extraer respuesta del modelo
    const botReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ La IA no devolvió respuesta.";

    addMessage(botReply, "bot");

  } catch (error) {
    console.error("Error con la API:", error);
    addMessage("❌ Error al conectar con Gemini.", "bot");
  }
}

// Evento de enviar mensaje
sendBtn.addEventListener("click", () => {
  const text = userInput.value.trim();
  if (text) {
    addMessage(text, "user");
    userInput.value = "";
    getBotResponse(text);
  }
});

// Enviar con Enter
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// Adjuntar archivos
fileBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    addMessage(`📎 Archivo: ${file.name}`, "user");
  }
});
