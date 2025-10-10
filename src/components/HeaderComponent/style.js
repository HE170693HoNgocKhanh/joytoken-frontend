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
`;


export const WrapperMenu = styled(Menu)`
  display: flex;
  justify-content: center;
  border-bottom: none !important;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.5px;
`;
