from langchain.chat_models.base import BaseChatModel
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langchain.schema import ChatResult, ChatGeneration
from huggingface_hub import InferenceClient
from typing import List, Optional
from pydantic import Field, BaseModel

class HuggingFaceChatLLM(BaseChatModel):
    model: str
    api_key: str
    provider: str = "auto"
    temperature: float = 0.7
    client: Optional[InferenceClient] = Field(default=None, exclude=True)

    def __init__(self, **data):
        super().__init__(**data)
        # Initialize client after BaseChatModel init
        self.client = InferenceClient(provider=self.provider, api_key=self.api_key)

    def _convert_messages(self, messages: List):
        hf_msgs = []
        for msg in messages:
            role = {
                "human": "user",
                "ai": "assistant",
                "system": "system"
            }.get(msg.type, "user")
            hf_msgs.append({"role": role, "content": msg.content})
        return hf_msgs

    def _generate(self, messages: List, stop=None) -> ChatResult:
        hf_messages = self._convert_messages(messages)

        completion = self.client.chat.completions.create(
            model=self.model,
            messages=hf_messages,
            temperature=self.temperature
        )

        ai_message = AIMessage(content=completion.choices[0].message.content)
        return ChatResult(generations=[ChatGeneration(message=ai_message)])

    @property
    def _llm_type(self) -> str:
        return "huggingface-chat"

