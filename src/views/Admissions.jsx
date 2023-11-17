import Footer from "../components/Footer.jsx";

export default function Admissions() {
  return (
    <div className="admissions">
      <div className="admissions__content">
          <section className="admissions__content__old-student">
              <span className="admissions__title">REQUISITOS DE MATRÍCULA ESTUDIANTES ANTIGUOS</span>
              <ul className="admissions__text">
                  <li>Formulario de inscripción</li>
                  <li>Presentar boletín del año anterior</li>
                  <li>Registro civil de nacimiento</li>
                  <li>Fotocopia de Tarjeta de psy Identidad</li>
                  <li>Certificado médico</li>
                  <li>Carné de vacunas</li>
              </ul>
          </section>
          <section className="admissions__content__new-student">
              <span className="admissions__title">ESTUDIANTES NUEVOS</span>
              <ul className="admissions__text">
                  <li>Formulario de inscripción</li>
                  <li>Boletines años anteriores</li>
                  <li>Registro civil de nacimiento</li>
                  <li>Fotocopia de Tarjeta de psy Identidad</li>
                  <li>Certificado médico</li>
                  <li>Carné de Sisben o EPS</li>
                  <li>Certificados de notas desde quinto</li>
                  <li>Paz y salvo año anterior</li>
                  <li>Certificado de Retiro del SIMAT</li>
                  <li>Carpeta colgante oficio azul con gancho</li>
                  <li>Carné de vacunas</li>
              </ul>
          </section>
          <section className="admissions__content__valors">
              <span className="admissions__title">COSTOS EDUCATIVOS</span>
              <div className="admissions__content__valors__levels">
                  <div className="admissions__content__valors__levels__card">
                      <span className="admissions__title-card">PREESCOLAR Y PRIMARIA</span>
                      <span className="admissions__title-item">Valor Total de Matrícula</span>
                      <span className="admissions__value-item">$250.000</span>
                      <span className="admissions__title-item">Valor Pensión Mensual</span>
                      <span className="admissions__value-item">$105.000</span>
                  </div>
                  <div className="admissions__content__valors__levels__card">
                      <span className="admissions__title-card">BACHILLERATO 6° a 9°</span>
                      <span className="admissions__title-item">Valor Total de Matrícula</span>
                      <span className="admissions__value-item">$280.000</span>
                      <span className="admissions__title-item">Valor Pensión Mensual</span>
                      <span className="admissions__value-item">$120.000</span>
                  </div>
                  <div className="admissions__content__valors__levels__card">
                      <span className="admissions__title-card">BACHILLERATO 10° a 11°</span>
                      <span className="admissions__title-item">Valor Total de Matrícula</span>
                      <span className="admissions__value-item">$290.000</span>
                      <span className="admissions__title-item">Valor Pensión Mensual</span>
                      <span className="admissions__value-item">$125.000</span>
                  </div>
              </div>
              <span className="admissions__text">Incluye</span>
              <ul className="admissions__text">
                  <li>Matrícula</li>
                  <li>Seguro estudiantil (contra accidentes)</li>
                  <li>Carné estudiantil</li>
                  <li>Fotos</li>
                  <li>Sistematización y papelería</li>
                  <li>Agenda Escolar</li>
              </ul>
          </section>
          {/*<div className="admissions__content__philosophy">*/}
          {/*    <span className="admissions__title">FILOSOFÍA INSTITUCIONAL</span>*/}
          {/*    <p className="admissions__text">Se fundamenta en una filosofía religiosa y transformadora con el pensamiento de construir, una sociedad productiva, fundamentada en los principios de tolerancia, democracia participativa y autónoma, que se vivencie en la comunidad educativa y ayude a forjar el proyecto de vida de sus integrantes.</p>*/}
          {/*</div>*/}
          {/*<div className="admissions__content__motto">*/}
          {/*    <span className="admissions__title">LEMA INSTITUCIONAL</span>*/}
          {/*    <p>“Sabiduría, perseverancia y progreso”</p>*/}
          {/*</div>*/}
      </div>
      <Footer />
    </div>
  );
}
