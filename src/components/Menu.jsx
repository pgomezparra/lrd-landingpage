import menuLogo from "@/assets/img/hamburguer-menu.svg"
import {useState} from "react";
import {Link} from "react-router-dom";
export default function Menu() {
    const [openMenu, setOpenMenu] = useState(false)
    const [activeMenu, setActiveMenu] = useState(0)
    const changeOpenMenu = () => {
        setOpenMenu(!openMenu)
    }
    const closeMenu = (index) => {
        setOpenMenu(false)
        setActiveMenu(index)
    }

  return (
    <nav className="menu">
        <img className="menu__hamburguer-logo" onClick={changeOpenMenu} src={menuLogo} alt="menu" />
      <ul className={openMenu ? 'menu__list menu__open-menu' : 'menu__list menu__closed-menu'}>
          <Link  to="/" style={{ textDecoration: 'none' }}><li onClick={() => closeMenu(0)} className={activeMenu == 0 ? 'menu-active' : ''}>Inicio</li></Link>
          <Link  to="/institution" style={{ textDecoration: 'none' }}><li onClick={() => closeMenu(1)} className={activeMenu == 1 ? 'menu-active' : ''}>Institución</li></Link>
          {/*<li onClick={closeMenu}><Link to="/institution" style={{ textDecoration: 'none' }}>Docentes</Link></li>*/}
          {/*<li onClick={closeMenu}><Link to="/institution" style={{ textDecoration: 'none' }}>Estudiantes</Link></li>*/}
          {/*<li onClick={closeMenu}><Link to="/institution" style={{ textDecoration: 'none' }}>Información</Link></li>*/}
      </ul>
    </nav>
  );
}
