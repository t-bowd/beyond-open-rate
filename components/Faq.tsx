"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { faqs } from "@/lib/content";

const INITIAL_SHOW = 6;

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(-1);
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? faqs : faqs.slice(0, INITIAL_SHOW);

  return (
    <section className="section" id="faq" data-screen-label="FAQ">
      <div className="wrap">
        <Reveal className="section-head">
          <h2>The things people ask first.</h2>
        </Reveal>
        <Reveal className="faq-list">
          {visible.map((item, i) => {
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
                <div className="faq-a" style={{ maxHeight: open ? "480px" : "0px" }}>
                  <div className="faq-a-inner">{item.a}</div>
                </div>
              </div>
            );
          })}
        </Reveal>
        {!showAll && faqs.length > INITIAL_SHOW && (
          <Reveal style={{ marginTop: 24, textAlign: "center" } as React.CSSProperties}>
            <button
              className="btn btn-ghost"
              onClick={() => setShowAll(true)}
            >
              Show {faqs.length - INITIAL_SHOW} more questions
            </button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
