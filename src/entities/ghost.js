export function generateGhostComponents(k, pos) {
  return [
    k.sprite("assets", { anim: "ghost-down" }),
    k.area({ shape: new k.Rect(k.vec2(2, 4), 12, 12) }),
    k.body(),
    k.pos(pos),
    k.health(9),
    k.opacity(),
    k.state("idle", [
      "idle",
      "right",
      "left",
      "spawn-down",
      "spawn-up",
      "attack",
    ]),
    {
      attackPower: 0.5,
    },
    "ghost",
  ];
}

export function setGhostAI(k, ghost, player) {
  const updateRef = k.onUpdate(() => {
    if (player.pos.dist(ghost.pos) < 30) {
      ghost.enterState("spawn-up");
      updateRef.cancel();
      return;
    }
  });

  ghost.onStateEnter("spawn-up", async () => {
    await k.tween(
      ghost.pos.y,
      ghost.pos.y - 40,
      0.2,
      (val) => (ghost.pos.y = val),
      k.easings.linear
    );

    ghost.enterState("right");
  });

  ghost.onStateEnter("right", async () => {
    await k.tween(
      ghost.pos.x,
      ghost.pos.x + 50,
      1,
      (val) => (ghost.pos.x = val),
      k.easings.linear
    );

    ghost.enterState("attack");
  });

  ghost.onStateEnter("attack", async () => {
    const attackSpeeds = [0.5, 0.8, 1];

    await k.tween(
      ghost.pos,
      player.pos,
      attackSpeeds[Math.floor(Math.random() * attackSpeeds.length)],
      (val) => (ghost.pos = val),
      k.easings.linear
    );

    ghost.enterState("attack");
  });
}
