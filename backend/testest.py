
from huggingface_hub import InferenceClient

client = InferenceClient(
    provider="nebius",
    api_key="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",
)

completion = client.chat.completions.create(
    model="google/gemma-2-27b-it",
    messages=[
        {
            "role": "user",
            "content": "What is the capital of France?"
        }
    ],
)

print(completion.choices[0].message)
