import Menu from "./Menu";
import Logo from "./Logo";
import MainModal from "./MainModal.jsx";
import {useState} from "react";

export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

  return (
    <section className="layout__header">
      <Logo />
      <Menu />
        <MainModal isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
}
