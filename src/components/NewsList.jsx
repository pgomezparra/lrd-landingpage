import {NEWS} from "../data/news.js";
import {useEffect, useState} from "react";

export default function NewsList() {
    return (
          <section className="news__content">
              {NEWS.map((newData, index) => (
                  <div key={index} className="news__content__new">
                      <picture className="news__content__new__img">
                        <img  src={newData.image}/>
                      </picture>
                      <div className="news__content__new__title">{newData.title}</div>
                      <p className="news__content__new__text">{newData.new}</p>
                  </div>
              ))}
          </section>
    );
}
