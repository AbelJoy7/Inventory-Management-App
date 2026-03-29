import urllib.request
import urllib.error

url = "http://127.0.0.1:8000/api/analytics/summary/"
try:
    req = urllib.request.Request(url)
    response = urllib.request.urlopen(req)
    print("SUCCESS")
except urllib.error.HTTPError as e:
    print(f"ERROR {e.code}")
    html = e.read().decode('utf-8', errors='ignore')
    
    with open("404.html", "w") as f:
        f.write(html)
    print("Saved 404.html")
