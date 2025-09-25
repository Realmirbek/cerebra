# main.py
import gettext
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from typing import List

app = FastAPI()

# Подключаем статику
app.mount("/static", StaticFiles(directory="cerebra_local/static"), name="static")

# Подключаем шаблоны
templates = Jinja2Templates(directory="templates")

SUPPORTED_LANGUAGES: List[str] = ["ky", "ru", "en"]
DEFAULT_LANGUAGE = "ru"
DOMAIN = "messages"  # имя для gettext

def get_translation(lang: str):
    try:
        return gettext.translation(DOMAIN, localedir="locale", languages=[lang])
    except Exception:
        return gettext.NullTranslations()

def detect_language(request: Request) -> str:
    qlang = request.query_params.get("lang")
    if qlang and qlang in SUPPORTED_LANGUAGES:
        return qlang

    cookie_lang = request.cookies.get("lang")
    if cookie_lang and cookie_lang in SUPPORTED_LANGUAGES:
        return cookie_lang

    al = request.headers.get("accept-language", "")
    if al:
        langs = [p.split(";")[0].strip() for p in al.split(",")]
        for l in langs:
            code = l.split("-")[0]
            if code in SUPPORTED_LANGUAGES:
                return code
    return DEFAULT_LANGUAGE

@app.get("/set-language/{lang}")
async def set_language(lang: str, request: Request):
    if lang not in SUPPORTED_LANGUAGES:
        lang = DEFAULT_LANGUAGE
    referer = request.headers.get("referer", "/")
    resp = RedirectResponse(url=referer)
    resp.set_cookie(key="lang", value=lang, max_age=60*60*24*365)
    return resp

@app.get("/")
async def index(request: Request):
    lang = detect_language(request)
    tr = get_translation(lang)
    _ = tr.gettext
    ngettext = getattr(tr, "ngettext", lambda s, p, n: s if n == 1 else p)

    context = {
        "request": request,
        "_": _,
        "ngettext": ngettext,
        "LANG": lang,
        "SUPPORTED_LANGUAGES": SUPPORTED_LANGUAGES
    }
    return templates.TemplateResponse("index.html", context)


# main.py - добавьте этот route
@app.get("/{lang}")
async def index_with_lang(lang: str, request: Request):
    if lang not in SUPPORTED_LANGUAGES:
        # Если язык не поддерживается - редирект на главную с определением языка
        return RedirectResponse("/")

    # Устанавливаем cookie с выбранным языком
    tr = get_translation(lang)
    _ = tr.gettext

    context = {
        "request": request,
        "_": _,
        "LANG": lang,
    }

    response = templates.TemplateResponse("index.html", context)
    response.set_cookie(key="lang", value=lang, max_age=60 * 60 * 24 * 365)
    return response

@app.get("/test-lang")
async def test_lang(request: Request):
    lang = request.cookies.get("lang", "ru")
    tr = get_translation(lang)
    return {"language": lang, "translation_test": tr.gettext("MAIN")}