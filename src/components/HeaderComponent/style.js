import styled from "styled-components";
import { Row, Menu } from "antd";

export const WrapperHeader = styled.div`
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 100%;
`;

export const WrapperTop = styled(Row)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 80px;
`;

export const WrapperLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: 0px;
`;

export const WrapperSearch = styled.div`
  width: 300px;   /* ô search cố định 300px */
  max-width: 100%;
  position: relative;
`;

export const SearchDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  max-height: 500px;
  overflow-y: auto;
  z-index: 1000;
`;

export const SearchResultItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

export const SearchProductCard = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const SearchProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
`;

export const SearchProductInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ViewAllButton = styled.div`
  padding: 16px;
  text-align: center;
  cursor: pointer;
  background-color: #fafafa;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

export const WrapperMenu = styled(Menu)`
  display: flex;
  justify-content: center;
  border-bottom: none !important;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.5px;
`;
