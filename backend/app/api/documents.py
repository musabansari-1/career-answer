from fastapi import APIRouter, UploadFile, File, Depends
import os

from app.services.ingestion import process_document
from app.db.session import get_db

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload(file: UploadFile = File(...), db=Depends(get_db)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    chunks = process_document(file_path, db)

    return {
        "message": "stored in DB",
        "chunks_created": len(chunks)
    }