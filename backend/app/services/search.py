from app.models.chunk import Chunk
from app.services.embeddings import create_embedding


def search_chunks(query: str, db, limit: int = 5):
    query_embedding = create_embedding(query)
    distance = Chunk.embedding.cosine_distance(query_embedding)

    results = (
        db.query(Chunk, distance.label("distance"))
        .order_by(
            distance
        )
        .limit(limit)
        .all()
    )

    return results