export type Interaction = "choice" | "multiple" | "letters" | "sequence";

export type Token = {
  id: string;
  label: string;
  glyph?: "ball" | "frog" | "moon" | "cat" | "run" | "jump" | "key" | "door" | "star" | "sun" | "sprout" | "rock" | "house";
};

export type Activity = {
  id: number;
  title: string;
  skill: string;
  prompt: string;
  speech: string;
  interaction: Interaction;
  letterPattern?: string;
  picture?: Token;
  tokens: Token[];
  correct: string[];
  supportTokens?: string[];
  supportCue: string;
  hints: string[];
};
