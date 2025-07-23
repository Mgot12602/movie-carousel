import React from "react";
import useFavoriteMoviesStore from "@/stores/useFavoriteMoviesStore";
import { Link } from "react-router";
import Layout from "@/components/UI/Layout/Layout";
import trashIcon from "@/assets/icons/trash-icon.svg";
import "./Whishlisted.scss";

const Whishlisted: React.FC = () => {
  const { getAll, unfavorite } = useFavoriteMoviesStore();
  const favoriteMovies = getAll();

  if (!favoriteMovies.length) {
    return (
      <Layout>
        <section className="box container">
          <h2>No Favorite Movies</h2>
          <p>Movies you favorite will appear here</p>
          <Link to="/">Browse Movies</Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="box container">
        <h1>My Favorite Movies</h1>
        <div className="favorite-movies-list">
          {favoriteMovies.map((movie) => (
            <div key={movie.id} className="favorite-movie-item">
              <div>
                <h3>{movie.title}</h3>

                <button
                  title={`Remove ${movie.title} from favorites`}
                  onClick={() => unfavorite(movie.id)}
                  aria-label={`Remove ${movie.title} from favorites`}
                  className="remove-favorite-button"
                >
                  <img src={trashIcon} alt="Remove" width="20" height="20" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Whishlisted;
