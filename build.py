"""Build index.html (the full page Vercel serves) from src/dashboard.html (the page body)."""
from pathlib import Path

src = Path(__file__).parent / "src" / "dashboard.html"
out = Path(__file__).parent / "index.html"
body = src.read_text()
cut = body.index("</style>\n") + len("</style>\n")

head = """<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Weekly planner for school, SAT prep, gym, golf and app development around 8 hours of sleep">
<meta name="theme-color" content="#0f0f10">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23141415'/%3E%3Cpath d='M11 7v18M11 8h11l-3 4.5 3 4.5H11' fill='none' stroke='%234cb07a' stroke-width='2.5' stroke-linejoin='round'/%3E%3C/svg%3E">
"""
out.write_text(head + body[:cut] + "</head>\n<body>\n" + body[cut:] + "\n</body>\n</html>\n")
print("wrote", out)
