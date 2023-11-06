import Footer from "../components/Footer.jsx";

export default function Institution() {
  return (
    <div className="institution">
      <div className="institution__content">
          <div className="institution__content__mission">
              <span className="institution__title">MISIÓN</span>
              <p className="institution__text">El Liceo Rey David es una Institución de carácter cristiano con el propósito de honrar a Dios, cumpliendo nuestra labor con responsabilidad y excelencia, para formar hombres y mujeres con principios y valores cristianos, con criterios éticos, cívicos e intelectuales, buscando la adquisición de habilidades para el trabajo, contribuyendo así a la construcción de su proyecto de vida y servicio a la comunidad.</p>

              <span className="institution__title">VISIÓN</span>
              <p className="institution__text">Para el 2028, el Liceo Rey David se consolidará como una institución educativa cristiana que formará jóvenes comprometidos en transformar su comunidad y el país de Colombia, fundamentados en valores y principios bíblicos.</p>
          </div>
          <div className="institution__content__principles">
              <span className="institution__title">PRINCIPIOS PEDAGÓGICOS</span>
              <p className="institution__text">Entre los aspectos claves de aprendizaje que se fomentan en este contexto, se encuentran la flexibilidad, la individualización y colectividad del aprendizaje, la creatividad, el conocimiento, la habilidad, el desarrollo personal, la capacidad de aprender a vivir juntos y la capacidad de aprender a aprender.</p>
          </div>
          <div className="institution__content__valors">
              <span className="institution__title">VALORES INSTITUCIONALES</span>
              <ul className="institution__text">
                  <li>Respeto por el libre desarrollo de la personalidad</li>
                  <li>Respeto por las diferencias de cada individuo que integra la Comunidad Educativa</li>
                  <li>Respeto por la vida</li>
                  <li>Respeto por la naturaleza</li>
                  <li>Libertad de culto</li>
                  <li>Seguimiento a los principios éticos que rigen a la Comunidad Educativa</li>
              </ul>
              </div>
          <div className="institution__content__philosophy">
              <span className="institution__title">FILOSOFÍA INSTITUCIONAL</span>
              <p className="institution__text">Se fundamenta en una filosofía religiosa y transformadora con el pensamiento de construir, una sociedad productiva, fundamentada en los principios de tolerancia, democracia participativa y autónoma, que se vivencie en la comunidad educativa y ayude a forjar el proyecto de vida de sus integrantes.</p>
          </div>
          <div className="institution__content__motto">
              <span className="institution__title">LEMA INSTITUCIONAL</span>
              <p>“Sabiduría, perseverancia y progreso”</p>
          </div>
      </div>
      <Footer />
    </div>
  );
}
