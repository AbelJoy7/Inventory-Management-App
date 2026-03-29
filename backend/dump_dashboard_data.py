import urllib.request
import json
import traceback

endpoints = [
    "/api/analytics/monthly-sales/",
    "/api/analytics/stock-distribution/",
    "/api/analytics/top-products/",
    "/api/products/low_stock/",
    "/api/products/restock_recommendations/"
]

output = {}

for ep in endpoints:
    url = f"http://127.0.0.1:8000{ep}"
    try:
        req = urllib.request.Request(url)
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        output[ep] = data
    except Exception as e:
        output[ep] = {"error": str(e), "traceback": traceback.format_exc()}

with open("dashboard_dump.json", "w") as f:
    json.dump(output, f, indent=4)
