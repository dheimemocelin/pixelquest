import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { TempleScene } from "../engine/TempleScene";

export function TempleCanvas() {
  const host = useRef<HTMLDivElement>(null);
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
        scene: new TempleScene(
          window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        ),
      });
    } catch {
      setFailed(true);
    }
    return () => game?.destroy(true);
  }, []);
  return (
    <div className="temple-canvas" ref={host} aria-hidden={!failed}>
      {failed && <p role="alert">O templo não abriu. Tente atualizar a página.</p>}
    </div>
  );
}
