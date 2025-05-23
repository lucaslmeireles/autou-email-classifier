import os
import json
import spacy
from spacy.lang.pt.examples import sentences 
import fitz
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()
class EmailClassifier:
    def __init__(self):
        self.nlp = spacy.load("pt_core_news_sm")
        self.client = AsyncOpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=os.getenv("OPENAI_API_KEY")
                )
    
    async def classify(self, email: str):
        doc = self.nlp(email)

        noums =  [chunk.text for chunk in doc.noun_chunks]
        verbs =  [token.lemma_ for token in doc if token.pos_ == "VERB"]
        entities = [(ent.text, ent.label_) for ent in doc.ents]    
                
        response = await self.client.chat.completions.create(
            extra_body={},
            model="mistralai/devstral-small:free",
            messages=[
                {
                    "role": "system",
                    "content": """
                        YYou are a JSON-only email classifier API. 
                    
                        Analyze the email content and classify it as 'productive' or 'unproductive'.

                        What is productive, an email talking about an important meeting, or a question about the system, a support ticket open.
                        What is unproductive, thanks e-mails, meeting that dont include importante informations, like seminarys, felicitation e-mails.

                        YOU MUST RETURN ONLY A VALID JSON OBJECT with these exact fields:
                        {
                        "classification": "productive" or "unproductive",
                        "accuracy": a decimal between 0 and 1 representing confidence,
                        "keywords": an array of words that contributed to classification,
                        "quick_responses": an array of 3 brief responses (only include if productive)
                        }

                        Quick responses must be in the same language as the analyzed email.
                        DO NOT include any explanations or text outside the JSON object.F""",
                },
                {
                    "role": "user",
                    "content": f"""
                    Please analyze this email data:
                    
                    Noun chunks: {noums}
                    Verbs: {verbs}
                    Entities: {entities}
                    """
                }
            ],
            response_format={"type": "json_object"},
        )
        print(response)
        json_response = json.loads(response.choices[0].message.content)
        return json_response
    
    async def classify_file(self, file_path: str):
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text+=page.get_text()
        print(text)
        return await self.classify(text)
    
#Duplicando a chamada da api uma com o arquivo e outra com o texto