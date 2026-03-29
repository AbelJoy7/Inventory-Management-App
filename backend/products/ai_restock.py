from products.models import Product
from ai.demand_forecast import predict_product_demand


def get_restock_recommendations(user=None):
    recommendations = []

    if user and user.is_authenticated and user.role == 'SUPPLIER':
        products = Product.objects.filter(supplier=user)
    else:
        products = Product.objects.all()

    for product in products:

        predicted_demand = predict_product_demand(product.id)

        if isinstance(predicted_demand, (int, float)) and predicted_demand > product.stock:
            recommended_quantity = predicted_demand - product.stock

            recommendations.append({
                "product_id": product.id,
                "product_name": product.name,
                "current_stock": product.stock,
                "predicted_demand": predicted_demand,
                "recommended_restock_quantity": recommended_quantity
            })

    return recommendations