// DOM elemanlarını seçme
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");


let userMessage;
const apiKey = "AIzaSyD6Mw0yG8kmGi9L0IQiJnPft8wJnw9l3GY";
const inputInitHeight = chatInput.scrollHeight;

// Sohbet listesi elemanı (li) oluşturma fonksiyonu
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  
  const chatContent = className === "outgoing" 
    ? `<img src="image/403022_business man_male_user_avatar_profile_icon.png" alt="Chatbot Profile" class="chatbot-profile"><p></p>` 
    : `<img src="image/2730384_deep_dive_inkcontober_robot_suit_icon.png" alt="Chatbot Profile" class="chatbot-profile"><p></p>`;
  
  const timestamp = new Date().toLocaleTimeString();
  chatLi.innerHTML = `${chatContent} <span class="timestamp">${timestamp}</span>`
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

// Chatbot cevabı oluşturma fonksiyonu
const generateResponse = (incomingChatLi) => {
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
  const messageElement = incomingChatLi.querySelector("p");

  messageElement.textContent = "Cevap oluşturuluyor...";

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ 
        role: "user", 
        parts: [{ text: userMessage }] 
      }]
    }),
  };

  fetch(API_URL, requestOptions)
    .then(res => res.json())
    .then(data => {
      messageElement.textContent = data.candidates[0].content.parts[0].text; 
    })
    .catch(() => {
      messageElement.classList.add("error");
      messageElement.textContent = "Oops! Bir şeyler ters gitti. Lütfen tekrar deneyin.";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

// Sohbet girişini işleme fonksiyonu
const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  const outgoingChatLi = createChatLi(userMessage, "outgoing");
  chatbox.appendChild(outgoingChatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const incomingChatLi = createChatLi("", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

// Metin alanı yüksekliğini dinamik olarak ayarlama
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// 'Enter' tuşunu mesaj göndermek için kullanma
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

// Mesaj gönderme ve chatbot görünürlüğünü değiştirme için olay dinleyicileri
sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
