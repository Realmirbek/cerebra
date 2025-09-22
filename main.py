from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Раздаём статику из папки cerebra_local/static прямо с корня
# index.html автоматически открывается по "/"
app.mount("/", StaticFiles(directory="cerebra_local/static", html=True), name="static")
