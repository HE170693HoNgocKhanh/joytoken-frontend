import React from "react";
import Slider from "react-slick";
import { Card } from "antd";
import { HomeContainer, Banner, ProductSection } from "./style";

const products = [
  { id: 1, name: "Ricky Rain Frog", price: "€30.00", image: "/images/frog.jpg" },
  { id: 2, name: "Amuseables Storm Cloud", price: "€35.00", image: "/images/cloud.jpg" },
  { id: 3, name: "Bartholomew Bear", price: "€30.00", image: "/images/bear.jpg" },
  { id: 4, name: "Amuseables Coffee-To-Go Bag", price: "€38.00", image: "/images/coffee.jpg" },
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
      </ProductSection>
    </HomeContainer>
  );
};

export default HomePage;
