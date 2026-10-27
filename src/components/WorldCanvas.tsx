import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { AdventureScene } from "../engine/AdventureScene";
import type { Level } from "../games/hero/types";
export function WorldCanvas({
  mode,
  level,
  onReady,
}: {
  mode: "home" | "map" | "game";
  level?: Level;
  onReady?: (scene: AdventureScene) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const ready = useRef(onReady);
  ready.current = onReady;
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!host.current) return;
    let game: Phaser.Game | undefined;
    try {
      game = new Phaser.Game({
        type: Phaser.CANVAS,
        parent: host.current,
        width: 1200,
        height: 760,
        pixelArt: true,
        roundPixels: true,
        transparent: true,
        banner: false,
        audio: { noAudio: true },
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: new AdventureScene(
          mode,
          level,
          window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          (scene) => ready.current?.(scene),
        ),
      });
    } catch {
      setFailed(true);
    }
    return () => {
      game?.destroy(true);
    };
  }, [mode, level]);
  return (
    <div className={`world-canvas ${mode}`} aria-hidden={!failed} ref={host}>
      {failed && (
        <p role="alert">
          Não foi possível desenhar a aventura. Atualize a página em um
          navegador recente.
        </p>
      )}
    </div>
  );
}
