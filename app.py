from flask import Flask, request, render_template, jsonify, send_from_directory
import os
import fitz  # Importing PyMuPDF for PDF text extraction
from g4f.client import Client
import copy
import json
import requests


import xmlrpc.client
from datetime import datetime


app = Flask(__name__)

API_PRODUCTS = os.getenv('API_PRODUCTS')


url = "https://kontakt.com.tn"
db = "AllFashions"
username = 'fmh@demcointer.com'
password = 'dmc@280467'


# Helper function to extract text from a single PDF
def extract_single_pdf_text(pdf_path):
    with fitz.open(pdf_path) as pdf:
        text = ""
        for page in pdf:
            text += page.get_text()
    return text

# Function to extract text from all PDFs in a given directory and concatenate it
def extract_text_from_pdf_directory(pdf_directory):
    combined_text = ""
    for filename in os.listdir(pdf_directory):
        if filename.lower().endswith('.pdf'):
            pdf_path = os.path.join(pdf_directory, filename)
            combined_text += extract_single_pdf_text(pdf_path) + "\n\n"
    return combined_text

# Replace 'path/to/knowledge_base_directory' with the actual directory that contains your PDF files
pdf_directory = 'docs'
combined_pdf_text = extract_text_from_pdf_directory(pdf_directory)
lan="darija tunisienne."
# Instructions for the chatbot
instructions = (
 
    "You utilize solely the knowledge base. "
   "You only respond in darija tunisienne."
   "You generate text only in English , in French or darija tunisienne"
   "You only respond in English , in French or darija tunisienne"
   "Always respond in the same language used by the user, whether it is English, French, or Tunisian Darija."
 "You add an emoji at the end of the chat phrase."
  #"if you generate links, make sure they are clickable."

 " Remember the context and history of the conversation as you interact with the user."
    " Use this information to inform your responses and provide continuity in the dialogue."
 
)



instructions_with_context = instructions + "\n\n" + combined_pdf_text
# Client initialization
client = Client()


# Original system message with the loaded knowledge base
original_system_messages = [
    {"role": "system", "content": instructions_with_context}
]



initial_greeting = "Marhba bik sur KONTAKT 🥰! Inscrivez-vous dès maintenant pour rejoindre notre grande famille 💛👨‍👩‍👧‍👧<br><a href='https://kontakt.com.tn/web/signup' target='_blank'>kontakt.com.tn.SignUp </a><br> kifech najmou naawnouk ?"

# Home page route
@app.route('/')
def index():
    return render_template('index3.html',initial_greeting=initial_greeting)

@app.route('/choose_lang', methods=['POST'])
def chooseLang():
    global lan  # Declare 'lan' as a global variable
    langSelected = request.form['lan'].strip().lower()
    lan = langSelected  # Modify the global variable
    return jsonify({'language': lan})  # Return the selected language as a JSON response



# Route to handle greetings
greetings = {"hi", "hello", "good", "good morning", "hey", "hello"}
product_keywords = ['t-shirts','t-shirt', 'jeans','jean','chemises','chemise','blouses','blouse','tops','top','bodies','body','bodie','chemises-blouses',
                    'robes','robe','combinaisons','combinaison','jupes','jupe','shorts','short','pantalons',
                    'pantalon','sweats','sweat','hoodies','hoodie','hoody','blazers','blazer','cardigans','cardigan','jackets','jacket',
                    'manteaux','manteau','joggers','jogger','polos','polo','swimwear','pyjamas','pyjama',
                    'accessoires','accessoir','underwear','sous-vetement']
# Send message route
@app.route('/get_product', methods=['POST'])
def receive_chatbot_state():
    data = request.json
    # Process your chatbot state data here
    product_type = data.get('productType', 'default-type')
    gender = data.get('gender', 'default-gender')
    product = data.get('product', 'default-color')
    min_price = data.get('min_price', 'default-min_price')
    max_price = data.get('max_price', 'default-max_price')
    
    # Assuming 'product_type', 'gender', 'color', etc. are the keys expected by the Laravel API.
    payload = {
        'productType': product_type,
        'gender': gender,
        'product': product,
        'max_price':max_price,
        'min_price':min_price
    }

           
   

@app.route('/api/products', methods=['POST'])
def get_products():
    # Parse input data from JSON in the request body
    data = request.json

    product_type = data.get('productType', 'default-type')
    gender = data.get('gender', 'default-gender')
    product= data.get('product', 'default-color')
   
    min_price = data.get('min_price', 'default-min_price')
    max_price = data.get('max_price', 'default-max_price')
    # Assuming 'product_type', 'gender', 'color', etc. are the keys expected by the Laravel API.
 
    if(product_type =='blouses' ):
      
         typeprod = "Chemises & Blouses"
    
    if(product_type =='shorts' or product_type =='jupes' ):
        typeprod = "Jupes & Shorts"
    
    if(product_type =='robes' or product_type =='Combinaison' ):
        typeprod = "Robes & Combinaisons"  
 

    category_pattern=gender+" / "+product_type+" / "+ product
    #category_pattern = data.get('category_pattern')

    min_price = min_price
    max_price = max_price

    # Set up the common endpoint and authenticate
    common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
    uid = common.authenticate(db, username, password, {})

    # Set up the object endpoint
    models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))

    # Define the search domain with the category pattern and list price if provided
    domain = [['is_published', '=', True], ['qty_available','>',0],['barcode', '!=', False], ['hide_on_website', '=', False]]
    if category_pattern is not None:
        domain.append(['categ_id', 'ilike', category_pattern])
    if min_price is not None:
        domain.append(['list_price', '>=', min_price])
    if max_price is not None:
        domain.append(['list_price', '<=', max_price]) 

    # Search and read products matching the criteria
    product_data = models.execute_kw(
        db, 
        uid, 
        password,
        'product.product',
        'search_read',
        [domain],
        {
            'fields': ["barcode","name", 'website_url','default_code'],
        }
    )

    products_data_list = product_data  # Notice the parentheses to call the method
            
            # Base URL for the product details
    base_url = 'https://kontakt.com.tn'

            # Generate URLs for each product using their 'id'
    product_links = []
    for product in products_data_list:
                # Check if 'id' and 'name' exist in the dictionary
                if 'id' in product and 'name' in product:
                    product_links.append({
                        'name': product['name'],
                        'code': product['barcode'],
                        'url': f"{base_url}{product['website_url']}"
                    })
            
            # Send back the links to the client (chatbot)
    return jsonify(product_links)




@app.route('/send_message', methods=['POST'])
def send_message():
    user_input = request.form['user_input'].strip().lower()
    # Initialize product_mentioned
    product_mentioned = None
    global lan
    if user_input in greetings:
        bot_message = "Hi 🤗! How can I help you today?"
    else:
        # Check if the user mentioned a product
        matching_products = [product for product in product_keywords if product in user_input]
        if matching_products:
            # Take the first matching product
            product_mentioned = matching_products[0]
            if lan == "anglais":
              bot_message = f"Great 🤗! To assist you better, could you tell me the gender you are looking for 🤔👤?"
            elif lan =="darija tunisienne":
                 bot_message = f"Cool 🤗! bech najim naawnek akther , chnouwa naw3 elli tlawej alih 🤔👤 ?"
            else:
                 bot_message = f"Super 🤗! Pour mieux vous aider, pourriez-vous me dire le genre que vous recherchez 🤔👤?"

        else:
            # No product keyword found, continue with a standard chatbot response
            messages = copy.deepcopy(original_system_messages)
            print(lan)
            # Append user's message to the messages list
            messages.append({"role": "system", "content": "You are speaking with a user in " + lan})

            messages.append({"role": "user", "content": user_input})
            # Assume client is an instance of a class that communicates with an AI model
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
            )
            response_message = response.choices[0].message.content
            bot_message = response_message if response_message else "Désolé, je n'ai pas pu trouver de réponse à cela .Vous pouvez appeler notre service client au : 📞 +216 73 416 144 ou le +216 98 779 779."

    # Return the response as JSON
    return jsonify({
        'user_input': user_input,
        'bot_response': bot_message,
        'product_mentioned': product_mentioned if product_mentioned else "No product"
    })












@app.route('/get_gender_prompt', methods=['POST'])
def get_gender_prompt():
    
    if lan == "anglais":
        bot_message = " Perfect ! 😊 Which category are you looking for? 🔍"
    elif lan == "français":
        bot_message = "Parfait ! 😊 Quelle catégorie recherchez-vous? 🔍"
    else: 
        bot_message = "Super ! 😊 spécifiez la categorie elli tlawej aliha? 🔍"
    
    return jsonify({'message': bot_message})



@app.route('/get_color_prompt', methods=['POST'])
def get_price_prompt():
   
    if lan == "anglais":
        bot_message = "Thanks for the specifications. 🙏 Do you want to set a price? 💰"
    elif lan == "français":
        bot_message = "Merci pour les spécifications. 🙏 Voulez-vous fixer un prix ? 💰"
    else:  # Assume darija as the default
        bot_message = "D'accord 🙏 t7eb tfaxi soum ? 💰"

    return jsonify({'message': bot_message})



# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
#  app.run(host='0.0.0.0', port=5000)