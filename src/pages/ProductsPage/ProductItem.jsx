import React from "react";
import { Card, ProductImage, ProductName, ProductPrice, Label, Rating } from "./style";
import { FaStar } from "react-icons/fa";

const ProductItem = ({ product }) => {
  return (
    <Card>
      <Label>{product.label}</Label>
      <a href={`/product/${product.id}`}>
        <ProductImage src={product.image} alt={product.name} />
        <ProductName>{product.name}</ProductName>
        <ProductPrice>€{product.price.toFixed(2)}</ProductPrice>
        {product.rating > 0 && (
          <Rating>
            {Array.from({ length: product.rating }).map((_, i) => (
              <FaStar key={i} color="#f5a623" />
            ))}
          </Rating>
        )}
      </a>
    </Card>
  );
};

export default ProductItem;
