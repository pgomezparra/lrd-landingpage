import React, { useState } from 'react';
import modalImage from "@/assets/img/modal_info.jpg"
import closeCircle from "@/assets/img/close-circle.svg"

export default function MainModal(props) {
    const { isOpen, onClose, children } = props;

    return isOpen ? (
        <div className="menu__modal-overlay">
            <div className="menu__modal">
                <img src={closeCircle} className="menu__close-button" onClick={onClose} />
                <a href="https://api.whatsapp.com/send?phone=573158317079&text=Hola%21%20Quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20admisiones." target="_blank">
                    <img className="menu__modal__img" src={modalImage} alt="modal_image" />
                </a>
            </div>
        </div>
    ) : null;
}