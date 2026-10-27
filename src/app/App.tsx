import { useEffect, useRef, useState } from "react";
import { WorldCanvas } from "../components/WorldCanvas";
import { Icon } from "../components/Icon";
import { levels } from "../games/hero/levels";
import { execute, initialState } from "../games/hero/rules";
import type { Command, State } from "../games/hero/types";
import type { AdventureScene } from "../engine/AdventureScene";
import { narrate, setSound, sound, stopNarration } from "../audio/audio";
import { TempleGame } from "../games/temple/TempleGame";
const labels: Record<Command, string> = {
  up: "Para frente",
  down: "Para trás",
  left: "Esquerda",
  right: "Direita",
};
const directionNames = ["frente", "direita", "trás", "esquerda"];
type Page = "home" | "map" | "game" | "temple";
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [viewId, setViewId] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [celebratedStars, setCelebratedStars] = useState<number[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [active, setActive] = useState(-1);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<State>(initialState(levels[0]));
  const [message, setMessage] = useState("");
  const [hints, setHints] = useState(0);
  const [help, setHelp] = useState(false);
  const [audio, setAudio] = useState(false);
  const [voiceError, setVoiceError] = useState(false);
  const [templeIndex, setTempleIndex] = useState(0);
  const [templeCompleted, setTempleCompleted] = useState<number[]>([]);
  const [templeSupportMode, setTempleSupportMode] = useState(false);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const scene = useRef<AdventureScene | null>(null);
  const runId = useRef(0);
  const helpDialog = useRef<HTMLDialogElement>(null);
  const level = levels[levelIndex];
  useEffect(
    () => () => {
      runId.current++;
      setSound(false);
      stopNarration();
    },
    [],
  );
  useEffect(() => {
    if (help) helpDialog.current?.showModal();
    else helpDialog.current?.close();
  }, [help]);
  useEffect(() => {
    const syncFullscreen = () => setNativeFullscreen(!!document.fullscreenElement);
    const leaveFallbackFullscreen = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFocusMode(false);
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    window.addEventListener("keydown", leaveFallbackFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
      window.removeEventListener("keydown", leaveFallbackFullscreen);
    };
  }, []);
  useEffect(() => {
    if (page !== "game" || help) return;
    const directions: Record<string, Command> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };
    const addByKeyboard = (event: KeyboardEvent) => {
      const command = directions[event.key];
      if (!command || running || state.won || commands.length >= level.maxCommands) return;
      event.preventDefault();
      edit([...commands, command]);
      setSelected(null);
    };
    window.addEventListener("keydown", addByKeyboard);
    return () => window.removeEventListener("keydown", addByKeyboard);
  }, [page, help, running, state.won, commands, level.maxCommands]);
  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
      return;
    }
    if (document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen();
        setFocusMode(false);
        return;
      } catch {
        // Keep a viewport-filling fallback for browsers that reject fullscreen.
      }
    }
    setFocusMode((active) => !active);
  }
  function go(next: Page, index = levelIndex) {
    runId.current++;
    setViewId((n) => n + 1);
    setRunning(false);
    setActive(-1);
    setCommands([]);
    setCelebratedStars([]);
    setSelected(null);
    setMessage("");
    setHints(0);
    setLevelIndex(index);
    setState(initialState(levels[index]));
    setReady(false);
    scene.current = null;
    setPage(next);
    stopNarration();
    sound();
  }
  function reset() {
    runId.current++;
    setRunning(false);
    setActive(-1);
    setCommands([]);
    setCelebratedStars([]);
    setSelected(null);
    setState(initialState(level));
    setMessage("Um novo começo. Vamos tentar?");
    scene.current?.reset();
    stopNarration();
  }
  async function run() {
    if (running || !commands.length || !scene.current) return;
    const id = ++runId.current;
    setRunning(true);
    setCelebratedStars([]);
    setSelected(null);
    setMessage("Observe Nilo seguir seus comandos.");
    setState(initialState(level));
    scene.current.reset();
    const steps = execute(level, commands);
    for (let i = 0; i < steps.length; i++) {
      if (id !== runId.current) return;
      setActive(i);
      await scene.current.animate(steps[i]);
      if (id !== runId.current) return;
      setState(steps[i].state);
      if (steps[i].event === "key") sound("key");
    }
    const last = steps.at(-1)!;
    setRunning(false);
    setActive(-1);
    if (last.event === "win") {
      setCompleted((old) =>
        old.includes(level.id) ? old : [...old, level.id],
      );
      setMessage("Você encontrou o tesouro!");
      sound("win");
    } else if (last.event === "blocked")
      setMessage("Uma pedra no caminho! Que tal mudar um comando?");
    else if (last.event === "locked")
      setMessage("A chave vem primeiro. Vamos procurá-la?");
    else setMessage("Quase lá! Você pode acrescentar ou mudar comandos.");
  }
  function edit(next: Command[]) {
    setCommands(next);
    if (state.won) {
      setState(initialState(level));
      scene.current?.reset();
    }
    setMessage("");
    sound();
  }
  function moveSelected(offset: number) {
    if (selected === null) return;
    const target = selected + offset;
    if (target < 0 || target >= commands.length) return;
    const next = [...commands];
    [next[selected], next[target]] = [next[target], next[selected]];
    edit(next);
    setSelected(target);
  }
  function hear() {
    setVoiceError(false);
    narrate(
      page === "game"
        ? level.instruction
        : "Escolha seus comandos. Execute. Observe e tente de novo. Cada descoberta é uma aventura.",
      () => setVoiceError(true),
    );
  }
  return (
    <div className={`app page-${page} ${focusMode ? "focus-mode" : ""}`}>
      <header className="topbar flex items-center justify-between">
        <button
          className="brand"
          onClick={() => go("home")}
          aria-label="PixelQuest — início"
        >
          <span className="brand-mark">
            <Icon name="leaf" size={23} />
          </span>
          <span>
            PIXEL<span className="gold">QUEST</span>
          </span>
        </button>
        <div className="flex items-center gap-2">
          {(page === "game" || page === "temple") && (
            <button
              className="icon-button fullscreen-button"
              aria-label={nativeFullscreen || focusMode ? "Sair da tela cheia" : "Ativar tela cheia"}
              aria-pressed={nativeFullscreen || focusMode}
              onClick={() => void toggleFullscreen()}
            >
              <Icon name={nativeFullscreen || focusMode ? "compress" : "expand"} size={20} />
            </button>
          )}
          <span className="header-caption">
            PEQUENOS PASSOS. GRANDES DESCOBERTAS.
          </span>
          <button
            className="icon-button"
            aria-label={
              audio ? "Desativar música e efeitos" : "Ativar música e efeitos"
            }
            aria-pressed={audio}
            onClick={() => {
              setAudio(!audio);
              setSound(!audio);
            }}
          >
            <Icon name={audio ? "sound" : "mute"} />
          </button>
          <button
            className="icon-button"
            aria-label="Como jogar"
            onClick={() => setHelp(true)}
          >
            <Icon name="help" />
          </button>
        </div>
      </header>
      <main>
        {page === "home" && (
          <section
            className="home-stage"
            aria-label="Boas-vindas ao PixelQuest"
          >
            <WorldCanvas mode="home" />
            <div className="home-shade" />
            <div className="hero-copy">
              <span className="eyebrow">
                <span className="little-square" /> SUA PRÓXIMA DESCOBERTA COMEÇA
                AQUI
              </span>
              <h1>
                Pequeno herói.
                <br />
                Grandes <span>aventuras.</span>
              </h1>
              <p className="slogan">Aventuras para Aprender</p>
              <p className="hero-description">
                Uma floresta de mistérios.
                <br />
                Um caminho cheio de ideias.
                <br />E você no comando.
              </p>
              <button className="primary jumbo" onClick={() => go("map")}>
                <Icon name="play" /> JOGAR{" "}
                <span className="button-arrow">→</span>
              </button>
              <button className="text-button" onClick={() => setHelp(true)}>
                <Icon name="help" size={17} /> Como jogar
              </button>
            </div>
            <div className="hero-name">
              <span className="little-square" /> NILO, SEU COMPANHEIRO DE
              AVENTURA
            </div>
            <div className="home-bottom">
              <span>
                <Icon name="leaf" size={16} /> Aprenda explorando
              </span>
              <span>
                <Icon name="star" size={16} /> Cada tentativa é uma descoberta
              </span>
              <span>NO SEU RITMO.</span>
            </div>
          </section>
        )}
        {page === "map" && (
          <section className="map-stage">
            <WorldCanvas mode="map" />
            <div className="map-heading">
              <span className="eyebrow">O MUNDO ESTÁ ESPERANDO</span>
              <h1>Escolha sua aventura</h1>
              <p>Um passo de cada vez. Uma descoberta a cada caminho.</p>
            </div>
            <div className="world-node forest-node">
              <span className="world-number">01</span>
              <div>
                <span className="eyebrow">FLORESTA DOS COMEÇOS</span>
                <h2>
                  A Jornada
                  <br />
                  do Herói
                </h2>
                <p>Planeje. Explore. Descubra.</p>
                <button className="primary" onClick={() => go("game", 0)}>
                  <Icon name="play" size={18} /> Entrar na floresta
                </button>
                <small>{completed.length} de 3 tesouros encontrados</small>
              </div>
            </div>
            <div className="world-node temple-node">
              <span className="world-number">02</span>
              <div>
                <span className="coming">SONS E PALAVRAS</span>
                <h2>
                  O Templo
                  <br />
                  das Palavras
                </h2>
                <p>Escute, descubra e abra os selos antigos.</p>
                <button className="primary" onClick={() => go("temple")}>
                  <Icon name="play" size={18} /> Entrar no templo
                </button>
                <small>{templeCompleted.length} de 5 selos encontrados</small>
              </div>
            </div>
            <button className="back-map secondary" onClick={() => go("home")}>
              <Icon name="left" size={18} /> Voltar ao início
            </button>
          </section>
        )}
        {page === "game" && (
          <section className="game-page">
            <div className="adventure-heading">
              <button
                className="round-back"
                aria-label="Voltar ao mapa"
                onClick={() => go("map")}
              >
                <Icon name="map" />
              </button>
              <div>
                <span className="eyebrow">A JORNADA DO HERÓI</span>
                <h1>{level.name}</h1>
              </div>
              <nav className="level-nav" aria-label="Fases">
                {levels.map((l, i) => (
                  <button
                    key={l.id}
                    className={i === levelIndex ? "current" : ""}
                    disabled={i > 0 && !completed.includes(i)}
                    aria-label={`Fase ${l.id}: ${l.name}`}
                    aria-current={i === levelIndex ? "step" : undefined}
                    onClick={() => go("game", i)}
                  >
                    {completed.includes(l.id) ? (
                      <Icon name="check" size={15} />
                    ) : (
                      l.id
                    )}
                  </button>
                ))}
              </nav>
            </div>
            <div className="game-layout">
              <div className="play-column">
                <div className="board-wrap">
                  <WorldCanvas
                    key={`${level.id}-${viewId}`}
                    mode="game"
                    level={level}
                    onReady={(s) => {
                      scene.current = s;
                      setReady(true);
                    }}
                  />
                  <div className="board-label">
                    <span className="little-square" /> FLORESTA DOS COMEÇOS{" "}
                    <span>0{level.id} / 03</span>
                  </div>
                  <div className="board-status">
                    <span>
                      <Icon name="leaf" size={16} /> Nilo olha para{" "}
                      {directionNames[state.direction]}
                    </span>
                    {level.key && (
                      <span className={state.hasKey ? "has-key" : ""}>
                        <Icon name="key" size={17} />
                        {state.hasKey ? "Chave encontrada" : "Encontre a chave"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="objective">
                  <span className="objective-icon">
                    <Icon name="star" size={25} />
                  </span>
                  <div>
                    <span className="eyebrow">SUA MISSÃO</span>
                    <p>{level.instruction}</p>
                  </div>
                  <button
                    className="hear"
                    onClick={hear}
                    aria-label="Ouvir instrução"
                  >
                    <Icon name="sound" />
                    <span>Ouvir</span>
                  </button>
                </div>
                <details className="map-description">
                  <summary>Descrição do caminho</summary>
                  <p>
                    {level.id === 1
                      ? "Siga o caminho: duas casas à direita e duas para baixo. Cada seta move Nilo uma casa."
                      : level.id === 2
                        ? "Siga duas casas à direita, duas para cima e duas à direita. Fora do caminho há pedras."
                        : "A chave está duas casas acima. Depois, siga à direita até a porta e desça até o baú."}
                  </p>
                </details>
              </div>
              <aside className="command-panel">
                <span className="eyebrow">PLANEJE A ROTA</span>
                <h2>Monte seu caminho</h2>
                <p className="panel-intro">Use as setas do teclado ou toque nas direções.</p>
                <div
                  className="command-buttons"
                >
                  {level.commands.map((command) => (
                    <button
                      key={command}
                      className={`command command-${command}`}
                      disabled={
                        running ||
                        commands.length >= level.maxCommands ||
                        state.won
                      }
                      onClick={() => {
                        edit([...commands, command]);
                        setSelected(null);
                      }}
                      aria-label={`Adicionar ${labels[command]}`}
                    >
                      <Icon name={command} size={28} />
                      <span>
                        {labels[command]}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="sequence-heading">
                  <h3>Rota de Nilo</h3>
                  <span>
                    {commands.length} / {level.maxCommands}
                  </span>
                </div>
                <p className="queue-tip">Setas do teclado ou toque adicionam passos à rota.</p>
                <ol className="sequence" aria-label="Sequência de comandos">
                  {commands.map((command, i) => (
                    <li key={i}>
                      <button
                        disabled={running}
                        className={`${selected === i ? "selected" : ""} ${active === i ? "executing" : ""}`}
                        aria-label={`Passo ${i + 1}: ${labels[command]}`}
                        aria-pressed={selected === i}
                        onClick={() => setSelected(selected === i ? null : i)}
                      >
                        <small>{i + 1}</small>
                        <Icon name={command} size={23} />
                      </button>
                    </li>
                  ))}
                  {!commands.length && (
                    <li className="empty-sequence">
                      <span>1</span>
                      <p>
                        Seu primeiro passo
                        <br />
                        começa nos botões acima.
                      </p>
                    </li>
                  )}
                </ol>
                {selected !== null && !running && (
                  <div className="edit-actions" aria-label="Editar passo">
                    <button
                      disabled={selected === 0}
                      onClick={() => moveSelected(-1)}
                      aria-label="Mover passo para antes"
                    >
                      ← Antes
                    </button>
                    <button
                      onClick={() => {
                        edit(commands.filter((_, i) => i !== selected));
                        setSelected(null);
                      }}
                    >
                      Retirar
                    </button>
                    <button
                      disabled={selected === commands.length - 1}
                      onClick={() => moveSelected(1)}
                      aria-label="Mover passo para depois"
                    >
                      Depois →
                    </button>
                  </div>
                )}
                <button
                  className="primary execute"
                  disabled={!ready || running || !commands.length || state.won}
                  onClick={run}
                >
                  <Icon name="play" size={20} />
                  {running ? "Nilo está explorando…" : "EXECUTAR"}
                </button>
                <div className="support-actions">
                  <button onClick={reset}>
                    <Icon name="reset" size={17} /> Reiniciar
                  </button>
                  <button
                    disabled={running}
                    onClick={() =>
                      setHints((n) => Math.min(n + 1, level.hints.length))
                    }
                  >
                    <Icon name="help" size={17} /> Uma dica
                  </button>
                </div>
                {hints > 0 && (
                  <div className="hint" role="status">
                    <b>Dica {hints} de 3</b>
                    <p>{level.hints[hints - 1]}</p>
                  </div>
                )}
                <div
                  className={`feedback ${state.won ? "success" : ""}`}
                  role="status"
                  aria-live="polite"
                >
                  {state.won && <Icon name="star" size={28} />}
                  <p>
                    {message || "Pode experimentar. Toda tentativa ensina!"}
                  </p>
                  {state.won && (
                    <>
                      <div className="celebration-copy">
                        <strong>Parabéns, aventureiro!</strong>
                        <span>Nilo chegou ao tesouro. Toque nas estrelas para comemorar!</span>
                      </div>
                      <div className="celebration-stars" role="group" aria-label="Estrelas da comemoração">
                        {[0, 1, 2].map((star) => {
                          const lit = celebratedStars.includes(star);
                          return (
                            <button
                              key={star}
                              className={lit ? "lit" : ""}
                              type="button"
                              aria-label={`Estrela ${star + 1}`}
                              aria-pressed={lit}
                              onClick={() => {
                                if (lit) return;
                                setCelebratedStars((current) => [...current, star]);
                                sound("key");
                              }}
                            >
                              <Icon name="star" size={28} />
                            </button>
                          );
                        })}
                      </div>
                      {celebratedStars.length === 3 && (
                        <p className="celebration-cheer" role="status">
                          Que brilho incrível! Você conseguiu! Nilo comemora com você.
                        </p>
                      )}
                      <button
                        className="primary"
                        onClick={() =>
                          levelIndex < 2 ? go("game", levelIndex + 1) : go("map")
                        }
                      >
                        {levelIndex < 2 ? "Próxima fase" : "Voltar ao mapa"}{" "}
                        <span>→</span>
                      </button>
                    </>
                  )}
                </div>
              </aside>
            </div>
            <footer className="game-footer">
              <span>
                <Icon name="leaf" size={15} /> Sem pressa. Você pode tentar
                quantas vezes quiser.
              </span>
              <span>AVENTURA 01 • FLORESTA</span>
            </footer>
          </section>
        )}
        {page === "temple" && (
          <TempleGame
            index={templeIndex}
            completed={templeCompleted}
            supportMode={templeSupportMode}
            onIndexChange={setTempleIndex}
            onComplete={(id) =>
              setTempleCompleted((old) =>
                old.includes(id) ? old : [...old, id],
              )
            }
            onSupportChange={setTempleSupportMode}
            onExit={() => go("map")}
          />
        )}
      </main>
      {voiceError && (
        <div className="voice-notice" role="status">
          A voz não está disponível neste navegador. Leia a missão ou abra
          “Descrição do caminho”.
          <button
            aria-label="Fechar aviso de voz"
            onClick={() => setVoiceError(false)}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
      <dialog
        ref={helpDialog}
        onCancel={() => setHelp(false)}
        onClose={() => setHelp(false)}
        aria-labelledby="help-title"
      >
        <button
          className="dialog-close icon-button"
          aria-label="Fechar ajuda"
          onClick={() => setHelp(false)}
        >
          <Icon name="close" />
        </button>
        <span className="eyebrow">APRENDER É UMA AVENTURA</span>
        <h2 id="help-title">Você pensa. Nilo explora.</h2>
        <div className="help-steps">
          <div>
            <Icon name="map" size={30} />
            <b>1. Observe</b>
            <p>Encontre o caminho até o baú.</p>
          </div>
          <div>
            <Icon name="right" size={30} />
            <b>2. Planeje</b>
            <p>Use ↑ para frente, ↓ para trás e as setas laterais para os lados.</p>
          </div>
          <div>
            <Icon name="play" size={30} />
            <b>3. Experimente</b>
            <p>Execute e observe. Você pode tentar de novo!</p>
          </div>
        </div>
        <button className="primary" onClick={() => setHelp(false)}>
          Entendi. Vamos lá! <Icon name="check" size={18} />
        </button>
        <button
          className="text-button"
          onClick={() =>
            narrate(
              "Observe o caminho. Use a seta para frente, para trás, para a direita ou para a esquerda. Cada seta move Nilo uma casa. Execute e tente de novo se quiser!",
              () => setVoiceError(true),
            )
          }
        >
          <Icon name="sound" size={18} /> Ouvir explicação
        </button>
      </dialog>
    </div>
  );
}
