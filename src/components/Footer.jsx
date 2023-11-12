import phoneIcon from "@/assets/img/footer/phone.svg"
import whatsappIcon from "@/assets/img/footer/whatsapp.svg"
import pointerIcon from "@/assets/img/footer/map-pointer.svg"
import instagramIcon from "@/assets/img/footer/instagram.svg"
import facebookIcon from "@/assets/img/footer/facebook.svg"

export default function Footer() {
    return <section className="layout__footer">
        <div className="footer">
            <div className="footer__address">
                <img className="footer__address__icon" src={pointerIcon} alt="phone"/>
                <span className="footer__address__text">Transversal 21 # 50N - 49</span>
                <a href="https://www.google.com/maps/place/Liceo+Rey+David/@7.1765305,-73.1362437,17z/data=!3m1!4b1!4m6!3m5!1s0x8e6814f6376aff57:0x1d7c9dc9f744bab0!8m2!3d7.1765252!4d-73.1336688!16s%2Fg%2F11c1nypynl?entry=ttu"
                   target="_blank" className="footer__address__link">Cómo llegar</a>
            </div>
            <a className="footer__phone-information" href="tel:+573158317079">
                <img className="footer__phone-information__icon" src={phoneIcon} alt="pointer"/>
                <span className="footer__phone-information__phone">3158317079</span>
            </a>
            <div className="footer__social">
                <span className="footer__social__text">Síguenos</span>
                <section className="footer__social__icons">
                    <a href="https://www.instagram.com/colegioliceoreydavid/" target="_blank">
                        <img className="footer__social__icon" src={instagramIcon} alt="instagram"/>
                    </a>
                    <a href="https://www.facebook.com/liceo.rey" target="_blank">
                        <img className="footer__social__icon" src={facebookIcon} alt="facebook"/>
                    </a>
                </section>
            </div>
        </div>
        <a className="footer__whatsapp"
           href="https://api.whatsapp.com/send?phone=573158317079&text=Hola%21%20Quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20admisiones."
           target="_blank">
            <img className="footer__whatsapp__icon" src={whatsappIcon} alt="phone"/>
        </a>
    </section>;
}
