import type { ReactNode } from "react";
import type { Token } from "./types";

const palette: Record<string, string> = {
  ink: "#35443d",
  mint: "#71c69e",
  light: "#d8e9b7",
  gold: "#f2c96e",
  blue: "#83c6c6",
  rose: "#df9a91",
};

export function TempleGlyph({ token }: { token: Token }) {
  const glyph = token.glyph;
  if (!glyph) return null;
  const rect = (x: number, y: number, w: number, h: number, color: string) => (
    <rect key={`${x}-${y}-${color}`} x={x} y={y} width={w} height={h} fill={palette[color]} />
  );
  const parts: Record<string, ReactNode[]> = {
    ball: [rect(12, 7, 24, 34, "ink"), rect(7, 12, 34, 24, "ink"), rect(12, 12, 24, 24, "blue"), rect(17, 17, 6, 6, "light"), rect(27, 27, 7, 6, "ink")],
    frog: [rect(10, 15, 28, 22, "mint"), rect(9, 9, 11, 13, "ink"), rect(28, 9, 11, 13, "ink"), rect(12, 12, 6, 7, "light"), rect(30, 12, 6, 7, "light"), rect(14, 15, 3, 4, "ink"), rect(32, 15, 3, 4, "ink"), rect(18, 29, 12, 3, "ink")],
    moon: [rect(12, 8, 21, 6, "gold"), rect(7, 14, 25, 7, "gold"), rect(7, 21, 20, 7, "gold"), rect(12, 28, 13, 7, "gold"), rect(20, 34, 7, 5, "gold"), rect(23, 9, 10, 5, "ink"), rect(27, 14, 7, 7, "ink"), rect(26, 21, 6, 7, "ink")],
    cat: [rect(12, 12, 24, 25, "gold"), rect(9, 7, 9, 12, "gold"), rect(30, 7, 9, 12, "gold"), rect(17, 20, 4, 5, "ink"), rect(28, 20, 4, 5, "ink"), rect(22, 26, 5, 3, "rose"), rect(19, 31, 12, 3, "ink")],
    run: [rect(20, 6, 10, 10, "gold"), rect(17, 17, 15, 7, "mint"), rect(22, 23, 7, 12, "mint"), rect(12, 32, 13, 6, "blue"), rect(27, 31, 12, 6, "blue"), rect(10, 18, 9, 6, "mint")],
    jump: [rect(19, 5, 10, 9, "gold"), rect(15, 15, 18, 9, "mint"), rect(20, 24, 7, 8, "mint"), rect(10, 29, 12, 5, "blue"), rect(29, 29, 10, 5, "blue"), rect(4, 12, 6, 6, "gold"), rect(38, 13, 6, 6, "gold")],
    key: [rect(8, 8, 20, 20, "gold"), rect(12, 12, 12, 12, "ink"), rect(23, 18, 6, 6, "gold"), rect(28, 20, 12, 7, "gold"), rect(33, 25, 5, 10, "gold"), rect(27, 25, 5, 6, "gold")],
    door: [rect(10, 5, 28, 39, "gold"), rect(15, 11, 18, 33, "ink"), rect(18, 14, 12, 27, "blue"), rect(27, 27, 3, 3, "gold")],
    star: [rect(20, 4, 8, 10, "gold"), rect(16, 13, 16, 7, "gold"), rect(5, 17, 38, 8, "gold"), rect(12, 24, 24, 6, "gold"), rect(14, 29, 8, 12, "gold"), rect(26, 29, 8, 12, "gold")],
    sun: [rect(17, 5, 14, 8, "gold"), rect(17, 35, 14, 8, "gold"), rect(5, 17, 8, 14, "gold"), rect(35, 17, 8, 14, "gold"), rect(13, 13, 22, 22, "gold"), rect(18, 18, 5, 5, "light"), rect(28, 28, 4, 4, "light")],
    sprout: [rect(22, 22, 5, 20, "mint"), rect(10, 16, 14, 5, "mint"), rect(8, 10, 12, 8, "mint"), rect(26, 14, 13, 5, "mint"), rect(31, 8, 9, 8, "mint"), rect(10, 40, 29, 4, "ink")],
    rock: [rect(8, 25, 8, 13, "blue"), rect(14, 15, 11, 23, "blue"), rect(23, 19, 14, 19, "blue"), rect(17, 13, 8, 6, "light"), rect(31, 20, 5, 5, "light"), rect(7, 38, 32, 4, "ink")],
    house: [rect(8, 20, 32, 22, "gold"), rect(5, 15, 19, 8, "rose"), rect(24, 15, 19, 8, "rose"), rect(20, 30, 8, 12, "ink"), rect(11, 26, 6, 6, "blue"), rect(31, 26, 6, 6, "blue")],
  };
  return (
    <svg className="temple-glyph" viewBox="0 0 48 48" aria-hidden="true" shapeRendering="crispEdges">
      {parts[glyph]}
    </svg>
  );
}
