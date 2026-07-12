"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import { faqs as globalFaqs } from "@/lib/content";

function renderAnswer(text: string) {
  return text.split("\n\n").map((para, i) => {
    const parts = para.split(/(\[[^\]]+\]\([^)]+\))/g);
    return (
      <p key={i}>
        {parts.map((part, j) => {
          const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          return m ? <Link key={j} href={m[2]}>{m[1]}</Link> : part;
        })}
      </p>
    );
  });
}

export type FaqItem = { q: string; a: string };

const INITIAL_SHOW = 6;

type FaqProps = {
  /** Custom items , falls back to the global site FAQs when omitted. */
  items?: FaqItem[];
  /**
   * When true (default), renders the full standalone section with heading
   * and show-more. Set to false to render the accordion list inline inside
   * an existing section.
   */
  standalone?: boolean;
};

export default function Faq({ items, standalone = true }: FaqProps) {
  const source = items ?? globalFaqs;
  const canShowMore = standalone && !items && source.length > INITIAL_SHOW;

  const [openIndex, setOpenIndex] = useState(-1);
  const [showAll, setShowAll] = useState(false);

  const visible = canShowMore && !showAll ? source.slice(0, INITIAL_SHOW) : source;

  const list = (
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
              <span className="plus" />
            </button>
            <div className="faq-a" style={{ maxHeight: open ? "480px" : "0px" }}>
              <div className="faq-a-inner">
                {renderAnswer(item.a)}
              </div>
            </div>
          </div>
        );
      })}
    </Reveal>
  );

  if (!standalone) return list;

  return (
    <section className="section" id="faq" data-screen-label="FAQ">
      <div className="wrap">
        <Reveal className="section-head">
          <h2 className="display-huge faq-heading">Your questions answered</h2>
        </Reveal>
        {list}
        {canShowMore && !showAll && (
          <Reveal style={{ marginTop: 24, textAlign: "center" } as React.CSSProperties}>
            <button className="btn btn-ghost" onClick={() => setShowAll(true)}>
              Show {source.length - INITIAL_SHOW} more questions
            </button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
