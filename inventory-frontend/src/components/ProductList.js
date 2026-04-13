import React, { useEffect, useState } from "react";
import API from "../services/api";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("products/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - Stock: {product.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;