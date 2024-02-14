import { ANNOUNCEMENTS } from "../data/announcements.js";

export default function Announcements() {
  return (
    <section className="landing_container__announcements" id="announcements">
      <div className="announcements">
        <div className="announcements__title">Anuncios</div>
        <div className="announcements__list">
          {ANNOUNCEMENTS.map((newData, index) => (
            <div key={index} className="announcements__list__announcement">
              <div className="announcements__list__announcement__date"></div>
              <span className="announcements__list__announcement__date-text">
                {newData.date}
              </span>
              <img
                className="announcements__list__announcement__img"
                src={newData.image}
              />
              <div className="announcements__list__announcement__title-bar"></div>
              <div className="announcements__list__announcement__title">
                {newData.title}
              </div>
              <div className="announcements__list__announcement__text">
                {newData.announcement}
              </div>
              {newData.links?.length > 0 && (
                <div className="announcements__list__announcement__links">
                  {newData.links.map((link, index) => (
                    <div
                      key={index}
                      className="announcements__list__announcement__link"
                    >
                      <a target="_blank" href={link.route}>
                        {link.label}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
