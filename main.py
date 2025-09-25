from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

app = FastAPI()

# Подключаем статику (css, js)
app.mount("/static", StaticFiles(directory="cerebra_local/static"), name="static")

# Подключаем шаблоны
templates = Jinja2Templates(directory="templates")

# Роут для главной страницы
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
