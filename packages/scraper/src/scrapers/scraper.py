from playwright.sync_api import sync_playwright
import requests
from bs4 import BeautifulSoup
import re
import time
import sys
import json
from typing import List, Dict, Any

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}


def search(query: str, num_results: int = 5) -> List[str]:
    url = f"https://www.bing.com/search?q={query}"
    r = requests.get(url, headers=HEADERS, timeout=10)
    soup = BeautifulSoup(r.text, "html.parser")

    urls: List[str] = []
    for li in soup.select("li.b_algo")[:num_results]:
        a = li.find("a")
        if a and a.get("href"):
            link = a["href"]
            urls.append(link)
    return urls


def scrape_page_text(url: str) -> str:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto(url, timeout=60000)
            # Wait for DOM to load, wait for stable webpage
            page.wait_for_load_state("domcontentloaded", timeout=15000)
            time.sleep(2)
        except Exception:
            # if timeout or navigation error occurs, continue anyway
            pass

        html = page.content()
        browser.close()

    soup = BeautifulSoup(html, "html.parser")
    # Remove scripts, styles, navs, headers, footers
    for tag in soup(["script", "style", "nav", "header", "footer", "aside"]):
        tag.decompose()

    text = " ".join(soup.stripped_strings)
    text = re.sub(r"\s+", " ", text)
    return text


def scrape_urls(query: str, num_results: int = 5) -> List[str]:
    urls = search(query, num_results=num_results)
    return urls


def get_top_texts_with_urls(query: str, num_results: int = 5) -> List[Dict[str, str]]:
    """
    Return a list of dicts with both the URL and scraped text content.
    This preserves the URL so it can be surfaced back to the frontend.
    """
    urls = scrape_urls(query, num_results=num_results)
    results: List[Dict[str, str]] = []
    for url in urls:
        try:
            text = scrape_page_text(url)
            results.append({"url": url, "text": text})
        except Exception:
            # Skip URLs that fail to scrape
            continue
    return results


def build_snippets_from_query(query: str, num_results: int = 5) -> List[Dict[str, Any]]:
    """Return a list of dicts shaped similarly to ResearchSnippet for consumption by Node."""
    pages = get_top_texts_with_urls(query, num_results=num_results)
    tokens = [t for t in query.split(" ") if t]

    snippets: List[Dict[str, Any]] = []
    for i, page in enumerate(pages):
        text = page["text"]
        url = page["url"]
        snippets.append(
            {
                "id": f"scraped-{i+1}",
                "title": f"Result {i+1} for '{query}'",
                "source": "web",
                "url": url,
                "abstract": text[:400],
                "summary": text[:1600],
                "tags": tokens[:8],
            }
        )
    return snippets


def main() -> None:
    """
    CLI entrypoint.

    Usage:
        python scraper.py "adhd classroom intervention middle school"

    Prints a JSON array of research-like snippet objects to stdout.
    """
    query = " ".join(sys.argv[1:]).strip()
    if not query:
        # Fallback to a generic query if none is provided.
        query = "special education classroom intervention"

    snippets = build_snippets_from_query(query, num_results=5)
    json.dump(snippets, sys.stdout)


if __name__ == "__main__":
    main()