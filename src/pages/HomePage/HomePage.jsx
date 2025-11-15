import React from "react";
import Slider from "react-slick";
import { Card } from "antd";
import { Heart } from "lucide-react";
import {
  HomeContainer,
  Banner,
  ProductSection,
  CategorySection,
} from "./style";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useWishlist } from "../../hooks/useWishlist";

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const { toggle, has } = useWishlist();

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fallback: lấy products bình thường (vì endpoint featured đã bị xóa)
        const fallbackResponse = await axios.get("http://localhost:8080/api/products?limit=100");
        setProducts(fallbackResponse.data.data || []);
      } catch (fallbackErr) {
        console.error("Error fetching products:", fallbackErr);
      }
    };
    fetchProducts();
  }, []);

  const handleWishlistToggle = (e, productId) => {
    e.stopPropagation(); 
    toggle(productId);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, 
    arrows: true,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <HomeContainer>
      {/* ---------- Banner ---------- */}
      <Banner>
        <img src="/images/banner.jpg" alt="Banner" className="banner-image" />
        <div className="banner-text">
          <h2>Soft. Sweet. Simply Jelly.</h2>
          <p>Discover the cutest plush friends designed to bring joy to everyone.</p>
          <button className="banner-btn">Shop Now</button>
        </div>
      </Banner>

      {/* ---------- Product Section ---------- */}
      <ProductSection>
        <h2 className="section-title">✨ Sản Phẩm Bán Chạy ✨</h2>
        <Slider {...settings}>
          {products.map((product) => {
            const minPrice = product.variants?.length
              ? Math.min(...product.variants.map((v) => v.price))
              : product.price;
            const isWished = has(product._id);

            return (
              <div key={product._id} className="product-card">
                <div className="product-wrapper">
                  <div 
                    className="heart-icon" 
                    onClick={(e) => handleWishlistToggle(e, product._id)}
                  >
                    <Heart
                      size={22}
                      color={isWished ? "#ff4d4f" : "#999"}
                      fill={isWished ? "#ff4d4f" : "none"}
                    />
                  </div>
                  {product.orderValue > 0 && (
                    <div className="best-seller-badge">🔥 Bán Chạy</div>
                  )}
                  <Card
                    onClick={() => navigate(`/product/${product._id}`)}
                    hoverable
                    cover={
                      <div className="product-image-wrapper">
                        <img
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
                      </div>
                    }
                  >
                    <Card.Meta
                      title={<div className="product-title">{product.name}</div>}
                      description={
                        <div className="product-price">
                          <span className="price-main">₫{minPrice.toLocaleString()}</span>
                          {product.rating > 0 && (
                            <span className="product-rating product-rating-hover">
                              ⭐ {product.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      }
                    />
                  </Card>
                </div>
              </div>
            );
          })}
        </Slider>
      </ProductSection>

      {/* ---------- Category Section ---------- */}
      <CategorySection>
        <Link to="/products" className="category-card">
          <img src="/images/Amuseables.png" alt="Amuseables" />
          <div className="overlay">
            <h3>Meet the Amuseables</h3>
            <span className="arrow">→</span>
          </div>
        </Link>

        <Link to="/products" className="category-card">
          <img src="/images/Jellies.png" alt="Popular Jellies" />
          <div className="overlay">
            <h3>Discover Popular Jellies</h3>
            <span className="arrow">→</span>
          </div>
        </Link>

        <Link to="/products" className="category-card">
          <img src="/images/Bags_Charms.png" alt="Bags and Charms" />
          <div className="overlay">
            <h3>Style Your Look</h3>
            <span className="arrow">→</span>
          </div>
        </Link>
      </CategorySection>
    </HomeContainer>
  );
};

export default HomePage;
