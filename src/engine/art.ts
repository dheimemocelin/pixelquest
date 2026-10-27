import Phaser from "phaser";
// Original PixelQuest art: every shape is drawn here, without external assets.
export function textures(scene: Phaser.Scene) {
  if (scene.textures.exists("nilo")) return;
  const sprites: Record<
    string,
    { rows: string[]; colors: Record<string, number> }
  > = {
    nilo: {
      rows: [
        "      gggg      ",
        "    gggggggg    ",
        "   gggGgggggg   ",
        "   gGGGGGGGgg   ",
        "    hsssssh     ",
        "    ssdsdss     ",
        "     sssss      ",
        "    cccsccc     ",
        "   ccccccccs    ",
        "   scccccccs    ",
        "    ccyycc      ",
        "    bbbbb       ",
        "    bb bb       ",
        "   BBB BBB      ",
      ],
      colors: {
        g: 0x63c99a,
        G: 0xb7e6a0,
        h: 0x493d3d,
        s: 0xffd5a1,
        d: 0x233c3c,
        c: 0x3b9a91,
        y: 0xf5cb70,
        b: 0x364451,
        B: 0x243841,
      },
    },
    chest: {
      rows: [
        "  aaaaaaaaaa  ",
        " aooooooooooa ",
        "aooyooooooyo a".replace(" ", ""),
        "aooyooooooyoa",
        "aaaaaaaaaaaaa",
        "aoooooYoooooa",
        "aoooooYoooooa",
        "aoooooooooooa",
        " aaaaaaaaaaa ",
      ],
      colors: { a: 0x663d35, o: 0xd69748, y: 0xffd783, Y: 0xffecad },
    },
    key: {
      rows: [
        "  yyyy     ",
        " yy  yy    ",
        " yy  yy    ",
        "  yyyy     ",
        "    yy     ",
        "    yyyy   ",
        "    yy     ",
        "    yyyy   ",
      ],
      colors: { y: 0xffdf7b },
    },
    rock: {
      rows: [
        "   ssss   ",
        "  slllls  ",
        " slllllls ",
        "slllmlllss",
        "smmmmlmmms",
        " smmmmmms ",
        "  ssssss  ",
      ],
      colors: { s: 0x3e5b52, l: 0x91a79b, m: 0x6a8578 },
    },
    door: {
      rows: [
        "  sssssss  ",
        " sslllllss ",
        " sllldllls ",
        " sllldllls ",
        " sllldllls ",
        " sllydylls ",
        " sllldllls ",
        " sllldllls ",
        "sssssssssss",
      ],
      colors: { s: 0x49675b, l: 0x9aaf8d, d: 0x597365, y: 0xffd57b },
    },
  };
  for (const [name, { rows, colors }] of Object.entries(sprites)) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    rows.forEach((row, y) =>
      [...row].forEach((c, x) => {
        if (colors[c]) g.fillStyle(colors[c]).fillRect(x, y, 1, 1);
      }),
    );
    g.generateTexture(
      name,
      Math.max(...rows.map((r) => r.length)),
      rows.length,
    );
    g.destroy();
  }
}
export function tree(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  s: number,
  tone = 0,
) {
  const colors =
    tone === 0
      ? [0x153e35, 0x205b42, 0x34734c, 0x548b54]
      : [0x0e302c, 0x174638, 0x225640, 0x356a46];
  g.fillStyle(0x112c2a, 0.3).fillEllipse(x, y + 20 * s, 104 * s, 32 * s);
  g.fillStyle(0x574b35).fillRect(x - 9 * s, y - 75 * s, 18 * s, 95 * s);
  g.fillStyle(0x82613c).fillRect(x - 6 * s, y - 62 * s, 5 * s, 82 * s);
  const tiers = [
    [0, -153, 54, 28],
    [-16, -131, 88, 30],
    [-25, -107, 112, 34],
    [-36, -79, 130, 30],
  ];
  tiers.forEach(([offset, dy, w, h], i) => {
    g.fillStyle(colors[i % 3]).fillRect(
      x - (w * s) / 2,
      y + dy * s,
      w * s,
      h * s,
    );
    g.fillStyle(colors[3], 0.65).fillRect(
      x - (w * s) / 2 + 5 * s,
      y + dy * s,
      w * s * 0.42,
      6 * s,
    );
    g.fillStyle(colors[0]).fillRect(
      x + (w * s) / 2 - 13 * s,
      y + (dy + 8) * s,
      13 * s,
      h * s,
    );
    void offset;
  });
}
export function forest(scene: Phaser.Scene, reduced: boolean) {
  const g = scene.add.graphics();
  g.fillStyle(0x183d39).fillRect(0, 0, 1200, 760);
  // Layered horizon, moon and distant forest.
  g.fillStyle(0x244b43).fillRect(0, 80, 1200, 350);
  g.fillStyle(0x799c78, 0.13).fillCircle(810, 180, 155);
  g.fillStyle(0xb2c59a, 0.17).fillCircle(810, 180, 103);
  g.fillStyle(0xe7dda3).fillCircle(810, 180, 46);
  g.fillStyle(0x244b43).fillCircle(827, 163, 44);
  for (let i = 0; i < 19; i++)
    tree(g, i * 75 - 25, 360 + (i % 3) * 17, 0.7 + (i % 4) * 0.13, 1);
  g.fillStyle(0x315b42).fillRect(0, 400, 1200, 360);
  g.fillStyle(0x426b47).fillEllipse(680, 620, 1160, 450);
  // Meandering river with stepped banks and glints.
  for (let y = 425; y < 760; y += 12) {
    const x = 660 + Math.sin(y / 82) * 65;
    g.fillStyle(0x203f38).fillRect(x - 22, y, 167 + (y - 425) / 3, 12);
    g.fillStyle(0x397c78).fillRect(x, y, 120 + (y - 425) / 3, 12);
    if (y % 36 === 5)
      g.fillStyle(0x79b5a3, 0.55).fillRect(x + 18, y + 4, 70, 3);
  }
  g.fillStyle(0x7f8251).fillEllipse(435, 642, 380, 215);
  g.fillStyle(0xaaa16b).fillEllipse(436, 620, 350, 180);
  for (let i = 0; i < 90; i++) {
    const x = (i * 137 + 31) % 1200,
      y = 390 + ((i * 67) % 360);
    g.fillStyle(i % 3 ? 0x87a36a : 0xc4c27b, 0.55).fillRect(x, y, 4, 3);
    g.fillStyle(0x244d38).fillRect(x + 4, y - 3, 2, 7);
  }
  // Wooden bridge.
  for (let i = 0; i < 10; i++) {
    g.fillStyle(i % 2 ? 0xb59a65 : 0x9c8359).fillRect(
      658 + i * 17,
      570,
      15,
      61,
    );
    g.fillStyle(0x665c44).fillRect(658 + i * 17, 628, 15, 7);
  }
  [
    [80, 520, 1.8],
    [190, 440, 1.1],
    [1100, 480, 1.6],
    [980, 410, 1.1],
    [-10, 730, 2.2],
    [1170, 770, 2.4],
    [220, 790, 1.4],
  ].forEach(([x, y, s]) => tree(g, x, y, s));
  // Ruins, mushrooms and tiny warm lights.
  for (let i = 0; i < 3; i++) {
    g.fillStyle(0x718979).fillRect(
      895 + i * 32,
      414 - (i % 2) * 45,
      25,
      87 + (i % 2) * 45,
    );
    g.fillStyle(0xa2ae8c).fillRect(892 + i * 32, 408 - (i % 2) * 45, 31, 9);
  }
  [
    [280, 580],
    [960, 640],
    [185, 653],
    [1040, 565],
  ].forEach(([x, y]) => {
    g.fillStyle(0xe5d29b).fillRect(x + 5, y, 6, 15);
    g.fillStyle(0xc47a50).fillRect(x - 1, y - 6, 19, 8);
    g.fillStyle(0xf0c788).fillRect(x + 3, y - 6, 4, 3);
  });
  if (!reduced)
    for (let i = 0; i < 16; i++) {
      const light = scene.add.rectangle(
        230 + ((i * 113) % 800),
        240 + ((i * 73) % 370),
        3,
        3,
        0xffe7a0,
        0.6,
      );
      scene.tweens.add({
        targets: light,
        y: light.y - 24,
        alpha: 0.12,
        duration: 1800 + i * 120,
        yoyo: true,
        repeat: -1,
        delay: i * 170,
      });
    }
}
