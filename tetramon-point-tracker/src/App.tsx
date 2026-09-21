import { useState } from 'react'
import './App.css'
import useGameStore from './store/gameStore'
import usePlayerStore from './store/playerStore'
import { ElementEnum, type ElementType } from './store/interfaces/element'
import type Player from './store/interfaces/player'

const ELEMENT_LABELS: Record<ElementType, string> = {
  wind: 'Wind',
  fire: 'Fire',
  water: 'Water',
  earth: 'Earth',
}

function App() {
  const startNewGame = useGameStore((state) => state.startNewGame)
  const resetGame = useGameStore((state) => state.resetGame)
  const nextRound = useGameStore((state) => state.nextRound)
  const playerIds = useGameStore((state) => state.playerIds)
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex)
  const rounds = useGameStore((state) => state.rounds)
  const winnerId = useGameStore((state) => state.winnerId)
  const playerMap = usePlayerStore((state) => state.playerMap)
  const resetAddedPoints = usePlayerStore((state) => state.resetAddedPoints)
  const updateElementBasePoints = usePlayerStore((state) => state.updateElementBasePoints)
  const updateElementAddedPoints = usePlayerStore((state) => state.updateElementAddedPoints)
  const [currentElement, setCurrentElement] = useState<ElementType>(ElementEnum.Wind)

  const players = playerIds.map((id) => playerMap[id]).filter((player): player is Player => Boolean(player))
  const activePlayer = players[currentPlayerIndex]
  const gameStarted = players.length > 0
  const gameOver = Boolean(winnerId)
  const elements = Object.values(ElementEnum) as ElementType[]

  const updateBasePoints = (playerId: string, type: ElementType, value: string) => {
    const parsedValue = value === '' ? 0 : Number(value)
    if (Number.isFinite(parsedValue) && parsedValue >= 0) {
      updateElementBasePoints(playerId, type, Math.floor(parsedValue))
    }
  }

  const addPoints = (amount: number) => {
    if (!activePlayer || gameOver) return
    updateElementAddedPoints(activePlayer.id, currentElement, amount)
  }

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
          <p className="muted">Track elemental points, one turn at a time.</p>
          <button className="nes-btn is-primary start-button" onClick={() => startNewGame(['Alice', 'Bob'])}>Start Game</button>
        </section>
      ) : (
        <>
          <section className={`turn-banner ${gameOver ? 'is-finished' : ''}`} aria-live="polite">
            <div>
              <p className="eyebrow">{gameOver ? 'MATCH COMPLETE' : 'CURRENT TURN'}</p>
              <h2>{gameOver ? `${playerMap[winnerId!]?.name} wins!` : `${activePlayer?.name}'s move`}</h2>
            </div>
            <span className="turn-counter">ROUND {rounds.length + 1}</span>
          </section>

          <section className="quick-add nes-container" aria-label="Add points">
            <div className="section-heading">
              <div>
                <p className="eyebrow">POWER UP</p>
                <h2>Add to {activePlayer?.name}</h2>
              </div>
              <span className="selected-element">{ELEMENT_LABELS[currentElement]}</span>
            </div>
            <div className="element-selector" role="group" aria-label="Select current element">
              {elements.map((element) => (
                <button
                  className={`element-tab element-${element} ${currentElement === element ? 'is-selected' : ''}`}
                  key={element}
                  onClick={() => setCurrentElement(element)}
                  aria-pressed={currentElement === element}
                >
                  {ELEMENT_LABELS[element]}
                </button>
              ))}
            </div>
            <div className="quick-buttons">
              {[1, 5, 10].map((amount) => (
                <button className="nes-btn is-success" key={amount} onClick={() => addPoints(amount)} disabled={gameOver}>+{amount}</button>
              ))}
            </div>
            <div className="quick-footer">
              <p className="quick-hint">Adding to {ELEMENT_LABELS[currentElement]} points</p>
              <button className="reset-added-button" onClick={resetAddedPoints}>Reset Added</button>
            </div>
          </section>

          <section className="players-grid" aria-label="Players">
            {players.map((player) => {
              const isActive = player.id === activePlayer?.id
              return (
                <article className={`player-panel nes-container ${isActive ? 'is-active' : ''}`} key={player.id}>
                  <div className="player-heading">
                    <div>
                      <p className="eyebrow">{isActive ? 'YOUR TURN' : 'WAITING'}</p>
                      <h2>{player.name}</h2>
                    </div>
                    <strong className="player-score">{player.points}</strong>
                  </div>
                  <div className="element-grid">
                    {elements.map((element) => {
                      const score = player[`${element}Element`]
                      return (
                        <label className={`element-input element-${element}`} key={element}>
                          <span>{ELEMENT_LABELS[element]}</span>
                          <input
                            className="nes-input"
                            type="number"
                            min="0"
                            step="1"
                            inputMode="numeric"
                            value={score.basePoints}
                            onChange={(event) => updateBasePoints(player.id, element, event.target.value)}
                            aria-label={`${player.name} ${ELEMENT_LABELS[element]} base points`}
                          />
                          <small>+{score.addedPoints} added</small>
                        </label>
                      )
                    })}
                  </div>
                </article>
              )
            })}
          </section>

          <div className="action-row">
            <button className="nes-btn is-primary next-button" onClick={nextRound} disabled={gameOver}>Next Round</button>
            <button className="nes-btn restart-button" onClick={resetGame}>New Game</button>
          </div>
        </>
      )}
      <footer className="app-footer">OFFLINE READY <span aria-hidden="true">*</span> SAVE YOUR SCORE ANYWHERE</footer>
    </main>
  )
}

export default App