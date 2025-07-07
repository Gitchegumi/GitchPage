"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import Image from "next/image";

const BadgePlaceholder = () => <div style={{ width: 150, height: 270 }} />;

export default function Certifications() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-3xl font-semibold">Certifications</h2>
      <div className="flex flex-wrap gap-8 p-6 rounded-lg bg-soft-white">
        {isClient ? (
          <>
            <div
              data-iframe-width="150"
              data-iframe-height="270"
              data-share-badge-id="817446c4-03a9-4d42-9304-c3c8c68cb858"
              data-share-badge-host="https://www.credly.com"
            />

            <div
              data-iframe-width="150"
              data-iframe-height="270"
              data-share-badge-id="9e57daba-0304-453a-a1b9-a6b6fb7437dc"
              data-share-badge-host="https://www.credly.com"
            />

            <div
              data-iframe-width="150"
              data-iframe-height="270"
              data-share-badge-id="f204287b-b301-4cdf-bcd5-8c159c2a704f"
              data-share-badge-host="https://www.credly.com"
            />
          </>
        ) : (
          <>
            <BadgePlaceholder />
            <BadgePlaceholder />
            <BadgePlaceholder />
          </>
        )}
        {isClient && (
          <Script
            type="text/javascript"
            async
            src="//cdn.credly.com/assets/utilities/embed.js"
          />
        )}
        <div className="flex flex-col justify-center items-center rounded shadow">
          <Image
            src="/images/microsoft-certified-associate-badge.svg"
            alt="Microsoft Certified: Azure Administrator Associate"
            width={100}
            height={100}
          />
          <span className="px-2 text-center">
            <p className="mt-2 text-xs font-medium text-brand-dark">
              Microsoft Certified:
            </p>
            <p className="mt-1 text-xs font-medium text-brand-dark">
              Azure Administrator Associate (AZ-104)
            </p>
          </span>
          <a
            href="https://learn.microsoft.com/en-us/users/MatL-9995/credentials/C2EFA69B2E4C57DC"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline text-brand-blue"
          >
            View certification
          </a>
        </div>
      </div>
    </section>
  );
}

