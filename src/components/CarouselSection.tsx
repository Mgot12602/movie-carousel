import React from "react";
import { Carousel, ICarouselItem } from "@/components/UI/Carousel/Carousel";
import "./CarouselSection.scss";
import { MovieItem } from "@/types/movie";
import buildUrl from "@/utils/buildUrl";
import { useNavigate } from "react-router";

interface Props {
  title: string;
  items: MovieItem[];
}

export const CarouselSection: React.FC<Props> = ({ title, items }) => {
  const navigate = useNavigate();
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
      genre: item.carouselGenre as string,
      id: item.id,
    });
    navigate(url);
  };

  return (
    <div className="box carousel-section">
      <h3>{title}</h3>
      <Carousel
        items={carouselItems}
        itemsToShow={itemsToShow}
        onClickItem={onClickItem}
      />
    </div>
  );
};

export default CarouselSection;
