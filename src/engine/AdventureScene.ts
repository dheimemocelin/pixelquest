import Phaser from "phaser";
import { forest, textures, tree } from "./art";
import { initialState } from "../games/hero/rules";
import { facingRotation } from "../games/hero/direction";
import type { Level, State, Step } from "../games/hero/types";
const CELL = 79,
  X = 323,
  Y = 211;
export class AdventureScene extends Phaser.Scene {
  private cancelAnimation?: () => void;
  private hero?: Phaser.GameObjects.Image;
  private arrow?: Phaser.GameObjects.Triangle;
  private keySprite?: Phaser.GameObjects.Image;
  private doorSprite?: Phaser.GameObjects.Image;
  private glow?: Phaser.GameObjects.Ellipse;
  constructor(
    private mode: "home" | "map" | "game",
    private level: Level | undefined,
    private reduced: boolean,
    private ready: (scene: AdventureScene) => void,
  ) {
    super("adventure");
  }
  create() {
    textures(this);
    forest(this, this.reduced);
    if (this.mode === "game" && this.level) this.board(this.level);
    else {
      const hero = this.add
        .image(
          this.mode === "home" ? 740 : 435,
          this.mode === "home" ? 610 : 610,
          "nilo",
        )
        .setScale(6)
        .setOrigin(0.5, 1);
      this.add
        .ellipse(hero.x, hero.y + 3, 68, 18, 0x162e2a, 0.35)
        .setDepth(-0.1);
      if (!this.reduced)
        this.tweens.add({
          targets: hero,
          y: hero.y - 5,
          duration: 1100,
          yoyo: true,
          repeat: -1,
          ease: "Sine.inOut",
        });
      this.add.image(870, 590, "chest").setScale(4);
    }
    this.ready(this);
  }
  private board(level: Level) {
    const g = this.add.graphics();
    g.fillStyle(0x112e29, 0.9).fillRoundedRect(254, 135, 692, 480, 18);
    g.lineStyle(3, 0x7c9466, 0.7).strokeRoundedRect(254, 135, 692, 480, 18);
    for (let y = 0; y < 5; y++)
      for (let x = 0; x < 7; x++) {
        const px = X + x * CELL,
          py = Y + y * CELL;
        const path = level.path.some((p) => p.x === x && p.y === y);
        g.fillStyle(
          path ? 0xb9aa76 : (x + y) % 2 ? 0x355b3e : 0x3c6443,
        ).fillRect(px - 37, py - 37, 74, 74);
        g.fillStyle(path ? 0xd0bf88 : 0x52764b).fillRect(
          px - 35,
          py - 35,
          70,
          3,
        );
        g.fillStyle(path ? 0x8d895d : 0x284a35).fillRect(
          px - 35,
          py + 31,
          70,
          5,
        );
        if (path) {
          g.fillStyle(0xe6d499, 0.35).fillRect(px - 21, py + 12, 13, 3);
          g.fillRect(px + 12, py - 17, 9, 3);
        } else if ((x + y) % 3 === 0)
          this.add.image(px, py + 6, "rock").setScale(4);
        else {
          g.fillStyle(0x7d995d, 0.7).fillRect(px - 9, py - 2, 3, 7);
          g.fillRect(px + 3, py - 7, 3, 12);
        }
      }
    // Start marker is kept visible when the hero leaves.
    g.lineStyle(2, 0xf9e6ae, 0.7).strokeCircle(
      X + level.start.x * CELL,
      Y + level.start.y * CELL,
      24,
    );
    this.glow = this.add.ellipse(
      X + level.treasure.x * CELL,
      Y + level.treasure.y * CELL,
      62,
      48,
      0xffd77d,
      0.22,
    );
    this.add
      .image(X + level.treasure.x * CELL, Y + level.treasure.y * CELL, "chest")
      .setScale(3.5);
    if (level.key)
      this.keySprite = this.add
        .image(X + level.key.x * CELL, Y + level.key.y * CELL, "key")
        .setScale(4);
    if (level.door)
      this.doorSprite = this.add
        .image(X + level.door.x * CELL, Y + level.door.y * CELL, "door")
        .setScale(4.5);
    const front = this.add.graphics();
    tree(front, 205, 640, 1.2);
    tree(front, 1010, 620, 1.25);
    this.hero = this.add
      .image(0, 0, "nilo")
      .setScale(3.8)
      .setOrigin(0.5, 0.78)
      .setDepth(5);
    this.arrow = this.add
      .triangle(0, 0, 0, 12, 6, 0, 12, 12, 0xffefb1)
      .setDepth(6);
    this.reset();
  }
  private orient(state: State) {
    this.arrow?.setRotation((state.direction * Math.PI) / 2);
    this.arrow?.setPosition(X + state.x * CELL, Y + state.y * CELL + 27);
    this.hero?.setRotation(facingRotation[state.direction]);
  }
  reset() {
    if (!this.level) return;
    this.cancelAnimation?.();
    this.cancelAnimation = undefined;
    this.tweens.killAll();
    const state = initialState(this.level);
    this.hero?.setPosition(X + state.x * CELL, Y + state.y * CELL);
    this.orient(state);
    this.keySprite?.setVisible(true);
    this.doorSprite?.setAlpha(1);
    this.glow?.setAlpha(1);
  }
  animate(step: Step): Promise<void> {
    return new Promise((resolve) => {
      this.cancelAnimation = () => {
        this.events.off("shutdown", resolve);
        resolve();
      };
      const done = () => {
        this.cancelAnimation = undefined;
        this.events.off("shutdown", resolve);
        this.orient(step.state);
        this.keySprite?.setVisible(!step.state.hasKey);
        if (step.state.hasKey) this.doorSprite?.setAlpha(0.3);
        if (step.state.won) this.glow?.setScale(1.45);
        resolve();
      };
      this.events.once("shutdown", resolve);
      if (!this.hero) {
        done();
        return;
      }
      this.orient({
        ...step.state,
        x: (this.hero.x - X) / CELL,
        y: (this.hero.y - Y) / CELL,
      });
      this.tweens.add({
        targets: this.hero,
        x: X + step.state.x * CELL,
        y: Y + step.state.y * CELL,
        duration: this.reduced ? 60 : 460,
        ease: "Sine.inOut",
        onComplete: done,
      });
    });
  }
}
