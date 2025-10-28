import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ProductGrid } from "./style";
import ProductItem from "./ProductItem";

const ProductList = () => {
  const [products, setProducts] = useState([]); // Lưu danh sách sản phẩm
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      let res;
      try {
        if (!category) {
          res = await axios.get("http://localhost:8080/api/products");
        } else {
          res = await axios.get(
            `http://localhost:8080/api/products?category=${category}`
          );
        }

        setProducts(res.data.data || []); // Dữ liệu trong field `data`
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>Lỗi: {error}</p>;
  if (products.length === 0) return <p>Không có sản phẩm nào.</p>;

  return (
    <ProductGrid>
      {products.map((item) => (
        <ProductItem key={item._id} product={item} />
      ))}
    </ProductGrid>
  );
};

export default ProductList;
