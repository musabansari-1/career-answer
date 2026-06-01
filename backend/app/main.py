from fastapi import FastAPI
from app.api import documents
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",  # React / Next.js dev
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # or ["*"] for all (not recommended in prod)
    allow_credentials=True,
    allow_methods=["*"],        # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],        # Authorization, Content-Type, etc.
)

app.include_router(documents.router)


@app.get("/")
def health():
    return {"status": "ok"}