import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import {
  Card,
  ProductImage,
  ProductName,
  ProductPrice,
  Label,
  Rating,
  AddButton,
} from "./style";

const ProductItem = ({ product, onAddToCart }) => {
  return (
    <Card>
      {product.label && <Label>{product.label}</Label>}

      <Link
        to={`/product/${product._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ProductImage src={product.image} alt={product.name} />
        <ProductName>{product.name}</ProductName>
        <ProductPrice>€{product.price.toFixed(2)}</ProductPrice>
      </Link>

      {product.rating > 0 && (
        <Rating>
          {Array.from({ length: product.rating }).map((_, i) => (
            <FaStar key={i} color="#f5a623" />
          ))}
        </Rating>
      )}

      <AddButton onClick={() => onAddToCart(product)}>Add to Cart</AddButton>
    </Card>
  );
};

export default ProductItem;
