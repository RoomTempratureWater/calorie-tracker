from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain.agents import initialize_agent, AgentType
from langchain.tools import tool
from langchain.llms import HuggingFaceHub

from langchain.llms.base import LLM
from langchain.llms.utils import enforce_stop_tokens

llm = HuggingFaceHub(
    repo_id="google/gemma-2-27b-it",
    model_kwargs={
        "temperature": 0.7,
        "max_new_tokens": 512,
        "top_p": 0.9
    },
    huggingfacehub_api_token=config['HF_API']
)


# Embedding + Chroma vector store
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
chroma = Chroma(persist_directory="./chroma_store", embedding_function=embedding)
retriever = chroma.as_retriever()

# Wrap QA tool
qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    retriever=retriever,
    return_source_documents=True
)

@tool
def knowledge_base_search(query: str) -> str:
    """Query the document knowledge base."""
    return qa_chain.run(query)

# Agent with memory + tool
tools = [knowledge_base_search]

agent = initialize_agent(
    tools=tools,
    llm=OpenAI(),
    agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
    memory=memory,
    verbose=True
)

