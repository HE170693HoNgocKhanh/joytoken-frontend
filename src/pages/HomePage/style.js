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
  height: 520px; // tăng chiều cao banner
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.7);
    transition: transform 0.5s ease;
    cursor: pointer;
  }

  img:hover {
    transform: scale(1.05);
  }

  .banner-text {
    position: absolute;
    top: 50%;
    left: 10%;
    transform: translateY(-50%);
    color: #fff;
    max-width: 550px;
    animation: fadeInUp 1.2s ease forwards;
  }

  .banner-text h2 {
    font-size: 56px; // tăng font size
    font-weight: 700;
    margin-bottom: 18px;
  }

  .banner-text p {
    font-size: 20px; // tăng font size
    line-height: 1.6;
    margin-bottom: 30px;
  }

  .banner-btn {
    background-color: #ff7b00;
    color: white;
    border: none;
    padding: 14px 36px; // to hơn
    border-radius: 35px;
    font-weight: 600;
    font-size: 18px; // to hơn
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .banner-btn:hover {
    background-color: #ffa340;
    transform: scale(1.1);
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
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin-bottom: 50px;
    position: relative;
  }

  .section-title::after {
    content: "";
    position: absolute;
    width: 100px;
    height: 4px;
    background: #ff7b00;
    left: 50%;
    transform: translateX(-50%);
    bottom: -12px;
    border-radius: 2px;
  }

  /* ✅ Đảm bảo tất cả slide có cùng chiều cao */
  .slick-slide {
    height: auto;
    
    > div {
      height: 100%;
    }
  }

  .slick-list {
    margin: 0 -12px;
  }

  .slick-track {
    display: flex;
    align-items: stretch;
  }

  .product-card {
    padding: 0 12px;
    height: 100%; // ✅ Đảm bảo card chiếm toàn bộ chiều cao
    display: flex;
  }

  .product-wrapper {
    position: relative;
    height: 100%; // ✅ Đảm bảo wrapper chiếm toàn bộ chiều cao
    display: flex;
    flex-direction: column;
  }

  .heart-icon {
    position: absolute;
    top: 12px;
    right: 16px;
    z-index: 5;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    padding: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .heart-icon:hover {
    background: rgba(255, 123, 0, 0.95);
    transform: scale(1.2);
  }

  .best-seller-badge {
    position: absolute;
    top: 12px;
    left: 16px;
    z-index: 5;
    background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  .ant-card {
    border-radius: 20px; // ✅ Giữ nguyên bo góc ban đầu
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12); // ✅ Giữ nguyên shadow ban đầu
    transition: all 0.3s ease; // ✅ Giữ nguyên transition
    cursor: pointer;
    width: 100%; // ✅ Đảm bảo giữ nguyên kích thước
    height: 100%; // ✅ Chiều cao bằng nhau
    display: flex;
    flex-direction: column;
  }

  .ant-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
  }

  .ant-card:hover {
    transform: translateY(-8px); // ✅ Giảm transform để giữ kích thước
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.18);
  }

  .product-image-wrapper {
    position: relative;
    overflow: hidden;
    height: 320px; // ✅ Tăng chiều cao để ảnh không bị mất
    width: 100%;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    flex-shrink: 0; // ✅ Không cho phép co lại
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .ant-card:hover .product-image {
    transform: scale(1.1);
  }

  .sales-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    padding: 12px;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  .ant-card:hover .sales-overlay {
    transform: translateY(0);
  }

  .sales-text {
    color: white;
    font-size: 13px;
    font-weight: 600;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }

  .ant-card-meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .ant-card-meta-title {
    font-size: 18px;
    font-weight: 700;
    color: #222;
    text-align: center;
    margin-bottom: 8px;
    flex-shrink: 0;
  }

  .product-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    min-height: 50px; // ✅ Chiều cao tối thiểu để đồng nhất
    max-height: 50px; // ✅ Chiều cao tối đa để đồng nhất
  }

  .ant-card-meta-description {
    text-align: center;
    flex-shrink: 0;
    margin-top: auto; // ✅ Đẩy phần giá xuống dưới cùng
  }

  .product-price {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    min-height: 50px; // ✅ Chiều cao tối thiểu để đồng nhất
  }

  .price-main {
    font-size: 20px;
    color: #ff7b00;
    font-weight: 700;
  }

  .product-rating {
    font-size: 14px;
    color: #666;
    font-weight: 500;
    opacity: 0; // ✅ Ẩn mặc định
    transition: opacity 0.3s ease;
  }

  .product-rating-hover {
    opacity: 0; // ✅ Ẩn mặc định
  }

  .ant-card:hover .product-rating-hover {
    opacity: 1; // ✅ Hiện khi hover
  }

  /* Slider dots styling */
  .slick-dots {
    bottom: -50px;
  }

  .slick-dots li button:before {
    font-size: 12px;
    color: #ff7b00;
    opacity: 0.3;
  }

  .slick-dots li.slick-active button:before {
    opacity: 1;
    color: #ff7b00;
  }

  /* Slider arrows styling */
  .slick-prev,
  .slick-next {
    z-index: 10;
    width: 45px;
    height: 45px;
    background: rgba(255, 123, 0, 0.9);
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .slick-prev:hover,
  .slick-next:hover {
    background: #ff7b00;
    transform: scale(1.1);
  }

  .slick-prev {
    left: -20px;
  }

  .slick-next {
    right: -20px;
  }

  .slick-prev:before,
  .slick-next:before {
    font-size: 20px;
    color: white;
    opacity: 1;
  }
`;

/* ---------- Category Section ---------- */
export const CategorySection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 20px;
  margin-top: 80px;

  .category-card {
    position: relative;
    overflow: hidden;
    height: 440px; // to hơn
    cursor: pointer;
    border-radius: 16px;
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
    padding: 32px 28px;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
  }

  .overlay h3 {
    color: white;
    font-size: 22px;
    font-weight: 600;
    margin: 0;
  }

  .arrow {
    color: white;
    font-size: 28px;
    transition: transform 0.3s ease;
  }

  .category-card:hover .arrow {
    transform: translateX(10px);
  }
`;
