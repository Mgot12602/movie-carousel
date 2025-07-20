import React, { useState } from "react";
import "./Carousel.scss";

export interface ICarouselItem {
  image: string;
  [key: string]: any;
}

interface Props {
  items: ICarouselItem[];
  itemsToShow?: number;
}

export const Carousel: React.FC<Props> = ({ items, itemsToShow = 6 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate max index based on items length and items to show
  const maxIndex = Math.max(0, items.length - itemsToShow);

  const scrollRight = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className="carousel-container"
      style={
        {
          "--items-to-show": itemsToShow,
          "--current-index": currentIndex,
        } as React.CSSProperties
      }
    >
      <button
        className="carousel-arrow carousel-arrow-left"
        onClick={scrollLeft}
        disabled={currentIndex === 0}
        aria-label="Previous items"
      >
        ‹
      </button>

      <div className="carousel-viewport">
        <div className="carousel-track">
          {items.map((item, index) => (
            <div className="carousel-item" key={`carousel-item-${index}`}>
              <img src={item.image} alt={`Item ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <button
        className="carousel-arrow carousel-arrow-right"
        onClick={scrollRight}
        disabled={currentIndex >= maxIndex}
        aria-label="Next items"
      >
        ›
      </button>
    </div>
  );
};
