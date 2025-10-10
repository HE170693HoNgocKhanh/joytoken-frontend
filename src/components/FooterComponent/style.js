import styled from "styled-components";

export const WrapperFooter = styled.div`
  background-color: #26c6da;
  color: #000;
  padding: 40px 80px;
  font-family: "Arial", sans-serif;

  .footer-logo {
    width: 120px;
    margin-bottom: 10px;
  }

  .footer-slogan {
    font-size: 16px;
    font-weight: 500;
  }

  .store-select {
    width: 100%;
    margin-top: 10px;
    padding: 6px;
    border-radius: 6px;
    border: none;
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
    text-align: center;

    .footer-logo {
      margin: 0 auto 10px;
    }
  }
`;

export const FooterTitle = styled.h4`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
`;

export const FooterLink = styled.p`
  font-size: 15px;
  margin: 4px 0;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: white;
  }
`;
