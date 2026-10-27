import Phaser from "phaser";
import { textures, tree } from "./art";

export class TempleScene extends Phaser.Scene {
  constructor(private reducedMotion: boolean) {
    super("word-temple");
  }

  create() {
    textures(this);
    const g = this.add.graphics();
    g.fillStyle(0x1d1c37).fillRect(0, 0, 1200, 760);
    g.fillStyle(0x292747).fillEllipse(590, 260, 1000, 580);
    g.fillStyle(0x3a3658).fillRect(0, 430, 1200, 330);
    g.fillStyle(0x514766).fillRoundedRect(418, 116, 364, 494, 160);
    g.fillStyle(0x292747).fillRoundedRect(454, 151, 292, 448, 138);
    g.fillStyle(0x725f78).fillRoundedRect(477, 187, 246, 414, 116);
    g.fillStyle(0x322d4e).fillRoundedRect(500, 223, 200, 382, 98);
    for (let y = 452; y < 740; y += 58) {
      for (let x = 0; x < 1200; x += 142) {
        g.fillStyle((x + y) % 2 ? 0x625571 : 0x584b67);
        g.fillRect(x + ((y / 58) % 2) * 22, y, 138, 54);
        g.lineStyle(2, 0x3b354f, 0.8).strokeRect(
          x + ((y / 58) % 2) * 22,
          y,
          138,
          54,
        );
      }
    }
    // Original carved doorway with three glowing letter stones.
    g.lineStyle(8, 0xd1aa64, 0.9).strokeRoundedRect(500, 226, 200, 380, 98);
    g.fillStyle(0xb98b52).fillRoundedRect(515, 479, 170, 127, 65);
    g.fillStyle(0x574663).fillRoundedRect(531, 495, 138, 112, 55);
    g.fillStyle(0xf3d786).fillCircle(647, 554, 7);
    [0x8bd1b1, 0xf0cd7a, 0x8fc7d1].forEach((color, i) => {
      const x = 550 + i * 50;
      g.fillStyle(color, 0.24).fillCircle(x, 320, 27);
      g.fillStyle(color).fillRoundedRect(x - 16, 304, 32, 32, 8);
      g.fillStyle(0x3a3150).fillRect(x - 7, 313, 5, 12);
      g.fillRect(x + 3, 313, 5, 12);
    });
    tree(g, 147, 423, 0.72, 1);
    tree(g, 1050, 414, 0.75, 1);
    const torches = [
      this.add.ellipse(322, 344, 44, 58, 0xffbd61, 0.65),
      this.add.ellipse(878, 344, 44, 58, 0xffbd61, 0.65),
      this.add.ellipse(322, 344, 24, 37, 0xffefae, 0.9),
      this.add.ellipse(878, 344, 24, 37, 0xffefae, 0.9),
    ];
    if (!this.reducedMotion) {
      this.tweens.add({
        targets: torches,
        scaleY: 1.18,
        alpha: 0.64,
        duration: 560,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });
    }
    const hero = this.add
      .image(386, 625, "nilo")
      .setScale(5.2)
      .setOrigin(0.5, 1)
      .setDepth(2);
    this.add.ellipse(386, 630, 80, 18, 0x13142a, 0.48).setDepth(1);
    if (!this.reducedMotion) {
      this.tweens.add({
        targets: hero,
        y: 618,
        duration: 1050,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });
    }
    g.fillStyle(0xe4c477, 0.85).fillRect(372, 669, 28, 4);
    g.fillStyle(0x332e4e).fillRect(390, 664, 20, 12);
  }
}
