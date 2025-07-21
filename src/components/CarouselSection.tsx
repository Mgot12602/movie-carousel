import React from "react";
import { Carousel, ICarouselItem } from "@/components/UI/Carousel/Carousel";
import "./CarouselSection.scss";
import { MovieItem } from "@/types/movie";
import buildUrl from "@/utils/buildUrl";

interface Props {
  title: string;
  items: MovieItem[];
}

export const CarouselSection: React.FC<Props> = ({ title, items }) => {
  // Default items to show - can be made responsive if needed
  const itemsToShow = 8;

  // Convert MovieItem to ICarouselItem for the Carousel
  const carouselItems = items.map((item) => ({
    id: item.id,
    image: item.image,
    carouselGenre: item.carouselGenre,
  }));

  const onClickItem = (item: ICarouselItem) => {
    const url = buildUrl("details", {
      genre: item.carouselGenre,
      id: item.id,
    });
    window.location.href = url;
  };

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <h3>{title}</h3>
      </div>
      <Carousel
        items={carouselItems}
        itemsToShow={itemsToShow}
        onClickItem={onClickItem}
      />
    </div>
  );
};

export default CarouselSection;
