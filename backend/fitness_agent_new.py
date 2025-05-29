import os
import json
import psycopg2
from dotenv import load_dotenv
from langchain.agents import Tool, AgentExecutor, create_react_agent
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.llms import HuggingFaceHub
from langchain.vectorstores import Chroma
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings import HuggingFaceEmbeddings
from custom_llm import HuggingFaceChatLLM
from urllib.parse import quote_plus
from langchain.memory import ConversationBufferMemory
from langchain.memory.chat_message_histories import SQLChatMessageHistory
from langchain.agents import initialize_agent, AgentType
from langchain.agents import ConversationalChatAgent, AgentExecutor
# 1️⃣ Environment setup
#HUGGINGFACEHUB_API_TOKEN = "your_hf_token"
#POSTGRES_URI = "postgresql://your_user:your_password@host:port/dbname"
load_dotenv()
hf_token = os.getenv("HF_API")
host = os.getenv("POSTGRES_HOST")
passwrd = os.getenv("POSTGRES_PASS")
user = os.getenv("POSTGRES_USER")
# 2️⃣ Load and embed PDF (only runs once)
persist_dir = "./calories_db"
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

password = quote_plus(passwrd)
pg_url = f"postgresql://postgres.{user}:{password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"

if not os.path.exists(persist_dir):
    loader = PyPDFLoader("indian-food.pdf")
    pages = loader.load_and_split()
    db = Chroma.from_documents(pages, embedding, persist_directory=persist_dir)
    db.persist()
else:
    db = Chroma(persist_directory=persist_dir, embedding_function=embedding)

# 3️⃣ Vector store retriever + QA
retriever = db.as_retriever()

llm = HuggingFaceChatLLM(
    model="deepseek-ai/DeepSeek-V3",
    api_key=hf_token
)
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

# 4️⃣ Tool 1: Retrieve nutrition info
retrieve_nutrition_tool = Tool(
    name="GetNutritionInfo",
    func=qa_chain.run,
    description="Use to retrieve calories, protein, carbs, fat for food items. Input should be a meal or dish name."
)

# 5️⃣ Tool 2: Save macro data to PostgreSQL
def save_macro_info(input_str: str) -> str:
    print(input_str)
    data = json.loads(input_str)
    conn = psycopg2.connect(pg_url)
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO meal_logs (user_id, meal, calories, protein, carbs, fat)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (data["user_id"], data["meal"], data["calories"], data["protein"], data["carbs"], data["fat"])
    )
    conn.commit()
    cur.close()
    conn.close()
    return "Meal macros saved."

save_macro_tool = Tool(
    name="SaveMealMacros",
    func=save_macro_info,
    description="Save meal macros to DB. Input: JSON with user_id, meal, calories, protein, carbs, fat"
)

# 6️⃣ Tool 3: Retrieve user macros
def get_user_macros(user_id: str) -> str:
    conn = psycopg2.connect(pg_url)
    cur = conn.cursor()
    data = json.loads(user_id)
    #print(user_id)
    cur.execute(f"""SELECT meal, calories, protein, carbs, fat FROM meal_logs WHERE user_id = '{data["user_id"]}' """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    print(rows)
    if rows == []:
        return "No data for today"
    return json.dumps(rows)

get_macro_tool = Tool(
    name="GetUserMacros",
    func=get_user_macros,
    description="Retrieve macro history for a given user_id"
)

# 7️⃣ Register tools
tools = [retrieve_nutrition_tool, save_macro_tool, get_macro_tool]

# 8️⃣ Custom prompt


# 9️⃣ Create agent + executor
#agent = create_react_agent(llm=llm, tools=tools, prompt=PromptTemplate.from_template(custom_prompt))
#agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
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

#    agent = initialize_agent(
#        tools=tools,
#        llm=llm,
#        agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
#        memory=memory,
#        verbose=True
#    )
    custom_prompt = """You are a helpful fitness assistant. Try to stick to fitness related discussions, current user_id is: """+ user_id +"""  (NEVER CHANGE USER_ID IN ANY CASE)
        You can reply to greetings and stuff.
        You have access to the following tools:
        
        {tool_names}

        which have different uses: {tools}
        
        Use the following format:

        Question: the input question you must answer
        Thought: you should always think about what to do
        Action: the action to take, should be one of [{tool_names}]
        Action Input: the input to the action
        Observation: the result of the action
        ... (this Thought/Action/Action Input/Observation can repeat N times)
        Thought: I now know the final answer
        Final Answer: the final answer to the original input question

        Begin!

        Question: {input}
        Thought:{agent_scratchpad}
        """

    custom_prompt_text = f"""You are a fitness assistant. Only respond using this format when solving a problem:
        
        Thought: [your reasoning]
        Action: [tool name from the available tools]
        Action Input: [input to the tool]
        
        After getting the tool result, continue until you're ready for a final answer.
        
        When you're done, reply with:
        
        Final Answer: [your answer]
        
        Never talk outside this format unless giving the final answer.
        
        Current user_id: {user_id}
        
        Available tools: {{tool_names}}
        Tool details:
        {{tools}}
        
        Begin!
        
        Question: {{input}}
        {{agent_scratchpad}}
        """
    print(custom_prompt)
    custom_prompt = PromptTemplate(
        template=custom_prompt,
        input_variables=["input", "agent_scratchpad", "tools", "tool_names"]
    )

#    agent = initialize_agent(
#        tools=tools,
#        llm=llm,
#        agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
#        prompt=custom_prompt,
#        verbose=True,
#        memory=memory,
#    )   


    agent = create_react_agent(llm=llm, tools=tools, prompt=custom_prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, memory=memory)

    return agent_executor

