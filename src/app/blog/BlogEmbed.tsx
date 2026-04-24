"use client";

import { useEffect, useRef, useState } from "react";
import { TieredSubscribeForm } from "@/components/TieredSubscribeForm";

const ERP_URL = process.env.NEXT_PUBLIC_ERP_URL || "https://erp.gitchegumi.com";

interface BlogEmbedProps {
  src?: string;
  title?: string;
}

export function BlogEmbed({ src, title = "Gitchegumi Blog" }: BlogEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(600);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== ERP_URL) return;
      if (event.data?.type === "blog-resize" && typeof event.data.height === "number") {
        setIframeHeight(event.data.height);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="relative">
      <iframe
        ref={iframeRef}
        src={src ?? `${ERP_URL}/blog?embed=1`}
        title={title}
        className="w-full border-0"
        style={{ height: iframeHeight, overflow: "hidden" }}
        scrolling="no"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
      <TieredSubscribeForm />
    </div>
  );
}
