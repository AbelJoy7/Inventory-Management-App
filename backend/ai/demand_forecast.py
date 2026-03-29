import pandas as pd
from sklearn.linear_model import LinearRegression
from orders.models import OrderItem


def predict_product_demand(product_id):

    orders = OrderItem.objects.filter(product_id=product_id)

    data = []

    for order in orders:
        data.append({
            "date": order.order.created_at.date(),
            "quantity": order.quantity
        })

    if len(data) < 2:
        return "Not enough data for prediction"

    df = pd.DataFrame(data)

    df["date"] = pd.to_datetime(df["date"])
    df["day"] = (df["date"] - df["date"].min()).dt.days

    X = df[["day"]]
    y = df["quantity"]

    model = LinearRegression()
    model.fit(X, y)

    next_day = [[df["day"].max() + 30]]

    prediction = model.predict(next_day)

    return int(prediction[0])