export type IconName =
  | "up"
  | "down"
  | "left"
  | "right"
  | "play"
  | "sound"
  | "mute"
  | "home"
  | "star"
  | "key"
  | "close"
  | "help"
  | "reset"
  | "leaf"
  | "map"
  | "check"
  | "expand"
  | "compress";
const paths: Record<IconName, string> = {
  up: "M12 2 4 10h5v12h6V10h5z",
  down: "m12 22 8-8h-5V2H9v12H4z",
  left: "M2 12 10 4v5h12v6H10v5z",
  right: "m22 12-8-8v5H2v6h12v5z",
  play: "M7 3v18l15-9z",
  sound: "M3 9h5l6-5v16l-6-5H3z M18 7v10h3V7z",
  mute: "M3 9h5l6-5v16l-6-5H3z M18 9h3v6h-3z",
  home: "M2 11 12 2l10 9h-4v11h-5v-7h-3v7H5V11z",
  star: "m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1z",
  key: "M3 3h10v10H9v9H5V12H3z M6 6v4h4V6z",
  close: "m4 2 8 8 8-8 2 2-8 8 8 8-2 2-8-8-8 8-2-2 8-8-8-8z",
  help: "M4 3h16v9h-6v3h-4V9h6V7H8v2H4z M10 18h4v4h-4z",
  reset: "M5 2v5h14v4H5v5L0 9z M19 12h4v10H5v-4h14z",
  leaf: "M4 4h18v10h-4v4H8v4H4v-8H0V8h4z",
  map: "M1 5 8 2l8 3 7-3v17l-7 3-8-3-7 3z",
  check: "m2 11 4-4 5 5 8-10 4 4-12 16z",
  expand: "M3 9V3h6v2H5v4zm18 0V5h-4V3h6v6zM3 15h2v4h4v2H3zm16 4v-4h2v6h-6v-2z",
  compress: "M5 3h2v4h4v2H5zm14 0v6h-6V7h4V3zM5 21v-6h6v2H7v4zm14 0h-2v-4h-4v-2h6z",
};
export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={paths[name]} fillRule="evenodd" />
    </svg>
  );
}
