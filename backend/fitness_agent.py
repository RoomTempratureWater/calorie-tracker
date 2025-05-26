import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

from langchain.llms import HuggingFaceHub
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain.memory import ConversationBufferMemory
from langchain.memory.chat_message_histories import SQLChatMessageHistory
from langchain.agents import initialize_agent, AgentType
from langchain.tools import tool
from custom_llm import HuggingFaceChatLLM

# === Load environment variables ===
load_dotenv()
hf_token = os.getenv("HF_API")
host = os.getenv("POSTGRES_HOST")
passwrd = os.getenv("POSTGRES_PASS")
user = os.getenv("POSTGRES_USER")
#config = dotenv_values(".env") #SUPABASE_URL, SUPABASE_KEY, HF_API

password = quote_plus(passwrd)
pg_url = f"postgresql://postgres.{user}:{password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"

print(pg_url)

# === Step 1: Configure the HuggingFace model ===
llm = HuggingFaceChatLLM(
    model="google/gemma-2-27b-it",
    api_key=hf_token
)

# === Step 2: Create Chroma vector store ===
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vector_store = Chroma(
    persist_directory="./chroma_store",
    embedding_function=embedding
)
retriever = vector_store.as_retriever()

# === Step 3: RAG Tool (wrap retrieval QA chain) ===
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=False
)

@tool
def knowledge_base_search(query: str) -> str:
    """Use this tool to answer factual/document-based questions."""
    return rag_chain.run(query)

tools = [knowledge_base_search]

# === Step 4: Get agent per user ===
def get_agent_for_user(user_id: str):
    chat_history = SQLChatMessageHistory(
        session_id=user_id,
        connection_string=pg_url
    )
    memory = ConversationBufferMemory(
        chat_memory=chat_history,
        return_messages=True,
        memory_key="chat_history"
    )

    agent = initialize_agent(
        tools=tools,
        llm=llm,
        agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
        memory=memory,
        verbose=True
    )
    return agent

# === Step 5: Example usage ===
if __name__ == "__main__":
    user_id = "jonathan@example.com"  # Simulate user session
    agent = get_agent_for_user(user_id)

    while True:
        query = input("You: ")
        if query.lower() in {"exit", "quit"}:
            break
        response = agent.run(query)
        print("Gemma:", response)

