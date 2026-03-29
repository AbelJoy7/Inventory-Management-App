import urllib.request
import json
try:
    response = urllib.request.urlopen("http://127.0.0.1:8000/api/products/restock_recommendations/")
    data = response.read().decode('utf-8')
    print("API RESPONSE:", data)
except Exception as e:
    print("API ERROR:", e)
