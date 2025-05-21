from fastapi import FastAPI
import spacy
from spacy.lang.pt.examples import sentences 
from openai import AsyncOpenAI
from dotenv import load_dotenv
import os
load_dotenv()

client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENAI_API_KEY")
)


app = FastAPI()
nlp = spacy.load("pt_core_news_sm")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Email Classifier"}

@app.post("/classify")
async def classify_email(email: str):
    doc = nlp(email)

    noums =  [chunk.text for chunk in doc.noun_chunks]
    verbs =  [token.lemma_ for token in doc if token.pos_ == "VERB"]
    
        
    response = await client.chat.completions.create(
    extra_body={},
    model="mistralai/devstral-small:free",
    messages=[
        {
            "role": "system",
            "content": "Based on the result of the NLP analysis, classify the email as productive or unproductive. Search for terms that are related to spam, such as 'free', 'win', 'urgent', etc. Read the context and look for verbs such as 'buy', 'click', 'open', etc. At the end show in json format the following arguments: email, classification, accuracy, and the list of keywords that were used to classify the email. If the email is productive show 3 quick responses that can reply to the email, Only reply in json formt with like this example { classification: productive, accuracy: 0.95, keywords: [buy, click], quick_responses: [Sure, I can help you with that., I will get back to you shortly., Let me check that for you.] }The quick response must be in the language of the email",
        },
        {
            "role": "user",
            "content": f"""
            Please analyze this email data:
            
            Noun chunks: {noums}
            Verbs: {verbs}
            """
        }
    ],
    

)
    print(response)
    return {"email": email, "classification": response.choices[0].message.content}

