import React from "react";
import { Row, Col } from "antd";
import { WrapperFooter, FooterTitle, FooterLink } from "./style";

const FooterComponent = () => {
  return (
    <WrapperFooter>
      <Row gutter={[24, 24]}>
        {/* Logo */}
        <Col xs={24} md={6}>
          <img src="/images/logothuonghieu.png" alt="JoyToken Logo" className="footer-logo" />
          <p className="footer-slogan">For the joy of it.</p>
        </Col>

        {/* Shop Globally */}
        <Col xs={24} md={4}>
          <FooterTitle>Shop Globally</FooterTitle>
          <FooterLink>UK</FooterLink>
          <FooterLink>USA & Canada</FooterLink>
          <FooterLink>Germany</FooterLink>
          <FooterLink>Korea</FooterLink>
          <select className="store-select">
            <option>Choose your store</option>
          </select>
        </Col>

        {/* Shopping */}
        <Col xs={24} md={4}>
          <FooterTitle>Shopping</FooterTitle>
          <FooterLink>Need Help?</FooterLink>
          <FooterLink>Delivery</FooterLink>
          <FooterLink>Returns</FooterLink>
          <FooterLink>Gifting Options</FooterLink>
          <FooterLink>Safety & Care</FooterLink>
        </Col>

        {/* About */}
        <Col xs={24} md={4}>
          <FooterTitle>About</FooterTitle>
          <FooterLink>Our Story</FooterLink>
          <FooterLink>Jelly Journal</FooterLink>
          <FooterLink>Events & Experiences</FooterLink>
          <FooterLink>Find a Stockist</FooterLink>
          <FooterLink>Jelly Jobs</FooterLink>
        </Col>

        {/* Legal */}
        <Col xs={24} md={6}>
          <FooterTitle>Legal</FooterTitle>
          <FooterLink>Modern Slavery Statement</FooterLink>
          <FooterLink>Privacy & Cookie Policy</FooterLink>
          <FooterLink>Terms & Conditions</FooterLink>
          <FooterLink>Brand Protection Statement</FooterLink>
          <FooterLink>Corporate Responsibility</FooterLink>
        </Col>
      </Row>
    </WrapperFooter>
  );
};

export default FooterComponent;
