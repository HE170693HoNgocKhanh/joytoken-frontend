import styled from "styled-components";

export const HomeContainer = styled.div`
  width: 100%;
  background-color: #fffdfd;
  padding-bottom: 80px;
  font-family: "Poppins", sans-serif;
`;

/* ---------- Banner ---------- */
export const Banner = styled.div`
  position: relative;
  width: 100%;
  height: 480px;
  overflow: hidden;

  .banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.75);
  }

  .banner-text {
    position: absolute;
    top: 50%;
    left: 10%;
    transform: translateY(-50%);
    color: #fff;
    max-width: 500px;
    animation: fadeInUp 1.2s ease forwards;
  }

  .banner-text h2 {
    font-size: 50px;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .banner-text p {
    font-size: 18px;
    line-height: 1.5;
    margin-bottom: 28px;
  }

  .banner-btn {
    background-color: #ff7b00;
    color: white;
    border: none;
    padding: 12px 32px;
    border-radius: 30px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s ease;
  }

  .banner-btn:hover {
    background-color: #ffa340;
    transform: scale(1.05);
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/* ---------- Product Section ---------- */
export const ProductSection = styled.div`
  margin-top: 80px;
  padding: 0 60px;

  .section-title {
    text-align: center;
    font-size: 30px;
    font-weight: 700;
    color: #333;
    margin-bottom: 40px;
    position: relative;
  }

  .section-title::after {
    content: "";
    position: absolute;
    width: 80px;
    height: 4px;
    background: #ff7b00;
    left: 50%;
    transform: translateX(-50%);
    bottom: -10px;
    border-radius: 2px;
  }

  .product-card {
    padding: 0 12px;
  }

  .product-wrapper {
    position: relative;
  }

  .heart-icon {
    position: absolute;
    top: 10px;
    right: 14px;
    z-index: 5;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    padding: 6px;
    cursor: pointer;
    transition: 0.3s;
  }

  .heart-icon:hover {
    background: rgba(255, 123, 0, 0.9);
  }

  .ant-card {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: 0.3s ease;
  }

  .ant-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }

  .ant-card-meta-title {
    font-size: 16px;
    font-weight: 600;
    color: #222;
  }

  .ant-card-meta-description {
    font-size: 14px;
    color: #777;
  }
`;

/* ---------- Category Section ---------- */
export const CategorySection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 0;
  margin-top: 80px;

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
    transform: scale(1.08);
  }

  .overlay {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 28px 24px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(4px);
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
  }

  .arrow {
    color: white;
    font-size: 26px;
    transition: transform 0.3s ease;
  }

  .category-card:hover .arrow {
    transform: translateX(8px);
  }
`;
