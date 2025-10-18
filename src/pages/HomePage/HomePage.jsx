import React from "react";
import Slider from "react-slick";
import { Card } from "antd";
import { HomeContainer, Banner, ProductSection ,CategorySection} from "./style";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Ricky Rain Frog",
    price: "€30.00",
    image: "/images/frog.jpg",
  },
  {
    id: 2,
    name: "Amuseables Storm Cloud",
    price: "€35.00",
    image: "/images/cloud.jpg",
  },
  {
    id: 3,
    name: "Bartholomew Bear",
    price: "€30.00",
    image: "/images/bear.jpg",
  },
  {
    id: 4,
    name: "Amuseables Coffee-To-Go Bag",
    price: "€38.00",
    image: "/images/coffee.jpg",
  },
  { id: 5, name: "Bashful Bunny", price: "€29.00", image: "/images/bunny.jpg" },
  { id: 6, name: "Cozy Piglet", price: "€27.00", image: "/images/piglet.jpg" },
];


const HomePage = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };



  return (
    <HomeContainer>
      {/* Banner */}
      <Banner>
        <img src="/images/banner.jpg" alt="Banner" className="banner-image" />
        <div className="banner-text">
          <h2>Singing on the inside</h2>
          <p>
            They may not look it, but when the clouds gather and rainy days
            beckon, these Jelly grumps are in their element!
          </p>
          <button className="banner-btn">Find chums for glum days</button>
        </div>
      </Banner>

      {/* Product Section */}
      <ProductSection>
        <h2 className="section-title">Featured Products</h2>

        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Card
                hoverable
                cover={
                  <img
                    alt={product.name}
                    src={product.image}
                    style={{ height: 220, objectFit: "cover" }}
                  />
                }
              >
                <Card.Meta title={product.name} description={product.price} />
                
              </Card>
            </div>
          ))}
        </Slider>

        <h1
          style={{
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "24px",
            color: "#333",
            margin: "40px 0",
          }}
        >
          Welcome to the home of the Jellycat family where our mission is to
          share joy!
        </h1>

      </ProductSection>
      {/* ---------- SHOP BY CATEGORY ---------- */}
<CategorySection>
  <Link  to="/amuseables" className="category-card">
    <img src="/images/Amuseables.png" alt="Amuseables" />
    <div className="overlay">
      <h3>Meet the Amuseables</h3>
      <span className="arrow">→</span>
    </div>
  </Link>

  <Link to="/jellies" className="category-card">
    <img src="/images/Jellies.png" alt="Popular Jellies" />
    <div className="overlay">
      <h3>Discover popular Jellies</h3>
      <span className="arrow">→</span>
    </div>
  </Link>

  <Link to="/bag-charms" className="category-card">
    <img src="/images/Bags_Charms.png" alt="Bags and Charms" />
    <div className="overlay">
      <h3>Bags and charms that turn heads</h3>
      <span className="arrow">→</span>
    </div>
  </Link>
</CategorySection>

    </HomeContainer>
  );
};

export default HomePage;
