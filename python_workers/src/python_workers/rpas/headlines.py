from playwright.sync_api import sync_playwright, Page
import json

def get_links(page: Page) -> list[str]:
    # Selecionando o script que contém as URLs
    script_element = page.locator('script[data-mrf-script="experimentation-headlineab"]')
    json_text = script_element.text_content()

    try:
        data = json.loads(json_text)
        urls = []

        for headline in data.get("headlines", []):
            target = headline.get("target", {})
            anchor = target.get("anchor", {})
            href = anchor.get("href")       
            if href:
                urls.append(href)
        return urls
    except json.JSONDecodeError:
        print("Falha ao ler o JSON.")
        return []

def headlines(url: str):

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        pagina = browser.new_page()
        try:
            print(f"Iniciando automação na URL: {url}")
            pagina.goto(url, timeout=60000)
            pagina.wait_for_load_state('networkidle')

            titulo_pagina = pagina.title()            
            links = get_links(pagina)

            print(f"Automação concluída. Título da página: '{titulo_pagina}'")
            return {"status": "FINALIZADO",
                    "detalhes": f"Título da página: {titulo_pagina}\n {url}",
                    "mensagem_erro": None,
                    "resultado": links}
        except Exception as e:
            print(f"Erro durante a automação: {e}")
            return {"status": "ERRO",
                    "detalhes": f"{url}",
                    "mensagem_erro": str(e),
                    "resultado": None}
        finally:
            browser.close()
