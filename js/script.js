// js/chat-client.js
document.addEventListener("DOMContentLoaded", () => {
  // Определяем, какой чат открыть по имени файла в URL
 const API_URL = window.API_URL; 

  const input    = document.querySelector(".input-area input");
  const button   = document.querySelector(".input-area button");
  const chatMain = document.querySelector(".chat-main");
  const messages = document.querySelector(".messages");
  const chatTitle   = document.querySelector(".chat-title");
  const suggestions = document.querySelector(".suggestions");

    function hideIntro() {
    chatTitle.classList.add("hidden");
    suggestions.classList.add("hidden");
  }
  // Функция для вывода сообщения в чат
  function appendMessage(role, text) {
  if (!chatTitle.classList.contains("hidden")) {
      hideIntro();
    }
    const msg = document.createElement("div");
    msg.className = `message ${role}`;
    msg.textContent = text;
    messages.appendChild(msg);                // ← используем контейнер
    messages.scrollTop = messages.scrollHeight;
  }
  // Обработчик отправки
  async function sendToAI(question)
   {
    appendMessage("user", question);
    try {
      const res = await fetch(API_URL, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
      const data = await res.json();
      appendMessage("assistant", data.answer || data.error || "Нет ответа");
    } catch (err) {
      console.error(err);
      appendMessage("assistant", "Ошибка подключения к серверу");
    }
  }

  // Клик по кнопке
  button.addEventListener("click", () => {
    const q = input.value.trim();
    if (!q) return;
      sendToAI(q);
      input.value = "";
  });

  // Enter в поле ввода
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const q = input.value.trim();
      if (!q) return;
        sendToAI(q);
        input.value = "";
    }
  });
});
