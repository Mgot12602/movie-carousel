import React, { useState } from "react";
import "./CarouselSection.scss";

export interface ICarouselItem {
  image: string;
}

interface Props {
  title: string;
  items: ICarouselItem[];
}

export const CarouselSection: React.FC<Props> = ({ title, items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Calculate how many items to show based on viewport width
  const itemsToShow = 4; // Default for desktop
  const maxIndex = Math.max(0, items.length - itemsToShow);
  
  const scrollRight = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <h3>{title}</h3>
      </div>
      
      <div className="carousel-container">
        <button 
          className="carousel-arrow carousel-arrow-left" 
          onClick={scrollLeft} 
          disabled={currentIndex === 0}
          aria-label="Previous items"
        >
          ‹
        </button>
        
        <div className="carousel-viewport">
          <div 
            className="carousel-track" 
            style={{ transform: `translateX(-${currentIndex * 100 / itemsToShow}%)` }}
          >
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
    </div>
  );
};
