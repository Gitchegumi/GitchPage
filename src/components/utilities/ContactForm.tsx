"use client";

import Script from "next/script";

export function ContactForm() {
  return (
    <>
      <style>{`
        .hs-form-frame .hs-form label,
        .hs-form-frame .hs-form .hs-field-desc,
        .hs-form-frame .hs-form .hs-error-msg {
          color: #f0f0f0 !important;
        }
        .hs-form-frame .hs-form input[type="text"],
        .hs-form-frame .hs-form input[type="email"],
        .hs-form-frame .hs-form textarea,
        .hs-form-frame .hs-form select {
          background: rgba(44,44,44,0.8) !important;
          color: #f0f0f0 !important;
          border: 1px solid rgba(204,219,220,0.35) !important;
          border-radius: 8px !important;
        }
        .hs-form-frame .hs-form input[type="text"]::placeholder,
        .hs-form-frame .hs-form input[type="email"]::placeholder,
        .hs-form-frame .hs-form textarea::placeholder {
          color: rgba(240,240,240,0.45) !important;
        }
        .hs-form-frame .hs-form input[type="text"]:focus,
        .hs-form-frame .hs-form input[type="email"]:focus,
        .hs-form-frame .hs-form textarea:focus {
          border-color: rgba(65,102,245,0.8) !important;
          outline: none !important;
        }
        .hs-form-frame .hs-form input[type="submit"],
        .hs-form-frame .hs-form .hs-button {
          background: #fca311 !important;
          color: #2c2c2c !important;
          border: none !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
        }
        .hs-form-frame .hs-form input[type="submit"]:hover,
        .hs-form-frame .hs-form .hs-button:hover {
          opacity: 0.88 !important;
        }
      `}</style>
      <Script
        src="https://js-na2.hsforms.net/forms/embed/243540143.js"
        strategy="afterInteractive"
        defer
      />
      <div
        className="hs-form-frame p-4 rounded-2xl backdrop-blur-xl"
        style={{
          background: "rgba(65,102,245,0.2)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 32px rgba(65,102,245,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
        data-region="na2"
        data-form-id="5b8e40e6-732f-44ab-ae7e-311afb0b37e1"
        data-portal-id="243540143"
      ></div>
    </>
  );
}
