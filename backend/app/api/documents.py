from fastapi import APIRouter, UploadFile, File
import os
from app.services.ingestion import process_document

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    result = process_document(file_path)

    return {
        "message": "uploaded successfully",
        "chunks_created": len(result)
    }