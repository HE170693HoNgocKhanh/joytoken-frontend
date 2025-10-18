import styled from "styled-components";

export const HomeContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fafafa;
  padding-bottom: 60px;
`;

/* -------- Banner -------- */
export const Banner = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;

  .banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.85);
  }

  .banner-text {
    position: absolute;
    top: 50%;
    left: 10%;
    transform: translateY(-50%);
    color: white;
    max-width: 500px;
  }

  .banner-text h2 {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .banner-text p {
    font-size: 18px;
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .banner-btn {
    background-color: #ff7b00;
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 25px;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s;
  }

  .banner-btn:hover {
    background-color: #ff9b32;
    transform: scale(1.05);
  }
`;

/* -------- Product Section -------- */
export const ProductSection = styled.div`
  margin-top: 60px;
  padding: 0 60px;

  .section-title {
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 40px;
  }

  .product-card {
    padding: 0 12px;
  }

  .ant-card {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: 0.3s;
  }

  .ant-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  .ant-card-meta-title {
    font-size: 16px;
    font-weight: 600;
    color: #222;
  }

  .ant-card-meta-description {
    font-size: 14px;
    color: #666;
  }

  /* ----- Slick Slider Custom ----- */
  .slick-prev,
  .slick-next {
    z-index: 2;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    transition: all 0.3s;
  }

  .slick-prev:hover,
  .slick-next:hover {
    background-color: #ff7b00;
  }

  .slick-prev:before,
  .slick-next:before {
    color: #333;
    font-size: 20px;
  }
`;
export const CategorySection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 0;
  margin-top: 60px;

  .category-card {
    position: relative;
    overflow: hidden;
    height: 420px;
    cursor: pointer;
  }

  .category-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.5s ease;
  }

  .category-card:hover img {
    transform: scale(1.05);
  }

  .overlay {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 28px 24px;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(2px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
  }

  .overlay h3 {
    color: white;
    font-size: 20px;
    font-weight: 500;
    margin: 0;
    font-family: "Poppins", sans-serif;
  }

  .arrow {
    color: white;
    font-size: 26px;
    font-weight: 300;
    transition: transform 0.3s ease;
  }

  .category-card:hover .arrow {
    transform: translateX(8px);
  }
`
;
