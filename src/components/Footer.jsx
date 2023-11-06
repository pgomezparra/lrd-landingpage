import phoneIcon from "@/assets/img/footer/phone.svg"
import whatsappIcon from "@/assets/img/footer/whatsapp.svg"
export default function Footer() {
  return <div className="layout__footer">
    <a className="footer__phone-information" href="tel:+573158317079">
      <img className="footer__phone-information__icon" src={phoneIcon} alt="phone" />
      <span className="footer__phone-information__phone">3158317079</span>
    </a>
    <a className="footer__whatsapp" href="https://api.whatsapp.com/send?phone=573158317079&text=Hola%21%20Quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20admisiones."
       target="_blank">
      <img className="footer__whatsapp__icon" src={whatsappIcon} alt="phone" />
    </a>
  </div>;
}
