import {Link} from "react-router-dom";

import logo from "../assets/img/logo.png";

export default function Logo() {
  return (
    <div className="menu__logo">
        <Link to="/">
            <img className="menu__logo-img" src={logo} />
        </Link>
      <p className="menu__title">Liceo Rey David</p>
    </div>
  );
}
