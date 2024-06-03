function selectLang(lan){
    fetch('/choose_lang', {
      method: 'POST',
      body: new URLSearchParams({
        lan: lan,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((response) => response.json()).then((data) => {
      console.log(data.language)
      addChatUserMessage(`Language Selected: ${data.language}`);

      const lang = document.getElementById("lang");
      const userInput=document.getElementById("userInput");
      const sendButton=document.getElementById("sendButton");
      userInput.disabled = false;
      sendButton.disabled = false; 
      while (lang.firstChild) {
        lang.removeChild(lang.firstChild);
      }
      lang.classList.add("hidden");
    })
  
  }
  

  function addChatUserMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chatbot-message");
  
    const avatarImage = document.createElement("img");
    avatarImage.src = "https://cdn-icons-png.flaticon.com/512/1077/1077114.png";
    avatarImage.alt = "Avatar";
    avatarImage.style.width = "40px";
    avatarImage.style.height = "40px";
    avatarImage.style.verticalAlign = "middle";
    avatarImage.style.borderRadius = "30px";
    avatarImage.style.objectFit = "cover";
  
    const messageText = document.createElement("span");
    messageText.style.verticalAlign = "middle";
    messageText.textContent = message;
  
    // Append the image and text to the messageElement
    messageElement.appendChild(avatarImage);
    messageElement.appendChild(messageText);
  
    // Append the complete message element to the chatbot's body
    chatbotBody.appendChild(messageElement);
  }
  