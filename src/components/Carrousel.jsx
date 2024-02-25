import imageOne from "@/assets/img/carrousel/1.webp";
import imageTwo from "@/assets/img/carrousel/2.webp";
//import imageThree from "@/assets/img/carrousel/3.webp";
import { useEffect, useState } from "react";

export default function Carrousel() {
  const images = [imageOne, imageTwo];
  const [actualImage, setActualImage] = useState(0);

  useEffect(() => {
    const nextImage = (actualImage + 1) % images.length;
    const interval = setInterval(() => setActualImage(nextImage), 3000); // Cambia la imagen cada 3 segundos

    return () => clearInterval(interval);
  }, [actualImage, images]);

  const previousImage = () => {
    if (actualImage === 0) {
      setActualImage(images.length - 1);
    } else {
      setActualImage(actualImage - 1);
    }
  };

  const nextImage = () => {
    if (actualImage === images.length - 1) {
      setActualImage(0);
    } else {
      setActualImage(actualImage + 1);
    }
  };

  return (
    <section className="landing_container__carrousel">
      <div className="carrousel">
        {/*{images.map((image, index) => (*/}
        {/*    <img*/}
        {/*        key={index}*/}
        {/*        className={index === actualImage ? 'carrousel__img' : ''}*/}
        {/*        src={image}*/}
        {/*        alt={`Image ${index}`}*/}
        {/*    />*/}
        {/*))}*/}
        <img src={images[actualImage]} className="carrousel__img" />
        <button
          className="carrousel__previous"
          onClick={previousImage}
        >{`<`}</button>
        <button className="carrousel__next" onClick={nextImage}>{`>`}</button>
      </div>
    </section>
  );
}
