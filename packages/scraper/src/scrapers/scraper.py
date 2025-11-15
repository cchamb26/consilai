from playwright.sync_api import sync_playwright
import requests
from bs4 import BeautifulSoup
import re
import time

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

def search(query, num_results=5):
    url = f"https://www.bing.com/search?q={query}"
    r = requests.get(url, headers=HEADERS, timeout=10)
    soup = BeautifulSoup(r.text, "html.parser")

    urls = []
    for li in soup.select("li.b_algo")[:num_results]:
        a = li.find("a")
        if a and a.get("href"):
            title = a.get_text(strip=True)
            link = a["href"]
            urls.append(link)
    return urls

def scrape_page_text(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto(url, timeout=60000)
            # Wait for DOM to load, wait for stable webpage
            page.wait_for_load_state("domcontentloaded", timeout=15000)
            time.sleep(2)
        except:
            pass  # if timeout occurs, continue anyway

        html = page.content()
        browser.close()

    soup = BeautifulSoup(html, "html.parser")
    # Remove scripts, styles, navs, headers, footers
    for tag in soup(["script", "style", "nav", "header", "footer", "aside"]):
        tag.decompose()

    text = " ".join(soup.stripped_strings)
    text = re.sub(r"\s+", " ", text)
    return text

def scrape_urls(query, num_results=5):
    urls = search(query, num_results=num_results)

    return urls

def get_top5_text(queries):
    query = " ".join(queries).replace(" ", "+")
    urls = scrape_urls(queries)
    texts = []
    for url in urls:
        texts.append(scrape_page_text(url))
    return texts

# Random example
if __name__ == "__main__":
    queries = [
        "behavioral problems",
        "children"
    ]
    texts = get_top5_text(queries)
    breakpoint()