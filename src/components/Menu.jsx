import menuLogo from "@/assets/img/hamburguer-menu.svg"
import {useState} from "react";
import {Link, useLocation} from "react-router-dom";
export default function Menu() {
    const [openMenu, setOpenMenu] = useState(false)
    const location = useLocation();
    const path = location.pathname

    const changeOpenMenu = () => {
        setOpenMenu(!openMenu)
    }
    const closeMenu = () => {
        setOpenMenu(false)
    }

  return (
    <nav className="menu">
        <img className="menu__hamburguer-logo" onClick={changeOpenMenu} src={menuLogo} alt="menu" />
      <ul className={openMenu ? 'menu__list menu__open-menu' : 'menu__list menu__closed-menu'}>
          <Link  to="/" style={{ textDecoration: 'none' }}><li onClick={() => closeMenu()} className={path === '/' ? 'menu-active' : ''}>Inicio</li></Link>
          <Link  to="/institution" style={{ textDecoration: 'none' }}><li onClick={() => closeMenu()} className={path === '/institution' ? 'menu-active' : ''}>Institución</li></Link>
          <Link  to="/news" style={{ textDecoration: 'none' }}><li onClick={() => closeMenu()} className={path === '/news' ? 'menu-active' : ''}>Noticias</li></Link>
          <Link  to="https://classroom.google.com/" style={{ textDecoration: 'none' }} target="_blank"><li>Plataforma</li></Link>
          {/*<li onClick={closeMenu}><Link to="/institution" style={{ textDecoration: 'none' }}>Docentes</Link></li>*/}
          {/*<li onClick={closeMenu}><Link to="/institution" style={{ textDecoration: 'none' }}>Estudiantes</Link></li>*/}
          {/*<li onClick={closeMenu}><Link to="/institution" style={{ textDecoration: 'none' }}>Información</Link></li>*/}
      </ul>
    </nav>
  );
}
