"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { faqs } from "@/lib/content";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="section" id="faq" data-screen-label="FAQ">
      <div className="wrap">
        <Reveal className="section-head">
          <h2>The things people ask first.</h2>
        </Reveal>
        <Reveal className="faq-list">
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <div className={`faq-item ${open ? "open" : ""}`} key={item.q}>
                <button
                  className="faq-q"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? -1 : i)}
                >
                  {item.q}
                  <span className="plus"></span>
                </button>
                <div
                  className="faq-a"
                  style={{ maxHeight: open ? "320px" : "0px" }}
                >
                  <div className="faq-a-inner">{item.a}</div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
