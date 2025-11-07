import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import HeartButton from "../../components/ProductComponent/HeartButton";
import {
  Card,
  ProductImage,
  ProductName,
  ProductPrice,
  Label,
  Rating,
  AddButton,
  HeartButtonWrapper,
} from "./style";

const ProductItem = ({ product, onAddToCart }) => {
  return (
    <Card>
      {product.label && <Label>{product.label}</Label>}
      
      <HeartButtonWrapper>
        <HeartButton productId={product._id} withLabel={false} />
      </HeartButtonWrapper>

      <Link
        to={`/product/${product._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ProductImage src={product.image} alt={product.name} />
        <ProductName>{product.name}</ProductName>
        <ProductPrice>₫{(product.price || 0).toLocaleString("vi-VN")}</ProductPrice>
      </Link>

      {product.rating > 0 && (
        <Rating>
          {Array.from({ length: Math.floor(product.rating) || 0 }).map((_, i) => (
            <FaStar key={i} color="#f5a623" />
          ))}
        </Rating>
      )}

      <AddButton onClick={() => onAddToCart(product)}>Thêm vào giỏ hàng</AddButton>
    </Card>
  );
};

export default ProductItem;
