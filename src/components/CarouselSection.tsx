import React from "react";
import { Carousel, ICarouselItem } from "@/components/UI/Carousel/Carousel";
import "./CarouselSection.scss";
import { MovieItem, SelectedGenre } from "@/types/movie";
import { useNavigate } from "react-router";

interface Props {
  title: string;
  items: MovieItem[];
}

export const CarouselSection: React.FC<Props> = ({ title, items }) => {
  const navigate = useNavigate();
  // Default items to show - can be made responsive if needed
  const itemsToShow = 8;

  const onClickItem = (item: ICarouselItem & { carouselGenre?: string }) => {
    // Navigate to /:movieId?genre=:genre
    navigate(`/${item.carouselGenre}/${item.id}`);
  };

  // Convert MovieItem to ICarouselItem for the Carousel
  const carouselItems = items.map((item) => ({
    id: item.id,
    image: item.image,
    carouselGenre: item.carouselGenre,
  }));

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
