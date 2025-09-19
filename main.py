from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Монтируем папку cerebra_local/static как /cerebra.kz
app.mount("/cerebra.kz", StaticFiles(directory="cerebra_local/static"), name="static")

# Возвращаем index.html для корневого пути
@app.get("/")
async def root():
    return FileResponse(os.path.join("cerebra_local/static", "index.html"))

# Поддержка пути /cerebra.kz/index.html
@app.get("/cerebra.kz/index.html")
async def cerebra_index():
    return FileResponse(os.path.join("cerebra_local/static", "index.html"))