from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.llm_model import process_prompt

app = FastAPI(title="LLM Toy Service", version="1.0.0")

# Configurar CORS para permitir comunicación con Spring Boot
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptRequest(BaseModel):
    prompt: str


class PromptResponse(BaseModel):
    tokens: list
    probabilities_table: list


@app.get("/")
def read_root():
    return {"message": "LLM Toy Service is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/generate", response_model=PromptResponse)
def generate_text(request: PromptRequest):
    """Genera texto a partir de un prompt y devuelve probabilidades"""
    result = process_prompt(request.prompt)
    return result


@app.get("/vocab")
def get_vocabulary():
    """Retorna el vocabulario disponible"""
    from app.llm_model import vocab
    return {"vocabulary": list(vocab.keys())}
