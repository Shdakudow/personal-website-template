"""Include key profile content in the initial HTML, without external dependencies."""

from hashlib import sha256
from html import escape
import json
from pathlib import Path
import re
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
content = json.loads((DIST / "content.js").read_text().split("window.siteContent = ", 1)[1].rstrip().removesuffix(";"))
page = (DIST / "index.html").read_text()


def tag(name, text, css=""):
    attribute = f' class="{escape(css, quote=True)}"' if css else ""
    return f"<{name}{attribute}>{escape(text)}</{name}>"


def safe_url(value):
    return value if value and urlsplit(value).scheme in ("https", "http") else None


def resource_links(resources, css):
    return "".join(
        f'<a class="{css}" href="{escape(item["url"], quote=True)}" target="_blank" rel="noopener noreferrer">{escape(item["label"])}</a>'
        for item in resources if safe_url(item.get("url"))
    )


def block(name, html):
    global page
    pattern = rf"<!-- {name}:start -->.*?<!-- {name}:end -->"
    replacement = f"<!-- {name}:start -->{html}<!-- {name}:end -->"
    page, count = re.subn(pattern, lambda _: replacement, page, flags=re.S)
    if count != 1:
        raise ValueError(f"Expected one {name} block, found {count}")


title = content["pageTitle"]
description = content["siteDescription"]
url = content["siteUrl"]
profile = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "url": url,
    "name": title,
    "mainEntity": {
        "@type": "Person",
        "@id": url + "#person",
        "name": content["name"],
        "url": url,
        "sameAs": [content["github"]],
        "affiliation": {"@type": "CollegeOrUniversity", "name": "Cornell University"},
    },
}
metadata = "\n" + tag("title", title) + "\n"
metadata += f'<meta name="description" content="{escape(description, quote=True)}">\n'
metadata += f'<link rel="canonical" href="{escape(url, quote=True)}">\n'
for key, value in {"og:type": "website", "og:title": title, "og:description": description, "og:url": url}.items():
    metadata += f'<meta property="{key}" content="{escape(value, quote=True)}">\n'
metadata += '<script type="application/ld+json">' + json.dumps(profile, ensure_ascii=False).replace("<", "\\u003c") + "</script>\n"
block("search-metadata", metadata)
block("tagline", escape(content["tagline"]))
block("personal", escape(content.get("personal", "")))
block("skills", escape(" · ".join(content.get("skills", []))))

education = []
for entry in content.get("education", []):
    html = tag("p", entry["period"], "profile-period") + tag("h4", entry["institution"], "profile-title") + tag("p", entry["degree"], "profile-subtitle")
    if entry.get("note"):
        html += tag("p", entry["note"], "profile-note")
    education.append(f'<div class="profile-entry">{html}</div>')
block("education", "".join(education))

experience = []
for entry in content.get("experience", []):
    html = tag("p", entry["period"], "profile-period") + tag("h4", entry["organization"], "profile-title")
    html += tag("p", " · ".join(filter(None, [entry["role"], entry.get("institution")])), "profile-subtitle")
    if entry.get("description"):
        html += tag("p", entry["description"], "profile-description")
    experience.append(f'<div class="profile-entry">{html}</div>')
block("experience", "".join(experience))

publications = []
for entry in content.get("publications", []):
    meta = f'{", ".join(entry["authors"])} · {entry.get("status") or "arXiv preprint"} · {entry["year"]}'
    html = tag("p", meta, "publication-meta") + tag("h3", entry["title"]) + tag("p", entry["summary"], "publication-summary")
    resources = entry.get("links", [{"label": "Read on arXiv ↗", "url": entry.get("url")}, {"label": "PDF ↗", "url": entry.get("pdf")}])
    html += '<div class="publication-links">' + resource_links(resources, "text-link") + "</div>"
    publications.append(f'<article class="publication-card">{html}</article>')
block("publications", "".join(publications))

projects = []
for entry in content.get("projects", []):
    if entry.get("draft"):
        continue
    html = tag("div", entry["category"], "project-category") + tag("h3", entry["title"]) + tag("p", entry["description"])
    resources = entry.get("links", [{"label": "View project ↗", "url": entry.get("url")}])
    links = resource_links(resources, "project-action")
    if links:
        html += '<div class="project-links">' + links + "</div>"
    projects.append(f'<article class="project-card">{html}</article>')
block("projects", "".join(projects))

for filename in ("styles.css", "content.js", "app.js"):
    digest = sha256((DIST / filename).read_bytes()).hexdigest()[:12]
    page = re.sub(r"\./" + re.escape(filename) + r"(?:\?v=[a-zA-Z0-9_-]+)?", "./" + filename + "?v=" + digest, page)
(DIST / "index.html").write_text(page)
(DIST / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    f'  <url><loc>{escape(url)}</loc></url>\n</urlset>\n'
)
print("Generated profile HTML, search metadata, and sitemap.")
