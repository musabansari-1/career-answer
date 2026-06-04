import fitz
from app.models.chunk import Chunk
from app.models.document import Document
from app.services.embeddings import create_embedding
from langchain_text_splitters import RecursiveCharacterTextSplitter



def extract_text(file_path: str):
    doc = fitz.open(file_path)
    text = ""

    for page in doc:
        text += page.get_text()

    return text


def chunk_text(text: str):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=[
            "\n\n",
            "\n",
            ". ",
            " ",
            ""
        ],
    )

    chunks = splitter.split_text(text)

    return chunks


def process_document(file_path: str, db):
    text = extract_text(file_path)
    chunks = chunk_text(text)

    document = Document(filename=file_path)
    db.add(document)
    db.commit()
    db.refresh(document)

    for c in chunks:
        embedding = create_embedding(c)

        chunk = Chunk(
            document_id=document.id,
            content=c,
            embedding=embedding
        )
        db.add(chunk)

    db.commit()

    return chunks