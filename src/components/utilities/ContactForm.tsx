import Script from 'next/script';

export function ContactForm() {
  return (
    <>
      <Script
        id="hubspot-form-script"
        src="https://js-na2.hsforms.net/forms/embed/243540143.js"
        strategy="afterInteractive"
        defer
      />
      <div className="hubspot-form-container">
        <div
          className="hs-form-frame bg-brand-blue rounded-lg"
          data-region="na2"
          data-form-id="5b8e40e6-732f-44ab-ae7e-311afb0b37e1"
          data-portal-id="243540143"
        ></div>
      </div>
    </>
  );
}
