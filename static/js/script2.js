var chatbot = document.getElementById("chatbot");
var chatbotToggle = document.getElementById("chatbotToggle");
var userInput = document.getElementById("userInput");
var sendButton = document.getElementById("sendButton");
var loadingIndicator = document.getElementById("loading");
var chatbotHeader = document.getElementById("chatbotHeader");
var product_type;
import { loadGenders,chatbotState ,loadColors} from './script1.js';
var loadGendersCalled = false; // Add a flag to track if loadGenders has been called

// Toggle chatbot visibility
chatbotToggle.onclick = function () {
  // chatbot.removeClass("close");
};
 
// Handle sending messages
sendButton.onclick = sendMessage;
 
// Enable sending message with Enter key
userInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});
/*  function sendMessage() {
  var userText = userInput.value.trim();
  if (userText) {
    // Send the message to the server
    // Show loading indicator and disable elements
    loadingIndicator.style.display = "block";
    userInput.disabled = true;
    sendButton.disabled = true;
    buttons = document.querySelectorAll(".button-container button"); // Select all buttons within container
 
    // Disable all buttons
    buttons.forEach((button) => {
      button.disabled = true;
      button.classList.add("disabled-button"); // Add the class for the disabled state
    });
 
    fetch("/send_message", {
      method: "POST",
      body: new URLSearchParams({
        user_input: userText,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        var chatBody = document.getElementById("chatbotBody");
 
        chatBody.innerHTML +=
          "<div style='margin-bottom: 10px;'><img src='https://cdn-icons-png.flaticon.com/512/1077/1077114.png' alt='Avatar' style='width: 40px; height: 40px; vertical-align: middle;border-radius: 30px;object-fit: cover;' /> " +
          "<span style='vertical-align: middle;'>" +
          userText +
          "</span></div>";
        chatBody.innerHTML +=
          "<div style='margin-bottom: 10px;'><img src='https://shop.demcointer.com/static/media/logo_green.8794fe38.svg' alt='Avatar' style='width: 40px; height: 40px; vertical-align: middle;border-radius: 30px;object-fit: cover;' /> " +
          "<span style='vertical-align: middle;'>" +
          data.bot_response +
          "</span></div>";
 
        // Hide loading indicator and enable elements
        loadingIndicator.style.display = "none";
        userInput.disabled = false;
        sendButton.disabled = false;
        // Enable all buttons
        buttons.forEach((button) => {
          button.disabled = false;
          button.classList.remove("disabled-button"); // Remove the class for the disabled state
        });
 
        // Scroll to the newest message
        chatBody.scrollTop = chatBody.scrollHeight;
 
        userInput.value = ""; // Clear input after sending
      })
      .catch((error) => {
        console.error("Error:", error);
        // Hide loading indicator and enable input and button in case of error
        loadingIndicator.style.display = "none";
        userInput.disabled = false;
        sendButton.disabled = false;
      });
  }
}  */
 
function sendMessage() {
  var userInput = document.getElementById('userInput');
  var sendButton = document.getElementById('sendButton');
  var userText = userInput.value.trim();
 
  if (userText) {
 
    var uniqueLoadingId = 'loading-' + Date.now();
    var chatBody = document.getElementById('chatbotBody');
 
    chatBody.innerHTML +=
      "<div style='margin-bottom: 10px;'><img src='https://cdn-icons-png.flaticon.com/512/1077/1077114.png' alt='Avatar' style='width: 30px; height: 30px; vertical-align: middle;border-radius: 30px;object-fit: cover;' /> " +
      "<span style='vertical-align: middle;'>" +
      userText +
      "</span></div>";
    chatBody.innerHTML +=
      "<div id='" + uniqueLoadingId + "' class='loading-container'>" +
      "<div class='line'></div>" +
      "<div class='line' style='width: 80%;'></div>" + 
      "<div class='line' style='width: 60%;'></div>" + 
      "</div>";
 
    userInput.disabled = true;
    sendButton.disabled = true;
    sendButton.classList.add('disabled-button');
    chatBody.scrollTop = chatBody.scrollHeight;
    var buttons = document.querySelectorAll('.button-container button');
    buttons.forEach((button) => {
      button.disabled = true;
      button.classList.add('disabled-button');
    });
 
    fetch('/send_message', {
      method: 'POST',
      body: new URLSearchParams({
        user_input: userText,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      var loadingContainer = document.getElementById(uniqueLoadingId);
      product_type=data.product_mentioned;
      if (loadGendersCalled && data.bot_response.includes("🤔👤?")) {
        fetch('/get_gender_prompt', {
          method: 'POST',
          body: new URLSearchParams({
            'lan': chatbotState.language  // Assuming chatbotState.language stores the selected language
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        })
        .then(response => response.json()) // Parse the response as JSON
        .then(genderPromptData => {
          const genderPrompt = genderPromptData.message; // Extract the message field
          loadingContainer.outerHTML = "<div style='margin-bottom: 10px;'>" +
            "<img src='https://kontakt.com.tn/web/image/292971/Chatbot%20icon.png' alt='Avatar' style='width: 53px; height: 53px; vertical-align: middle;border-radius: 30px;object-fit: cover;' /> " +
            "<span style='vertical-align: middle;'>" + genderPrompt + "</span></div>";
          
          loadColors();
        })
        .catch(error => {
          console.error('Error fetching gender prompt:', error);
        });

    }else{
      loadingContainer.outerHTML ="<div style='margin-bottom: 10px;'>" +
      "<img src='https://kontakt.com.tn/web/image/292971/Chatbot%20icon.png' alt='Avatar' style='width: 53px; height: 53px; vertical-align: middle;border-radius: 30px;object-fit: cover;' /> " +
      "<span style='vertical-align: middle;'>" +
      data.bot_response +
      "</span></div>";
    }
    
        if(product_type!="No product"){
        chatbotState.productType=product_type
        const gendersContainer = document.getElementById("gendersContainer");
        // Clear any previous buttons from the container
        while (gendersContainer.firstChild) {
          gendersContainer.removeChild(gendersContainer.firstChild);
        }
 
        const colorsContainer = document.getElementById("colorsContainer");
 
  while (colorsContainer.firstChild) {
    colorsContainer.removeChild(colorsContainer.firstChild);
  }
  const washTypesContainer = document.getElementById("washTypesContainer");
 
  while (washTypesContainer.firstChild) {
    washTypesContainer.removeChild(washTypesContainer.firstChild);
  }
 
  const millsContainer = document.getElementById("millsContainer");
 
  while (millsContainer.firstChild) {
    millsContainer.removeChild(millsContainer.firstChild);
  }
  const priceContainer = document.getElementById("priceContainer");
  while (priceContainer.firstChild) {
    priceContainer.removeChild(priceContainer.firstChild);
  }   
  if (!loadGendersCalled) {
    loadGenders();
    loadGendersCalled = true; // Set the flag to true after calling loadGenders
  }else{
    loadColors()
  }


      }else{
 
        
        const gendersContainer = document.getElementById("gendersContainer");
        // Clear any previous buttons from the container
        while (gendersContainer.firstChild) {
          gendersContainer.removeChild(gendersContainer.firstChild);
        }
 
        const colorsContainer = document.getElementById("colorsContainer");
 
  while (colorsContainer.firstChild) {
    colorsContainer.removeChild(colorsContainer.firstChild);
  }
  const washTypesContainer = document.getElementById("washTypesContainer");
 
  while (washTypesContainer.firstChild) {
    washTypesContainer.removeChild(washTypesContainer.firstChild);
  }
 
  const millsContainer = document.getElementById("millsContainer");
 
  while (millsContainer.firstChild) {
    millsContainer.removeChild(millsContainer.firstChild);
  }
  const priceContainer = document.getElementById("priceContainer");
  while (priceContainer.firstChild) {
    priceContainer.removeChild(priceContainer.firstChild);
  }
      }
      userInput.disabled = false;
      sendButton.disabled = false;
      sendButton.classList.remove('disabled-button');
      buttons.forEach((button) => {
        button.disabled = false;
        button.classList.remove('disabled-button');
      });
 
      chatBody.scrollTop = chatBody.scrollHeight;
 
      userInput.value = '';
    })
    .catch((error) => {
      console.error('Error:', error);
      var loadingContainer = document.getElementById(uniqueLoadingId);
      if (loadingContainer) {
        loadingContainer.outerHTML = '';
      }
 
      userInput.disabled = false;
      sendButton.disabled = false;
      buttons.forEach((button) => {
        button.disabled = false;
        button.classList.remove('disabled-button');
      });
    });
  }
}
 
// Collapse chatbot when header is clicked
chatbotHeader.onclick = function () {
  chatbot.classList.toggle("open");
};