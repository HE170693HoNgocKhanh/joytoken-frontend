import { useNavigate } from "react-router-dom";
import { Card } from "antd";
import { Heart } from "lucide-react";
import { useWishlist } from "../../hooks/useWishlist";
import {
  ProductCardWrapper,
  ProductImageWrapper,
  ProductImage,
  HeartIcon,
  BestSellerBadge,
  ProductTitle,
  ProductPrice,
  ProductRating,
  AddButton,
  CardStyles,
} from "./style";

const ProductItem = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { toggle, has } = useWishlist();
  
  const minPrice = product.variants?.length
    ? Math.min(...product.variants.map((v) => v.price))
    : product.price;
  const isWished = has(product._id);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggle(product._id);
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <CardStyles>
      <ProductCardWrapper>
        <div className="product-wrapper">
          <HeartIcon onClick={handleWishlistToggle}>
            <Heart
              size={22}
              color={isWished ? "#ff4d4f" : "#999"}
              fill={isWished ? "#ff4d4f" : "none"}
            />
          </HeartIcon>
          
          {product.orderValue > 0 && (
            <BestSellerBadge>🔥 Bán Chạy</BestSellerBadge>
          )}

          <Card
            onClick={handleCardClick}
            hoverable
            cover={
              <ProductImageWrapper>
                <ProductImage
                  alt={product.name}
                  src={product.image}
                  className="product-image"
                />
                {product.orderValue > 0 && (
                  <div className="sales-overlay">
                    <span className="sales-text">
                      Đã bán: ₫{product.orderValue.toLocaleString()}
                    </span>
                  </div>
                )}
              </ProductImageWrapper>
            }
          >
            <Card.Meta
              title={<ProductTitle>{product.name}</ProductTitle>}
              description={
                <div className="product-price">
                  <ProductPrice>₫{minPrice.toLocaleString()}</ProductPrice>
                  {product.rating > 0 && (
                    <ProductRating className="product-rating-hover">
                      ⭐ {product.rating.toFixed(1)}
                    </ProductRating>
                  )}
                </div>
              }
            />
          </Card>

          <AddButton onClick={() => {
            onAddToCart(product);
            navigate(`/product/${product._id}`)
            }}>
            Thêm vào giỏ hàng
          </AddButton>
        </div>
      </ProductCardWrapper>
    </CardStyles>
  );
};

export default ProductItem;
