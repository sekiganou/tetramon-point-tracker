import { useState } from "react";
import "./App.css";
import useGameStore from "./store/gameStore";
import usePlayerStore from "./store/playerStore";
import { ElementEnum, type ElementTypes } from "./store/interfaces/element";
import type { Element } from "./store/interfaces/element";
import type Player from "./store/interfaces/player";

const ELEMENT_LABELS: Record<ElementTypes, string> = {
  wind: "Wind",
  fire: "Fire",
  water: "Water",
  earth: "Earth",
};

type PointKind = "added" | "card";

const elementTotal = (score: Element) =>
  score.basePoints + score.addedPoints + score.cardPoints;

function App() {
  const startNewGame = useGameStore((state) => state.startNewGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const nextRound = useGameStore((state) => state.nextRound);
  const playerIds = useGameStore((state) => state.playerIds);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const rounds = useGameStore((state) => state.rounds);
  const winnerId = useGameStore((state) => state.winnerId);
  const playerMap = usePlayerStore((state) => state.playerMap);
  const updateElementBasePoints = usePlayerStore(
    (state) => state.updateElementBasePoints,
  );
  const addElementAddedPoints = usePlayerStore(
    (state) => state.addElementAddedPoints,
  );
  const addElementCardPoints = usePlayerStore(
    (state) => state.addElementCardPoints,
  );
  const resetPlayerAddedPoints = usePlayerStore(
    (state) => state.resetPlayerAddedPoints,
  );
  const resetPlayerCardPoints = usePlayerStore(
    (state) => state.resetPlayerCardPoints,
  );
  const [currentElement, setCurrentElement] = useState<ElementTypes>(
    ElementEnum.Fire,
  );

  const players = playerIds
    .map((id) => playerMap[id])
    .filter((player): player is Player => Boolean(player));
  const activePlayer = players[currentPlayerIndex];
  const gameStarted = players.length > 0;
  const gameOver = Boolean(winnerId);
  const elements = Object.values(ElementEnum) as ElementTypes[];

  const totalDamage = activePlayer
    ? elements.reduce(
        (sum, element) => sum + elementTotal(activePlayer[`${element}Element`]),
        0,
      )
    : 0;

  const updateBasePoints = (
    playerId: string,
    type: ElementTypes,
    value: string,
  ) => {
    const parsedValue = value === "" ? 0 : Number(value);
    if (Number.isFinite(parsedValue) && parsedValue >= 0) {
      updateElementBasePoints(playerId, type, Math.floor(parsedValue));
    }
  };

  const addPoints = (kind: PointKind, amount: number) => {
    if (!activePlayer || gameOver) return;
    if (kind === "added") {
      addElementAddedPoints(activePlayer.id, currentElement, amount);
    } else {
      addElementCardPoints(activePlayer.id, currentElement, amount);
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">TETRAMON // SCOREKEEPER</p>
          <h1>Point Tracker</h1>
        </div>
        <span className="status-light" aria-label="Ready to play" />
      </header>

      {!gameStarted ? (
        <section className="welcome nes-container">
          <p className="eyebrow">READY PLAYER ONE?</p>
          <h2>Start a new match</h2>
          <button
            className="nes-btn is-primary start-button"
            onClick={() => startNewGame(["Player 1", "Player 2"])}
          >
            Start Game
          </button>
        </section>
      ) : (
        <>
          {gameOver && (
            <section
              className={`turn-banner ${gameOver ? "is-finished" : ""}`}
              aria-live="polite"
            >
              <div>
                <p className="eyebrow">MATCH COMPLETE</p>
                <h2>{`${playerMap[winnerId!]?.name} wins!`}</h2>
              </div>
            </section>
          )}

          <section className="quick-add nes-container" aria-label="Add points">
            <div className="section-heading">
              <div>
                <p className="eyebrow">POWER UP</p>
                <h2>Add to {activePlayer?.name}</h2>
              </div>
            </div>
            <div
              className="element-selector"
              role="group"
              aria-label="Select current element"
            >
              {elements.map((element) => (
                <button
                  className={`element-tab element-${element} ${currentElement === element ? "is-selected" : ""}`}
                  key={element}
                  onClick={() => setCurrentElement(element)}
                  aria-pressed={currentElement === element}
                >
                  {ELEMENT_LABELS[element]}
                </button>
              ))}
            </div>

            <div className="quick-group quick-group-added">
              <div className="quick-group-head">
                <p className="quick-group-label">Added points</p>
                <button
                  className="reset-chip"
                  onClick={() =>
                    activePlayer && resetPlayerAddedPoints(activePlayer.id)
                  }
                >
                  Reset
                </button>
              </div>
              <div className="quick-buttons">
                {[1, 5, 10].map((amount) => (
                  <button
                    className="nes-btn is-success"
                    key={`added-${amount}`}
                    onClick={() => addPoints("added", amount)}
                    disabled={gameOver}
                  >
                    +{amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="quick-group quick-group-card">
              <div className="quick-group-head">
                <p className="quick-group-label">Card points</p>
                <button
                  className="reset-chip"
                  onClick={() =>
                    activePlayer && resetPlayerCardPoints(activePlayer.id)
                  }
                >
                  Reset
                </button>
              </div>
              <div className="quick-buttons">
                {[1, 5, 10].map((amount) => (
                  <button
                    className="nes-btn is-card"
                    key={`card-${amount}`}
                    onClick={() => addPoints("card", amount)}
                    disabled={gameOver}
                  >
                    +{amount}
                  </button>
                ))}
              </div>
            </div>

            <p className="quick-hint">
              Adding to {ELEMENT_LABELS[currentElement]} points
            </p>
          </section>

          <section className="players-grid" aria-label="Players">
            {players.map((player) => {
              const isActive = player.id === activePlayer?.id;
              return (
                <article
                  className={`player-panel nes-container ${isActive ? "is-active" : ""}`}
                  key={player.id}
                >
                  <div className="player-heading">
                    <div>
                      <p className="eyebrow">
                        {isActive ? "YOUR TURN" : "WAITING"}
                      </p>
                      <h2>{player.name}</h2>
                      {isActive && !gameOver && (
                        <p className="player-damage">
                          <strong>{totalDamage}</strong> dmg this turn
                        </p>
                      )}
                    </div>
                    <strong className="player-score">{player.points}</strong>
                  </div>{" "}
                  <div className="element-grid">
                    {elements.map((element) => {
                      const score = player[`${element}Element`];
                      return (
                        <div
                          className={`element-input element-${element}`}
                          key={element}
                        >
                          <div className="element-input-head">
                            <span>{ELEMENT_LABELS[element]}</span>
                            <span className="element-total">
                              {elementTotal(score)}
                            </span>
                          </div>
                          <label className="element-base-label">
                            <span className="sr-only">
                              {player.name} {ELEMENT_LABELS[element]} base
                              points
                            </span>
                            <input
                              className="nes-input"
                              type="number"
                              min="0"
                              step="1"
                              inputMode="numeric"
                              value={score.basePoints}
                              onChange={(event) =>
                                updateBasePoints(
                                  player.id,
                                  element,
                                  event.target.value,
                                )
                              }
                              aria-label={`${player.name} ${ELEMENT_LABELS[element]} base points`}
                            />
                          </label>
                          <div className="element-stats-row">
                            <span className="stat-pill stat-added">
                              +{score.addedPoints} added
                            </span>
                            <span className="stat-pill stat-card">
                              +{score.cardPoints} card
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </section>

          <div className="action-row">
            <button
              className="nes-btn is-primary next-button"
              onClick={nextRound}
              disabled={gameOver}
            >
              Next Round
            </button>
            <button className="nes-btn restart-button" onClick={resetGame}>
              New Game
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default App;
