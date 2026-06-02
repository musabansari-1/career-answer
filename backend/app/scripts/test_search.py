from app.db.database import SessionLocal
from app.services.search import search_chunks

db = SessionLocal()

results = search_chunks(
    "freelance work",
    db
)

for chunk, distance in results:
    print(f"Distance: {distance}")
    print(chunk.content[:200])
    print("=" * 50)