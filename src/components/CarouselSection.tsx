import React from "react";
import { Carousel, ICarouselItem } from "@/components/UI/Carousel/Carousel";
import "./CarouselSection.scss";

interface Props {
  title: string;
  items: ICarouselItem[];
}

export const CarouselSection: React.FC<Props> = ({ title, items }) => {
  // Default items to show - can be made responsive if needed
  const itemsToShow = 6;

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <h3>{title}</h3>
      </div>
      <Carousel items={items} itemsToShow={itemsToShow} />
    </div>
  );
};

export default CarouselSection;
