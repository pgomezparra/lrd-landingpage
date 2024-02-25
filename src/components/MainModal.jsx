import React, { useState } from "react";
import modalImage from "@/assets/img/activities.webp";
import closeCircle from "@/assets/img/close-circle.svg";
import { useLocation } from "react-router-dom";

export default function MainModal(props) {
  const { isOpen, onClose, children } = props;

  const location = useLocation();
  const path = location.pathname;

  return isOpen && path === "/" ? (
    <div className="menu__modal-overlay">
      <div className="menu__modal">
        <img
          src={closeCircle}
          className="menu__close-button"
          onClick={onClose}
        />
        {/* <a
          href="https://api.whatsapp.com/send?phone=573158317079&text=Hola%21%20Quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20admisiones."
          target="_blank"
        > */}
        <img className="menu__modal__img" src={modalImage} alt="modal_image" />
        {/*   </a> */}
      </div>
    </div>
  ) : null;
}
