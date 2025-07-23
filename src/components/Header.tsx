import { Link } from "react-router";
import "./Header.scss";

const Header = () => {
  return (
    <header className="header">
      <nav className="header__nav">
        <div>
          <Link to="/" className="header__link">
            <h1>Home</h1>
          </Link>
        </div>
        <div>
          <Link to="/wishlisted" className="header__link">
            <h2>Wishlisted</h2>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
