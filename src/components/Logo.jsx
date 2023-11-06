import logo from "../assets/img/logo.png";

export default function Logo() {
  return (
    <div className="menu__logo">
      <img className="menu__logo-img" src={logo} />
      <p className="menu__title">Liceo Rey David</p>
    </div>
  );
}
