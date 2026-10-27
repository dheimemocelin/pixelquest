import { useEffect, useRef, useState } from "react";
import { Icon } from "../../components/Icon";
import { TempleCanvas } from "../../components/TempleCanvas";
import { narrate, sound, stopNarration } from "../../audio/audio";
import { activities } from "./activities";
import { availableTokens, isCorrect, nextSupportMode } from "./rules";
import { TempleGlyph } from "./TempleGlyph";

type Props = {
  index: number;
  completed: number[];
  supportMode: boolean;
  onIndexChange: (index: number) => void;
  onComplete: (id: number) => void;
  onSupportChange: (needsSupport: boolean) => void;
  onExit: () => void;
};

export function TempleGame({
  index,
  completed,
  supportMode,
  onIndexChange,
  onComplete,
  onSupportChange,
  onExit,
}: Props) {
  const activity = activities[index];
  const [answer, setAnswer] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [scaffold, setScaffold] = useState(supportMode);
  const [voiceError, setVoiceError] = useState(false);
  const templeRoot = useRef<HTMLElement>(null);
  const tokens = availableTokens(activity, scaffold);
  const maxUnlocked = Math.max(0, ...completed);

  useEffect(() => {
    setAnswer([]);
    setSolved(false);
    setMessage("");
    setErrors(0);
    setHintsUsed(0);
    setScaffold(supportMode);
    setVoiceError(false);
    stopNarration();
    return () => stopNarration();
  }, [index, supportMode]);

  useEffect(() => {
    const onArrow = (event: KeyboardEvent) => {
      if (navigateAnswers(templeRoot.current, event.key)) event.preventDefault();
    };
    window.addEventListener("keydown", onArrow);
    return () => window.removeEventListener("keydown", onArrow);
  }, []);

  function submit(next: string[]) {
    if (solved) return;
    if (isCorrect(activity, next)) {
      setAnswer(next);
      setSolved(true);
      setMessage("O selo brilhou! Você encontrou a resposta.");
      onComplete(activity.id);
      sound("win");
      return;
    }
    setErrors((count) => count + 1);
    setScaffold(true);
    setAnswer([]);
    setMessage("Vamos olhar mais uma vez. Você pode tentar de novo.");
    sound();
  }

  function addToken(id: string) {
    if (solved || answer.includes(id)) return;
    const next = [...answer, id];
    setAnswer(next);
    if (activity.interaction === "sequence" && next.length === activity.correct.length)
      submit(next);
  }

  function toggleToken(id: string) {
    if (solved) return;
    setAnswer((current) =>
      current.includes(id)
        ? current.filter((token) => token !== id)
        : [...current, id],
    );
  }

  function navigateAnswers(root: HTMLElement | null, key: string) {
    if (!root || !["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(key)) return false;
    const controls = Array.from(
      root.querySelectorAll<HTMLButtonElement>(
        ".temple-choice:not(:disabled), .letter-tile:not(:disabled)",
      ),
    );
    if (!controls.length) return false;
    const current = controls.indexOf(document.activeElement as HTMLButtonElement);
    if (current < 0) {
      controls[0].focus();
      return true;
    }
    const rect = controls[current].getBoundingClientRect();
    const [dx, dy] = {
      ArrowUp: [0, -1],
      ArrowRight: [1, 0],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
    }[key]!;
    const candidates = controls
      .map((button, i) => {
        if (i === current) return { button, i, score: Number.POSITIVE_INFINITY };
        const other = button.getBoundingClientRect();
        const vx = other.x + other.width / 2 - (rect.x + rect.width / 2);
        const vy = other.y + other.height / 2 - (rect.y + rect.height / 2);
        const primary = vx * dx + vy * dy;
        const cross = Math.abs(vx * dy - vy * dx);
        return { button, i, score: primary > 0 ? primary + cross * 2.5 : Number.POSITIVE_INFINITY };
      })
      .sort((a, b) => a.score - b.score);
    (candidates[0].score < Number.POSITIVE_INFINITY
      ? candidates[0].button
      : controls[(current + 1) % controls.length]
    ).focus();
    return true;
  }

  function speak() {
    setVoiceError(false);
    narrate(activity.speech, () => setVoiceError(true));
  }

  function continueGame() {
    onSupportChange(nextSupportMode(errors, hintsUsed));
    if (index < activities.length - 1) onIndexChange(index + 1);
    else onExit();
  }

  return (
    <section ref={templeRoot} className="temple-game" aria-labelledby="temple-title">
      <header className="temple-heading">
        <button className="round-back" aria-label="Voltar ao mapa" onClick={onExit}>
          <Icon name="map" />
        </button>
        <div className="temple-title-wrap">
          <span className="eyebrow">O TEMPLO DAS PALAVRAS</span>
          <h1 id="temple-title">{activity.title}</h1>
        </div>
        <nav className="temple-level-nav" aria-label="Desafios do templo">
          {activities.map((item, i) => (
            <button
              key={item.id}
              className={`${i === index ? "current" : ""} ${completed.includes(item.id) ? "complete" : ""}`}
              disabled={i > maxUnlocked}
              aria-label={`Desafio ${item.id}: ${item.title}`}
              aria-current={i === index ? "step" : undefined}
              onClick={() => onIndexChange(i)}
            >
              {completed.includes(item.id) ? <Icon name="star" size={14} /> : item.id}
            </button>
          ))}
        </nav>
      </header>

      <div className="temple-layout">
        <div className="temple-scene-column">
          <div className="temple-board">
            <TempleCanvas />
            <div className="temple-board-label">
              <span className="little-square" /> SALÃO DOS SÍMBOLOS
              <span>{String(activity.id).padStart(2, "0")} / 05</span>
            </div>
            <div className="temple-board-status">
              <span><Icon name="star" size={15} /> {completed.length} selos encontrados</span>
              <span><Icon name="leaf" size={15} /> No seu ritmo</span>
            </div>
          </div>
          <div className="temple-objective">
            <span className="objective-icon"><Icon name="star" size={24} /></span>
            <div>
              <span className="eyebrow">SUA MISSÃO</span>
              <p>{activity.prompt}</p>
            </div>
            <button className="hear" onClick={speak} aria-label="Ouvir instrução">
              <Icon name="sound" /> <span>Ouvir</span>
            </button>
          </div>
        </div>

        <aside className="temple-challenge">
          <div className="temple-challenge-heading">
            <span className="eyebrow">{activity.skill}</span>
            <span className="temple-seal-count"><Icon name="star" size={15} /> {completed.length} / 5</span>
          </div>
          <p className="temple-keyboard-tip">Setas navegam · Enter escolhe</p>
          {activity.interaction === "multiple" ? (
            <>
              <p className="temple-prompt">Toque nas palavras escolhidas.</p>
              <div className="temple-token-row multiple-choice-grid">
                {tokens.map((token) => (
                  <button
                    key={token.id}
                    className={`temple-choice ${answer.includes(token.id) ? "chosen" : ""}`}
                    aria-pressed={answer.includes(token.id)}
                    onClick={() => toggleToken(token.id)}
                    aria-label={`Escolher ${token.label}`}
                  >
                    {token.glyph && <TempleGlyph token={token} />}
                    <span>{token.label}</span>
                  </button>
                ))}
              </div>
              <button className="temple-check" disabled={!answer.length || solved} onClick={() => submit(answer)}>
                Conferir palavras
              </button>
            </>
          ) : activity.interaction === "letters" ? (
            <>
              {activity.picture && <div className="word-picture"><TempleGlyph token={activity.picture} /><span>O QUE É?</span></div>}
              {activity.letterPattern && (
                <div className="missing-word letter-pattern" aria-label={`Palavra incompleta ${activity.letterPattern}`}>
                  {activity.letterPattern.split("").map((letter, i) => {
                    if (letter !== "_") return <b key={i}>{letter}</b>;
                    const token = activity.tokens.find((item) => item.id === answer[activity.letterPattern!.slice(0, i + 1).split("").filter((part) => part === "_").length - 1]);
                    return <span key={i}>{token?.label ?? "?"}</span>;
                  })}
                </div>
              )}
              <p className="temple-prompt">{activity.prompt}</p>
              {!activity.letterPattern && <div className="letter-slots" aria-label="Letras escolhidas">
                {activity.correct.map((_, i) => {
                  const token = activity.tokens.find((item) => item.id === answer[i]);
                  return <span key={i} className={token ? "filled" : ""}>{token?.label ?? "·"}</span>;
                })}
              </div>}
              <div className="temple-token-row letter-pool">
                {tokens.map((token) => (
                  <button key={token.id} className="letter-tile" disabled={solved || answer.includes(token.id)} onClick={() => addToken(token.id)} aria-label={`Usar letra ${token.label}`}>
                    {token.label}
                  </button>
                ))}
              </div>
              <div className="temple-inline-actions">
                <button className="temple-quiet" disabled={!answer.length || solved} onClick={() => setAnswer(answer.slice(0, -1))}>← Voltar letra</button>
                <button className="temple-check" disabled={answer.length !== activity.correct.length || solved} onClick={() => submit(answer)}>Conferir</button>
              </div>
            </>
          ) : activity.interaction === "sequence" ? (
            <>
              <p className="temple-prompt">Escolha na ordem da instrução.</p>
              <div className="temple-action-slots" aria-label="Passos escolhidos">
                {activity.correct.map((_, i) => {
                  const token = activity.tokens.find((item) => item.id === answer[i]);
                  return <span key={i} className={token ? "filled" : ""}>{token ? <TempleGlyph token={token} /> : i + 1}</span>;
                })}
              </div>
              <div className="temple-token-row temple-actions">
                {tokens.map((token) => (
                  <button key={token.id} className="temple-choice" disabled={solved || answer.length >= activity.correct.length} onClick={() => addToken(token.id)}>
                    <TempleGlyph token={token} /><span>{token.label}</span>
                  </button>
                ))}
              </div>
              {!!answer.length && !solved && <button className="temple-quiet" onClick={() => setAnswer([])}>Começar de novo</button>}
            </>
          ) : (
            <>
              {activity.id === 4 && <div className="sentence-stone">A semente recebeu água e sol.</div>}
              <p className="temple-prompt">Toque na resposta.</p>
              <div className={`temple-token-row choice-grid ${activity.id === 2 ? "letter-choices" : "word-choices"}`}>
                {tokens.map((token) => (
                  <button key={token.id} className="temple-choice" disabled={solved} onClick={() => submit([token.id])} aria-label={`Escolher ${token.label}`}>
                    {token.glyph && <TempleGlyph token={token} />}
                    <span>{token.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {scaffold && !solved && <div className="temple-support" role="status"><Icon name="help" size={18} /> {activity.supportCue}</div>}
          {hintsUsed > 0 && <div className="hint temple-hint" role="status"><b>Dica {hintsUsed} de 3</b><p>{activity.hints[hintsUsed - 1]}</p></div>}
          <div className={`temple-feedback ${solved ? "success" : ""}`} role="status" aria-live="polite">
            <p>{message || "Pode experimentar. Toda tentativa ensina!"}</p>
            {solved && <button className="primary temple-continue" onClick={continueGame}>{index < activities.length - 1 ? "Continuar aventura" : "Concluir aventura"} <span>→</span></button>}
          </div>
          {!solved && <div className="temple-footer-actions">
            <button className="temple-quiet" onClick={speak}><Icon name="sound" size={17} /> Ouvir de novo</button>
            <button className="temple-quiet" onClick={() => {
              setHintsUsed((count) => Math.min(count + 1, activity.hints.length));
              setScaffold(true);
            }} disabled={hintsUsed >= activity.hints.length}><Icon name="help" size={17} /> Uma dica</button>
          </div>}
        </aside>
      </div>
      <footer className="temple-footer"><span>Sem pressa. Você pode tentar quantas vezes quiser.</span><span>TEMPLO 02 • SALÃO DOS SÍMBOLOS</span></footer>
      {voiceError && <div className="voice-notice" role="status">A voz não está disponível neste navegador. Leia a instrução na tela.<button aria-label="Fechar aviso de voz" onClick={() => setVoiceError(false)}><Icon name="close" size={16} /></button></div>}
    </section>
  );
}
