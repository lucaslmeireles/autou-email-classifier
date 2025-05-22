import os
from typing import Annotated
from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from service import EmailClassifier
from pydantic import BaseModel

class Email(BaseModel):
    email: str
    

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
def read_root(requst: Request):
    return templates.TemplateResponse("index.html", {"request": requst})

@app.post("/classify")
async def classify_email(email: Email):
    print(email)
    classifier = EmailClassifier()
    response = await classifier.classify(email.email)
    # Return only the classification object, not the entire response
    return response

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    classifier = EmailClassifier()
    contents = await file.read()
    with open(file.filename, "wb") as f:
            f.write(contents)
    
    response = await classifier.classify_file(file.filename)
    os.remove(file.filename)    
    # Return only the classification results, not the filename
    return response
