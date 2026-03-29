import urllib.request
import json

endpoints = [
    "/api/analytics/monthly-sales/",
    "/api/analytics/stock-distribution/",
    "/api/analytics/top-products/",
    "/api/products/low_stock/",
    "/api/products/restock_recommendations/",
    "/api/analytics/summary/"
]

for ep in endpoints:
    url = f"http://127.0.0.1:8000{ep}"
    try:
        req = urllib.request.Request(url)
        response = urllib.request.urlopen(req)
        data = response.read().decode('utf-8')
        print(f"SUCCESS {ep}: len={len(data)}  content={data[:200]}...")
    except Exception as e:
        print(f"ERROR {ep}: {e}")
