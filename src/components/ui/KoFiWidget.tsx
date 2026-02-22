import Image from "next/image";

export default function KoFiWidget() {
  return (
    <a
      href="https://ko-fi.com/V7V51UQXWZ"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="https://storage.ko-fi.com/cdn/kofi5.png?v=6"
        height={36}
        width={143}
        style={{ border: "0px", height: "36px", width: "auto" }}
        alt="Buy Me a Coffee at ko-fi.com"
      />
    </a>
  );
}
