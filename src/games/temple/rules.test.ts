import { describe, expect, it } from "vitest";
import { activities } from "./activities";
import { availableTokens, isCorrect, nextSupportMode } from "./rules";

describe("Temple activities", () => {
  it.each(activities.map((activity) => ({ activity }))) (
    "accepts the intended solution for stage $activity.id",
    ({ activity }) => {
      expect(isCorrect(activity, activity.correct)).toBe(true);
    },
  );

  it("does not accept a wrong choice or partial sequence", () => {
    expect(isCorrect(activities[0], ["sapo"])).toBe(false);
    expect(isCorrect(activities[4], ["key"])).toBe(false);
    expect(isCorrect(activities[4], ["door", "key"])).toBe(false);
  });

  it("accepts a word only when its letters are in the intended order", () => {
    const word = activities[2];
    expect(isCorrect(word, ["b", "o", "l", "a"])).toBe(true);
    expect(isCorrect(word, ["b", "a", "l", "o"])).toBe(false);
  });

  it("offers fewer choices when the player needs extra support", () => {
    expect(availableTokens(activities[0], true).map((token) => token.id)).toEqual([
      "bola",
      "sapo",
    ]);
    expect(availableTokens(activities[2], true)).toHaveLength(4);
  });

  it("keeps the next activity at standard support after independent play", () => {
    expect(nextSupportMode(0, 0)).toBe(false);
    expect(nextSupportMode(1, 0)).toBe(true);
    expect(nextSupportMode(0, 1)).toBe(true);
  });
});
