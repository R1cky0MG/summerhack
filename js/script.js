// js/chat-client.js
document.addEventListener("DOMContentLoaded", () => {
  // Определяем, какой чат открыть по имени файла в URL
 const API_URL = window.API_URL; 

  const input    = document.querySelector(".input-area input");
  const button   = document.querySelector(".input-area button");
  const chatMain = document.querySelector(".chat-main");
  const chatTitle   = document.querySelector(".chat-title");
  const suggestions = document.querySelector(".suggestions");

  // Функция для вывода сообщения в чат
  function appendMessage(role, text) {
    const msg = document.createElement("div");
    msg.className = `message ${role}`;
    msg.textContent = text;
    chatMain.appendChild(msg);
    // Автопрокрутка в конец
    chatMain.scrollTop = chatMain.scrollHeight;
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
    chatTitle.style.display = "none";
    suggestions.style.display = "none";
    if (!q) return;
    sendToAI(q);
    input.value = "";
  });

  // Enter в поле ввода
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const q = input.value.trim();
      chatTitle.style.display = "none";
      suggestions.style.display = "none";
      if (!q) return;
      sendToAI(q);
      input.value = "";
    }
  });
});
