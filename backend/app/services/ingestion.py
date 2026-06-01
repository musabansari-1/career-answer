import fitz  # PyMuPDF

def extract_text(file_path: str) -> str:
    doc = fitz.open(file_path)
    text = ""

    for page in doc:
        text += page.get_text()

    return text


def chunk_text(text: str, chunk_size: int = 1000):
    return [
        text[i:i + chunk_size]
        for i in range(0, len(text), chunk_size)
    ]


def process_document(file_path: str):
    text = extract_text(file_path)
    chunks = chunk_text(text)

    # for now just return chunks (NO DB yet)
    return chunks