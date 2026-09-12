"""
build_rag_store.py
-------------------
Run this ONCE on your laptop to generate rag_store.json.

It takes your 7 experiment procedure steps, sends each one to your
local Ollama (nomic-embed-text) to get its embedding vector, and
saves everything to rag_store.json — exactly the format
ai_pipeline.py's retrieve_knowledge() expects.

Usage:
    python build_rag_store.py

Requires Ollama running locally with nomic-embed-text pulled:
    ollama pull nomic-embed-text
"""

import json
import requests

OLLAMA_URL = "http://localhost:11434"
EMBED_MODEL = "nomic-embed-text"

# Your experiment procedure — same steps as in ai_pipeline.py.
# Each one becomes a retrievable knowledge chunk for the RAG system.
PROCEDURE_STEPS = [
    "Step 1: Place Container A and Container B on the workspace. "
    "Ensure both containers are stable, upright, and clearly labeled before proceeding.",

    "Step 2: Pick up the pipette. Verify it is clean, undamaged, and the correct size "
    "for the required liquid volume.",

    "Step 3: Insert the pipette tip into Container A. Keep the tip fully submerged "
    "below the liquid surface without touching the bottom or sides of the container.",

    "Step 4: Draw liquid into the pipette by slowly releasing the plunger. "
    "Draw the exact required volume — do not overfill or introduce air bubbles.",

    "Step 5: Move the pipette over Container B carefully, keeping it upright to avoid "
    "spilling or dripping the drawn liquid.",

    "Step 6: Dispense the liquid into Container B by slowly pressing the plunger fully. "
    "Confirm the liquid has fully transferred before withdrawing the pipette.",

    "Step 7: Place the pipette back in its designated position. Do not leave it "
    "unsecured on the workspace, especially in a microgravity environment.",
]


def get_embedding(text):
    response = requests.post(
        f"{OLLAMA_URL}/api/embeddings",
        json={"model": EMBED_MODEL, "prompt": text},
        timeout=60,
    )
    response.raise_for_status()
    return response.json()["embedding"]


def main():
    print("Building rag_store.json from procedure steps...")
    store = []

    for i, text in enumerate(PROCEDURE_STEPS, start=1):
        print(f"Embedding step {i}/{len(PROCEDURE_STEPS)}...")
        embedding = get_embedding(text)
        store.append({"text": text, "embedding": embedding})

    with open("rag_store.json", "w", encoding="utf-8") as f:
        json.dump(store, f)

    print(f"\nDone. rag_store.json created with {len(store)} entries.")
    print("Put it in the same folder as app.py, ai_pipeline.py, and camera_stream.py.")


if __name__ == "__main__":
    main()
