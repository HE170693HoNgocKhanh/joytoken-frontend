import React from "react";
import styled from "styled-components";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SlideContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 1100px;
  margin: 40px auto;
`;

const ImageSection = styled.div`
  flex: 1.2;
  height: 400px;
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center;
`;

const ContentSection = styled.div`
  flex: 0.8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-color: #fff;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 500;
  color: #333;
  margin-bottom: 60px;
`;

const DiscoverLink = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: color 0.3s ease;

  svg {
    color: #00b5e2;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(5px);
  }
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  gap: 20px;
`;

const ProgressBar = styled.div`
  width: 100px;
  height: 3px;
  background-color: #ddd;
  border-radius: 10px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    width: var(--progress, 40%);
    height: 3px;
    background-color: #00b5e2;
    border-radius: 10px;
    transition: width 0.4s ease;
  }
`;

const NavButtons = styled.div`
  display: flex;
  gap: 12px;

  button {
    background: #f5f5f5;
    border: none;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #777;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #e0e0e0;
    }
  }
`;

const PromoSlide = ({
  image,
  title,
  subtitle,
  onNext,
  onPrev,
  currentIndex,
  totalSlides,
}) => {
  return (
    <>
      <SlideContainer>
        <ImageSection bg={image} />
        <ContentSection>
          <Title>{title}</Title>
          <DiscoverLink>
            {subtitle} <FiArrowRight size={18} />
          </DiscoverLink>
        </ContentSection>
      </SlideContainer>

      <Pagination>
        <ProgressBar
          style={{
            "--progress": `${((currentIndex + 1) / totalSlides) * 100}%`,
          }}
        />
        <NavButtons>
          <button onClick={onPrev}>
            <FiChevronLeft size={20} />
          </button>
          <button onClick={onNext}>
            <FiChevronRight size={20} />
          </button>
        </NavButtons>
      </Pagination>
    </>
  );
};

export default PromoSlide;
