import styled from "styled-components";

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 40px 60px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    padding: 30px 40px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    padding: 20px 24px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    padding: 20px 16px;
  }
`;

export const FilterContainer = styled.div`
  background: #fff;
  padding: 20px 24px;
  border-radius: 0;
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const FilterTagsContainer = styled.div`
  padding: 12px 0;
`;

export const ProductCardWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const ProductCardWrapperInner = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const HeartIcon = styled.div`
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

  &:hover {
    background: rgba(255, 123, 0, 0.95);
    transform: scale(1.2);
  }
`;

export const BestSellerBadge = styled.div`
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

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

export const ProductImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 320px;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  flex-shrink: 0;

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

  .sales-text {
    color: white;
    font-size: 13px;
    font-weight: 600;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

export const ProductTitle = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  min-height: 50px;
  max-height: 50px;
  font-size: 18px;
  font-weight: 700;
  color: #222;
  text-align: center;
`;

export const ProductPrice = styled.span`
  font-size: 20px;
  color: #ff7b00;
  font-weight: 700;
`;

export const ProductRating = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

export const AddButton = styled.button`
  width: 100%;
  background-color: #ff7b00;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  margin-top: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ffa340;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 123, 0, 0.3);
  }
`;

// ✅ Style cho Card từ antd
export const CardStyles = styled.div`
  .product-wrapper {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .ant-card {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
    transition: all 0.3s ease;
    cursor: pointer;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .ant-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.18);
  }

  .ant-card:hover .product-image {
    transform: scale(1.1);
  }

  .ant-card:hover .sales-overlay {
    transform: translateY(0);
  }

  .ant-card:hover .product-rating-hover {
    opacity: 1;
  }

  .ant-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
  }

  .ant-card-meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .ant-card-meta-title {
    flex-shrink: 0;
    margin-bottom: 8px;
  }

  .ant-card-meta-description {
    text-align: center;
    flex-shrink: 0;
    margin-top: auto;
  }

  .product-price {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    min-height: 50px;
  }
`;
