let context: AudioContext | undefined;
let music: ReturnType<typeof setInterval> | undefined;
let enabled = false;
function tone(frequency: number, duration = 0.12, volume = 0.025) {
  try {
    context ??= new AudioContext();
    void context.resume().catch(() => {});
    const o = context.createOscillator(),
      g = context.createGain();
    o.type = "triangle";
    o.frequency.value = frequency;
    g.gain.setValueAtTime(volume, context.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    o.connect(g).connect(context.destination);
    o.start();
    o.stop(context.currentTime + duration);
  } catch {
    /* Visual feedback is always available. */
  }
}
export function sound(kind: "tap" | "win" | "key" = "tap") {
  if (!enabled) return;
  tone(
    kind === "win" ? 659 : kind === "key" ? 880 : 392,
    kind === "win" ? 0.6 : 0.12,
  );
}
export function setSound(value: boolean) {
  enabled = value;
  if (music) clearInterval(music);
  music = undefined;
  if (value) {
    let i = 0;
    const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
    tone(notes[0], 0.7, 0.012);
    music = setInterval(() => {
      if (!document.hidden) tone(notes[i++ % notes.length], 0.8, 0.012);
    }, 900);
  } else void context?.suspend().catch(() => {});
}
export function narrate(text: string, onError: () => void) {
  if (!("speechSynthesis" in window)) {
    onError();
    return;
  }
  const voices = window.speechSynthesis.getVoices();
  const portuguese =
    voices.find((v) => v.lang.toLowerCase() === "pt-br") ??
    voices.find((v) => v.lang.startsWith("pt"));
  if (voices.length && !portuguese) {
    onError();
    return;
  }
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "pt-BR";
  speech.rate = 0.85;
  if (portuguese) speech.voice = portuguese;
  speech.onerror = () => onError();
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}
export function stopNarration() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}
