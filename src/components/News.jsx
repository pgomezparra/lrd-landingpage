import {NEWS} from "../data/news.js";
import {useEffect, useState} from "react";

export default function News() {


    return (
        <section className="landing_container__news">
          <div className="news">
              {NEWS.map((newData, index) => (
                  <div key={index} className="news__new">
                      <picture className="news__new__img">
                        <img  src={newData.image}/>
                      </picture>
                      <div className="news__new__title">{newData.title}</div>
                      <p className="news__new__text">{newData.new}</p>
                  </div>
              ))}
          </div>
        </section>
    );
}
