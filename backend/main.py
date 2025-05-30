from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import fitness_agent_new
app = FastAPI()

# dummy user
user_id = "tanmay@gmail.com"
users = {user_id:fitness_agent_new.get_agent_for_user(user_id)}

# Mount static folder
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup templates
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def chat_page(request: Request):
    return templates.TemplateResponse("chat.html", {"request": request})

@app.post("/get_message")
async def get_message(message: str = Form(...), user: str = Form(...)):
    reply = users[user].invoke({'input':message})
    #print("adadasdadadad",reply)
    return JSONResponse({"reply": reply['output']})

