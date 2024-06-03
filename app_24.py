import fitz  # Import de PyMuPDF pour l'extraction de texte des PDF
import os


from g4f.client import Client

client = Client()


# Extraction du texte d'un fichier PDF

def extract_text_from_pdf(pdf_path):
    with fitz.open(pdf_path) as pdf:
        text = ""
        for page in pdf:
            text += page.get_text()
        return text

# Extraction du texte de tous les fichiers PDF dans un dossier

def extract_text_from_pdf_directory(pdf_directory):
    combined_text = ""
    for filename in os.listdir(pdf_directory):
        if filename.lower().endswith('.pdf'):

            pdf_path = os.path.join(pdf_directory, filename)
            combined_text += extract_text_from_pdf(pdf_path) + "\n\n"
    return combined_text

# Spécifier le répertoire des fichiers PDF
pdf_directory = 'docs'
knowledge_base_text = extract_text_from_pdf_directory(pdf_directory)

# Vérifier si le texte a été extrait avec succès
if not knowledge_base_text.strip():
    print("Désolé, aucun contenu trouvé dans les fichiers PDF.")
else:
    # Initialiser le client GPT-3 avec votre propre configuration API
    client = Client()

    # Fonction pour obtenir une réponse du modèle en utilisant uniquement full_knowledge_text




    def get_response_from_model(user_message, knowledge_text):
        # Création de la complétion avec le modèle en utilisant le texte extrait en tant que contexte.
        # Assurez-vous que la taille du contexte n'excède pas les limites de jetons du modèle.


        chat_completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "The following is a conversation with an AI based on the knowledge extracted from PDF documents."},
                {"role": "assistant", "content": knowledge_text},
                {"role": "user", "content": user_message},
            ],


            
            stream=False
        )
        return chat_completion.choices[0].message.content



 

    # Lancement de la boucle pour interagir avec l'utilisateur
    while True:
        user_message = input("Entrez votre question (tapez 'exit' pour quitter) : ")
        if user_message.lower() == 'exit':
            break
        response = get_response_from_model(user_message, knowledge_base_text)
        print(response)
