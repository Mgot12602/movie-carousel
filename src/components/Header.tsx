import React from "react";
import { Link } from "react-router";
import "./Header.scss";

const Header = () => {
  return (
    <header className="header">
      <nav className="header__nav">
        <div className="header__title">
          <Link to="/" className="header__link">
            {"Home"}
          </Link>
        </div>
        <div className="header__actions">
          <Link to="/wishlisted" className="header__link">
            Wishlisted
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
