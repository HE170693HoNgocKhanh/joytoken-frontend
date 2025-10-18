import React from "react";
import { ProductGrid } from "./style";
import ProductItem from "./ProductItem";

const products = [
  {
    id: 1,
    name: "Jellycat Jack Decoration",
    price: 25,
    label: "New In",
    image: "/images/product-test.jpg",
    rating: 4,
  },
  {
    id: 2,
    name: "Bashful Beige Bunny Decoration",
    price: 25,
    label: "New In",
    image: "/images/product-test.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Bartholomew Bear Tree Decoration",
    price: 25,
    label: "New In",
    image: "/images/product-test.jpg",
    rating: 5,
  },
  {
    id: 4,
    name: "Timmy Turtle Decoration",
    price: 25,
    label: "Best Seller",
    image: "/images/product-test.jpg",
    rating: 3,
  },
   {
    id: 5,
    name: "Timmy Turtle Decoration",
    price: 25,
    label: "Best Seller",
    image: "/images/product-test.jpg",
    rating: 3,
  },
];

const ProductList = () => {
  return (
    <ProductGrid>
      {products.map((item) => (
        <ProductItem key={item.id} product={item} />
      ))}
    </ProductGrid>
  );
};

export default ProductList;
