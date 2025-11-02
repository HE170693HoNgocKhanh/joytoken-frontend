import React, { useState } from "react";
import PromoSlide from "./PromoSlide";

const slidesData = [
  {
    image: "https://i.imgur.com/YK7HkLC.jpeg", // slide 1
    title: "Season’s treatings!",
    subtitle: "DISCOVER POPULAR JELLIES",
  },
  {
    image: "https://i.imgur.com/lT5QL5A.jpeg", // slide 2
    title: "Fluffy friends are here",
    subtitle: "MEET THE NEW ARRIVALS",
  },
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slidesData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slidesData.length - 1 : prev - 1));
  };

  return (
    <PromoSlide
      image={slidesData[currentIndex].image}
      title={slidesData[currentIndex].title}
      subtitle={slidesData[currentIndex].subtitle}
      currentIndex={currentIndex}
      totalSlides={slidesData.length}
      onNext={handleNext}
      onPrev={handlePrev}
    />
  );
};

export default HeroCarousel;
