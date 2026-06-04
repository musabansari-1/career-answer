import os
import requests

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def build_prompt(question: str, chunks: list[str]) -> str:
    context = "\n\n".join(chunks)

    return f"""
You are a helpful AI assistant.

Answer ONLY using the context below.

If context is insufficient, say "I don't know".

Context:
{context}

Question:
{question}

Answer:
""".strip()


def generate_answer(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "openrouter/free",  # you can change anytime
        "messages": [
            {
                "role": "system",
                "content": "You are a strict assistant that answers only from provided context."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    response = requests.post(OPENROUTER_URL, headers=headers, json=payload)

    if response.status_code != 200:
        raise Exception(f"OpenRouter error: {response.text}")

    data = response.json()

    return data["choices"][0]["message"]["content"]



def stream_answer(prompt: str):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "openrouter/free",
        "stream": True,
        "messages": [
            {
                "role": "system",
                "content": "You are a strict assistant that answers only from provided context."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    response = requests.post(
        OPENROUTER_URL,
        headers=headers,
        json=payload,
        stream=True,
    )

    if response.status_code != 200:
        raise Exception(f"OpenRouter error: {response.text}")

    for line in response.iter_lines():
        if not line:
            continue

        line = line.decode("utf-8")

        if not line.startswith("data: "):
            continue

        data = line.removeprefix("data: ")

        if data == "[DONE]":
            break

        try:
            import json

            chunk = json.loads(data)

            delta = chunk["choices"][0]["delta"]

            if "content" in delta:
                yield delta["content"]

        except Exception:
            continue