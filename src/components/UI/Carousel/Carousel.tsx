import React, { useState, useEffect } from "react";
import { BREAKPOINTS } from "@/constants/breakpoints";
import "./Carousel.scss";

export interface ICarouselItem {
  id: number;
  image: string;
  [key: string]: unknown;
}

interface Props {
  items: ICarouselItem[];
  itemsToShow?: number;
  onClickItem?: (item: ICarouselItem) => void;
}

const DEFAULT_ITEMS_TO_SHOW = 6;
export const Carousel: React.FC<Props> = ({
  items,
  onClickItem,
  itemsToShow: propItemsToShow,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responsiveItemsToShow, setResponsiveItemsToShow] = useState(
    propItemsToShow ?? DEFAULT_ITEMS_TO_SHOW
  );

  useEffect(() => {
    const calculateItemsToShow = () => {
      const width = window.innerWidth;
      if (width <= BREAKPOINTS.SM) return 1;
      if (width <= BREAKPOINTS.MD) return 2;
      if (width <= BREAKPOINTS.LG) return 3;
      return propItemsToShow ?? DEFAULT_ITEMS_TO_SHOW;
    };

    const handleResize = () => {
      setResponsiveItemsToShow(calculateItemsToShow());
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [propItemsToShow]);

  const maxIndex = Math.max(0, items.length - responsiveItemsToShow);

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
          "--items-to-show": responsiveItemsToShow,
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
          {items.map((item) => (
            <div
              className="carousel-item"
              key={`carousel-item-${item.id}`}
              onClick={() => onClickItem?.(item)}
            >
              <img src={item.image} alt={`Item ${item.id}`} />
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
