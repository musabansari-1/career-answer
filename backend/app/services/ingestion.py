import fitz
from app.models.chunk import Chunk
from app.models.document import Document


def extract_text(file_path: str):
    doc = fitz.open(file_path)
    text = ""

    for page in doc:
        text += page.get_text()

    return text


def chunk_text(text: str, size: int = 1000):
    return [text[i:i+size] for i in range(0, len(text), size)]


def process_document(file_path: str, db):
    text = extract_text(file_path)
    chunks = chunk_text(text)

    document = Document(filename=file_path)
    db.add(document)
    db.commit()
    db.refresh(document)

    for c in chunks:
        chunk = Chunk(
            document_id=document.id,
            content=c
        )
        db.add(chunk)

    db.commit()

    return chunks