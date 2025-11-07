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

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const [wishlist, setWishlist] = React.useState([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await axios.get("http://localhost:8080/api/products");
        setProducts(products.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
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
        <h2 className="section-title">✨ Featured Products ✨</h2>
        <Slider {...settings}>
          {products.map((product) => {
            const minPrice = product.variants?.length
              ? Math.min(...product.variants.map((v) => v.price))
              : product.price;
            const isWished = wishlist.includes(product._id);

            return (
              <div key={product._id} className="product-card">
                <div className="product-wrapper">
                  <div className="heart-icon" onClick={() => toggleWishlist(product._id)}>
                    <Heart
                      size={22}
                      color={isWished ? "#ff4d4f" : "#999"}
                      fill={isWished ? "#ff4d4f" : "none"}
                    />
                  </div>
                  <Card
                    onClick={() => navigate(`/product/${product._id}`)}
                    hoverable
                    cover={
                      <img
                        alt={product.name}
                        src={product.image}
                        style={{ height: 240, objectFit: "cover" }}
                      />
                    }
                  >
                    <Card.Meta
                      title={product.name}
                      description={`₫${minPrice.toLocaleString()}`}
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
        <Link to="/amuseables" className="category-card">
          <img src="/images/Amuseables.png" alt="Amuseables" />
          <div className="overlay">
            <h3>Meet the Amuseables</h3>
            <span className="arrow">→</span>
          </div>
        </Link>

        <Link to="/jellies" className="category-card">
          <img src="/images/Jellies.png" alt="Popular Jellies" />
          <div className="overlay">
            <h3>Discover Popular Jellies</h3>
            <span className="arrow">→</span>
          </div>
        </Link>

        <Link to="/bag-charms" className="category-card">
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
