import styled from "styled-components";

export const ProductGrid = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
  padding: 40px 0;
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
export const Card = styled.div`
  position: relative;
  width: 250px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  text-align: center;
  padding: 16px;
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-5px);
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
`;

export const ProductName = styled.h3`
  margin: 10px 0 5px;
  font-size: 18px;
  color: #333;
`;

export const ProductPrice = styled.p`
  font-weight: bold;
  color: #e67e22;
  font-size: 16px;
`;

export const Label = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff4757;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;
  z-index: 2;
`;

export const HeartButtonWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: scale(1.1);
  }
`;

export const Rating = styled.div`
  margin: 6px 0;
`;

export const AddButton = styled.button`
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  margin-top: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;

  &:hover {
    background-color: #27ae60;
  }
`;
