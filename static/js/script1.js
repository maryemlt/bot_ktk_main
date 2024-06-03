const chatbotMessage = document.getElementById("chatbotMessage");
var chatBody = document.getElementById("chatbotBody"); // Assuming this is where messages are displayed

var isloaded = 1;
// Chatbot state
export const  chatbotState = {
  productType: null,
  gender: null,
  color: null,
  washType: null,
  mills: null,
  price: null,
  max_price:null,
  min_price:null
};

function clearAndHideContainers() {
  document.querySelectorAll(".button-container").forEach((container) => {
    container.innerHTML = "";
    container.classList.add("hidden");
  });
}

// Element references
const chatbotBody = document.getElementById("chatbotBody");

// Show the chatbot when the toggle button is clicked
chatbotToggle.addEventListener("click", () => {
  chatbot.classList.toggle("open");
});

// Hide the chatbot when the header is clicked
chatbotHeader.addEventListener("click", () => {
  chatbot.classList.toggle("open");
});

// Function to add a message to the chatbot body
function addChatbotMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chatbot-message");

  const avatarImage = document.createElement("img");
  avatarImage.src =
    "https://kontakt.com.tn/web/image/292971/Chatbot%20icon.png";
  avatarImage.alt = "Avatar";
  avatarImage.style.width = "53px";
  avatarImage.style.height = "53px";
  avatarImage.style.verticalAlign = "middle";
  avatarImage.style.borderRadius = "30px";
  avatarImage.style.objectFit = "cover";
  const messageText = document.createElement("span");
  messageText.style.verticalAlign = "middle";
  messageText.textContent = message;
  if(message.toLowerCase().includes('sorry')){
    messageText.style.color = "#a5ab36";
  }

  // Append the image and text to the messageElement
  messageElement.appendChild(avatarImage);
  messageElement.appendChild(messageText);

  // Append the complete message element to the chatbot's body
  chatbotBody.appendChild(messageElement);
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

function createButton(text, containerId, handler) {
  const container = document.getElementById(containerId);
  const button = document.createElement("button");
  button.textContent = text;

  // Add a class for special styling if the button text is 'Cancel' or 'Cancel'
  if (text.toLowerCase() === "cancel" || text.toLowerCase() === "canncel") {
    button.classList.add("cancel-button");
  }
  if (text.toLowerCase() === "no") {
    button.classList.add("no-button");
  }

  button.addEventListener("click", handler);
  container.appendChild(button);
}

// Data initialization (mockup)
var productTypes = ["Denim", "Knit"];

// Load product types
export function loadProductTypes() {
  const productTypesContainer = document.getElementById("productTypesContainer");
  productTypesContainer.classList.remove("hidden");
  
  productTypes.forEach((type) => {
    createButton(type, "productTypesContainer", () => {
      chatbotState.productType = type; // Update the chatbotState right away
      
      // Display the user's selected product type
      addChatUserMessage(`Product Type: ${type}`);
      
      // Show the loading message where the bot's response will be
      showLoadingMessage(true);

      setTimeout(() => {
        // When ready to display bot response, hide the loading message
        showLoadingMessage(false);
        
        // Replace this timeout with your actual call/response handling
        // For now, we simulate a response after 3 seconds with this timeout
        addChatbotMessage(`Absolument ! Pour mieux vous aider, pourriez-vous me dire le genre que vous recherchez 🤔👤?`);

        // Simulate response received and display the actual message
        productTypesContainer.classList.add("hidden");
        // Handle the next steps, e.g., loading the next set of choices.
        loadGenders();
      }, 3000); // Simulate a delay of 3 seconds
    });
  });
}


function showLoadingMessage(show) {
  if (show) {
    // Create and add the loading skeleton where the bot's messages are shown
    const loadingSkeleton = `
      <div id="loading-container" class="loading-container">
        <div class='line'></div>
        <div class='line' style='width: 80%;'></div>
        <div class='line' style='width: 60%;'></div>
      </div>`;
    
    // Append loading skeleton to chatBody
    chatBody.insertAdjacentHTML("beforeend", loadingSkeleton);
  
    // Disable input and buttons while loading
    document.getElementById('userInput').disabled = true;
    document.getElementById('sendButton').disabled = true;
    const buttons = document.querySelectorAll(".button-container button");
    buttons.forEach((button) => {
      button.disabled = true;
      button.classList.add("disabled-button");
    });
    
  } else {
    // Remove the loading skeleton from chatBody when no longer needed
    const loadingContainer = document.getElementById("loading-container");
    if (loadingContainer) {
      loadingContainer.remove();
    }
    
    // Enable input and buttons after loading
    document.getElementById('userInput').disabled = false;
    document.getElementById('sendButton').disabled = false;
    const buttons = document.querySelectorAll(".button-container button");
    buttons.forEach((button) => {
      button.disabled = false;
      button.classList.remove("disabled-button");
    });
  }
}

// Load gender options
export function loadGenders() {
  const gendersContainer = document.getElementById("gendersContainer");
  
  // Clear any previous buttons from the container
  while (gendersContainer.firstChild) {
    gendersContainer.removeChild(gendersContainer.firstChild);
  }

  gendersContainer.classList.remove("hidden");
  const genders = ["Femme", "Homme", "Fille" , "Garçon" , "Bébés", "Cancel"];
  
  genders.forEach((gender) => {
    createButton(gender, "gendersContainer", () => {
      // Display the user's selected gender
      addChatUserMessage(`Gender: ${gender}`);
      
      // Update chatbot state with selected gender
      chatbotState.gender = gender;
      
      // Show the loading message where the bot's response will be
      showLoadingMessage(true);

      if (gender !== "Cancel") {
        fetch('/get_gender_prompt', {
          method: 'POST',
          body: new URLSearchParams({
            'lan': chatbotState.language  // Assuming chatbotState.language stores the selected language
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then(response => response.json())
        .then(data => {
          setTimeout(() => {
            // Hide the loading skeleton and display the bot message
            showLoadingMessage(false);

            addChatbotMessage(data.message);

            // Hide the Genders container and proceed to the next step
            gendersContainer.classList.add("hidden");
            loadColors();
          }, 3000);
        chatBody.scrollTop = chatBody.scrollHeight;
      });}
       else {
        // If "Cancel" is selected, go back to product types selection
        const productTypesContainer = document.getElementById("productTypesContainer");
        productTypesContainer.classList.remove("hidden");
        gendersContainer.classList.add("hidden");
        showLoadingMessage(false);
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    });
  });
}
// Load color options
function loadColors() {
  const colorsContainer = document.getElementById("colorsContainer");

  while (colorsContainer.firstChild) {
    colorsContainer.removeChild(colorsContainer.firstChild);
  }
  colorsContainer.classList.remove("hidden");

  var products = [];
  switch (chatbotState.productType) {
    case "jeans":
      if (chatbotState.gender == 'Femme') {
        products = [
          "SLIM", "MUM", "JEGGING", "SKINNY", "MUM SLIM", "MUM", "BALLOON",
          "CARGO", "CARPENTER", "STRAIGHT", "WIDE LEG", "FLARE", "CANCEL"
        ];
      }
      else if (chatbotState.gender == 'Homme') {
        products = [
          "SLIM", "lOOSE", "SKINNY", "REGULAR", "DAD",
          "CARGO", "CARPENTER", "STRAIGHT",
        ];
      }
      else if (chatbotState.gender == 'Garçon') {
        products = [
          "SLIM", "lOOSE", "SKINNY", "REGULAR", "PARACHUTE ",
          "CARGO", "CARPENTER", "STRAIGHT",
        ];
      }
      break;
    case "t-shirt":
    case "t-shirts":
      products = [
        "T-SHIRT SUR TAILLE", "T-SHIRT OVERSIZED", "T-SHIRT CROP",
        "T-SHIRT COTELE", "T-SHIRT REGULAR", "DEBARDEUR", "T-SHIRT COL TUNISIEN"
      ];
      break;
    case "tops":
    case "bodies":
      products = [
        "BODY", "TOP", "BRETELLE",
        "BRASSIÈRE", "DEBARDEUR"
      ];
      break;
    case "robes":
    case "combinaisons":
      products = [
        "ROBE EN MAILLE", "ROBE EN JEANS", "COMBINAISON",
        "SALOPETTE"
      ];
      break;
    case "jupe":
    case "jupes":
      products = [
        "JUPE EN MAILLE", "JUPE EN JEANS", "COMBINAISON",
      ];
      break;
    case "short":
    case "shorts":
      products = [
        "SHORT EN MAILLE", "SHORT EN JEANS", "SHORT EN CHAINE & TRAME",
      ];
      break;
    case "chemises-blouses":
    case "blouses":
    case "chemise":
    case "chemises":
      products = [
        "CHEMISE WESTERN"
      ];
      break;
    case "pantalons":
      products = [
        "PANTALON EN MAILLE", "PANTALON EN CHAINE ET TRAME"
      ];
      break;
    case "polos":
      products = [
        "POLO CROP",
      ];
      break;
    case "sweats":
      products = [
        "SWEAT CROPPED",
        "HOODIE REGULAR",
        "HOODIE CROPPED ",
        "HOODIE ZIPPÉ ",
      ];
      break;
    case "swimwear":
      products = [
        "SHORT DE BAIN",
      ];
      break;
    case "chaussette":
    case "chaussettes":
      products = [
        "CHAUSSETTE",
      ];
      break;
    case "joggers":
      products = [
        "JOGGER CARGO",
        "JOGGER CHINO",
        "JOGGER FLARE",
        "JOGGER SLIM",
        "JOGGER WIDE LEG",
      ];
      break;
    case "pyjamas":
      products = [
        "TOP & PANTALON",
        "TOP & SHORT",
        "TOP & PANTACOURT",
        "NUISETTE",
        "ROBE DE PYJAMA",
        "FEMME ENCEINTE",
      ];
      break;
    default:
      products = [];  // Un cas par défaut, au cas où 'productType' est autre chose
  }

  products.forEach((product) => {
    createButton(product, "colorsContainer", () => {

      chatbotState.product = product;
      addChatUserMessage(`product: ${chatbotState.product}`);
      showLoadingMessage(true);
      if (product !== "Cancel") {

        fetch('/get_color_prompt', {
          method: 'POST',
          body: new URLSearchParams({
            lan: chatbotState.language,  // Assurez-vous que la langue est stockée dans chatbotState.language
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then(response => response.json())
        .then(data => {
          const botMessage = data.message;

          setTimeout(() => {
            // Hide loading message after 3 seconds
            showLoadingMessage(false);
            addChatbotMessage(botMessage);

            colorsContainer.classList.add("hidden");
            loadPriceOptions();
          }, 3000); // 3000 milliseconds = 3 seconds
          chatBody.scrollTop = chatBody.scrollHeight;
        })
        .catch(error => console.error('Error:', error));
      } else {
        gendersContainer.classList.remove("hidden");
        colorsContainer.classList.add("hidden");
        showLoadingMessage(false);
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    });
  });
}
// Load price options
function loadPriceOptions() {
  const priceContainer = document.getElementById("priceContainer");
  const labelRange = document.getElementById("labelRange");
  
  while (priceContainer.firstChild) {
    priceContainer.removeChild(priceContainer.firstChild);
  }
  priceContainer.classList.remove("hidden");
  const priceOptions = ["No", "select your price"];
  priceOptions.forEach((option) => {
    createButton(option, "priceContainer", () => {
      chatbotState.price = option;
      addChatUserMessage(`Price: ${chatbotState.price}`);
      showLoadingMessage(true);
      if(option=="No")
    {  chatBody.scrollTop = chatBody.scrollHeight;
      fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatbotState),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            showLoadingMessage(false);
           
            data.forEach((item) => {
              // Create anchor element to represent the product as a clickable link
              const productLink = document.createElement("a");
              productLink.href = item.url; // Set the href to the product's URL
              productLink.textContent = item.name + " " + item.code; // Set link text to the product's name
              productLink.target = "_blank"; // Open links in a new tab
              productLink.style.display = "block"; // Display link as a block for better readability

              // Append the link to the chatbot's body
              chatbotBody.appendChild(productLink);
              chatBody.scrollTop = chatBody.scrollHeight;
            });
          } else {
            showLoadingMessage(false);
     
            addChatbotMessage(
              "Désolé 😞, je n'ai trouvé aucun produit. Veuillez choisir une autre option."
            );
            loadColors();
            chatBody.scrollTop = chatBody.scrollHeight;
          }
        })
        resetChat
        .catch((error) => {
          showLoadingMessage(false);
          addChatbotMessage(
            "Désolé 😞, j'ai un problème. Veuillez recharger la page. 🔄"
          );
          

          chatBody.scrollTop = chatBody.scrollHeight;
        });}
        else{
          console.log(option)
          loadPriceRange()
          showLoadingMessage(false);
        }

      priceContainer.classList.add("hidden");
      labelRange.classList.add("hidden");
    });
  });
}
function loadPriceRange() {
  const priceRange = document.getElementById("priceRange");
  const minLabel = document.getElementById('priceMinLabel');
  const maxLabel = document.getElementById('priceMaxLabel');
  while (priceRange.firstChild) {
    priceRange.removeChild(priceRange.firstChild);
  }
  priceRange.classList.remove("hidden");


  createRange('priceRange', 1, 500, 1, 2, 199);
  minLabel.classList.remove("hidden");
  maxLabel.classList.remove("hidden");



 
}

function createRange(containerId, min, max, step) {
  const container = document.getElementById(containerId);
  const minLabel = document.getElementById('priceMinLabel');
  const maxLabel = document.getElementById('priceMaxLabel');

  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }
  if (container.noUiSlider) {
    container.noUiSlider.destroy(); 
}
  noUiSlider.create(container, {
    start: [min, max],
    connect: true,
    step: step,
    range: {
      'min': min,
      'max': max
    },
    format: {
      // Formatting and parsing the values of the slider handle elements
      to: function(value) {
        return Math.round(value);
      },
      from: function(value) {
        return Math.round(value);
      }
    }
  });

  // When the slider value changes, update the value labels.
  container.noUiSlider.on('update', function (values, handle) {
    if (handle === 0) { // Handle 0 is the left handle
      minLabel.textContent = `Min: ${values[handle]}`;
      chatbotState.min_price = values[handle];

      
    } else { // Handle 1 is the right handle
      maxLabel.textContent = `Max: ${values[handle]}`;
      chatbotState.max_price = values[handle];
    }
  });
  const okPrice = document.getElementById("okPrice");
  const labelRange = document.getElementById("labelRange");
  const priceMinLabel = document.getElementById("priceMinLabel");

  const priceMaxLabel = document.getElementById("priceMaxLabel");

  while (okPrice.firstChild) {
    okPrice.removeChild(okPrice.firstChild);
  }
  okPrice.classList.remove("hidden");
  labelRange.classList.remove("hidden");
  createButton('Ok', "okPrice", () => {



    chatBody.scrollTop = chatBody.scrollHeight;
      fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatbotState),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            showLoadingMessage(false);
           
            data.forEach((item) => {
              // Create anchor element to represent the product as a clickable link
              const productLink = document.createElement("a");
              productLink.href = item.url; // Set the href to the product's URL
              productLink.textContent = item.name + " " + item.code; // Set link text to the product's name
              productLink.target = "_blank"; // Open links in a new tab
              productLink.style.display = "block"; // Display link as a block for better readability

              // Append the link to the chatbot's body
              chatbotBody.appendChild(productLink);
              chatBody.scrollTop = chatBody.scrollHeight;
              okPrice.classList.add("hidden");
              priceMinLabel.classList.add("hidden");
              priceMaxLabel.classList.add("hidden");
              priceRange.classList.add("hidden");
            });
          } else {
            showLoadingMessage(false);
     
            addChatbotMessage(
              " Malheureusement 😞, je n'ai trouvé aucun produit. Veuillez choisir une autre option."
            );
            loadColors();
            priceRange.classList.add("hidden");
            labelRange.classList.add("hidden");
            okPrice.classList.add("hidden");
    
            chatBody.scrollTop = chatBody.scrollHeight;
          }
        })

        .catch((error) => {
          showLoadingMessage(false);
          addChatbotMessage(
            " Veuillez recharger la page. 🔄"
          );
          

          chatBody.scrollTop = chatBody.scrollHeight;
        });
  });
}



























function displayProductTypes() {
  clearAndHideContainers();
  var productTypes = ["Denim", "Knit"];
  displayButtons(
    productTypesContainer,
    productTypes,
    handleProductTypeSelection
  );
}

function handleProductTypeSelection(productType) {
  chatbotMessage.textContent = `Vous choisissez ${productType}. Quel genre recherchez-vous ?`;
  
  displayButtons(
    gendersContainer,
    ["Women", "Men", "Unisex", "Kids"],
    handleGenderSelection
  );
}

function handleGenderSelection(gender) {
  chatbotMessage.textContent = `What color of ${gender} are you looking for?`;
  // Continue with the logic for selecting color, wash type, etc...
}

// Generic function to display buttons
function displayButtons(container, options, callback) {
  container.innerHTML = "";
  container.classList.remove("hidden");
  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => callback(option);
    container.appendChild(button);
  });
}

// Initialize the chatbot interaction by displaying the product types
//   displayProductTypes();

// Function to reset the chat and start over (optional)
function resetChat() {
  chatbotState.productType = null;
  chatbotState.gender = null;
  chatbotState.color = null;
  chatbotState.washType = null;
  chatbotState.mills = null;
  chatbotState.price = null;
 
  var initialHtmlContent = `
  <div id="start_conv">
    <img src="https://kontakt.com.tn/web/image/292971/Chatbot%20icon.png" alt="Avatar" style="width: 40px; height: 40px; vertical-align: middle;border-radius: 30px;object-fit: cover;" />
    <span style="vertical-align: middle"> Marhba bik sur KONTAKT 🥰! Nous vous proposons une large sélection de produits pour femmes, hommes, enfants et bébés . 👖👚 kifech najmou naawnouk ?</span>
  </div>
  <!-- Interaction flow containers -->
  <div id="chatbotMsg"></div>`;
 
  var chatbotBody = document.getElementById("chatbotBody");
  chatbotBody.innerHTML = initialHtmlContent;
  document.getElementById("productTypesContainer").innerHTML = "";
  document.getElementById("gendersContainer").innerHTML = "";
  document.getElementById("colorsContainer").innerHTML = "";
  document.getElementById("washTypesContainer").innerHTML = "";
  document.getElementById("millsContainer").innerHTML = "";
  document.getElementById("priceContainer").innerHTML = "";
 
  // Hide all containers except the product types
  document.getElementById("gendersContainer").classList.add("hidden");
  document.getElementById("colorsContainer").classList.add("hidden");
  document.getElementById("washTypesContainer").classList.add("hidden");
  document.getElementById("millsContainer").classList.add("hidden");
  document.getElementById("priceContainer").classList.add("hidden");
 
}
 
window.resetChat = resetChat;
// Initialization
/* loadProductTypes();
 */
