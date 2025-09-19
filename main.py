from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Монтируем папку как корень
app.mount("/static", StaticFiles(directory="cerebra_local/static"), name="static")

@app.get("/")
async def root():
    return FileResponse(os.path.join("cerebra_local", "index.html"))