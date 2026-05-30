"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const FAQS = [
  { q: "Which email platforms do you work in?", a: "We work day to day in Klaviyo, HubSpot, Customer.io and Mailchimp, and we'll happily migrate you if you're on the wrong tool. If you're not sure what you're on, the audit will tell you." },
  { q: "Do you only work with e-commerce?", a: "No — e-commerce and SaaS are where we do our best work, but any business with a list and something to sell is a fit. The mechanics of good lifecycle email travel well." },
  { q: "How are you priced?", a: "A flat monthly retainer based on scope — no surprise hourly bills. Most clients start with a fixed build project, then move to an ongoing retainer once the foundations are live." },
  { q: "How long until we see results?", a: "Your first automated flow is usually live within two weeks, and that's typically where early revenue shows up. Campaign performance compounds from there over the following months." },
  { q: "What do you need from us to start?", a: "Access to your email platform and store, your brand assets, and a half-hour kickoff call. We handle the rest and keep the back-and-forth light." },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="section" id="faq" data-screen-label="FAQ">
      <div className="wrap">
        <Reveal className="section-head">
          <h2>The things people ask first.</h2>
        </Reveal>
        <Reveal className="faq-list">
          {FAQS.map((item, i) => {
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
