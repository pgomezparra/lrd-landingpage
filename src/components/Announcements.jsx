import {ANNOUNCEMENTS} from "../data/announcements.js";

export default function Announcements() {


    return (
        <section className="landing_container__announcements">
          <div className="announcements">
              <div className="announcements__title">Anuncios</div>
              {ANNOUNCEMENTS.map((newData, index) => (
                  <div key={index} className="announcements__announcement">
                      <img className="announcements__announcement__img" src={newData.image}/>
                      <div className="announcements__announcement__text">{newData.announcement}</div>
                  </div>
              ))}
          </div>
        </section>
    );
}
