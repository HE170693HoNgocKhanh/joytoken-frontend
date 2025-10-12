import styled from "styled-components";

export const ProductGrid = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
  padding: 40px 0;
`;

export const Card = styled.div`
  position: relative;
  width: 220px;
  text-align: center;
  transition: transform 0.3s ease;
  
  a {
    color: black;
    text-decoration: none;
  }

  &:hover {
    transform: translateY(-5px);
  }
`;

export const Label = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: 1px solid #00aab5;
  color: #00aab5;
  padding: 4px 10px;
  font-size: 14px;
  border-radius: 4px;
  margin-top: 8px;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: auto;
  margin-top: 40px;
`;

export const ProductName = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin: 12px 0 4px 0;
`;

export const ProductPrice = styled.p`
  font-size: 15px;
  color: #333;
  margin: 4px 0;
`;

export const Rating = styled.div`
  display: flex;
  justify-content: center;
  gap: 2px;
  margin-top: 6px;
`;
