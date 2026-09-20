import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import useGameStore from './store/gameStore'
import usePlayerStore from './store/playerStore'
import { ElementEnum } from './store/interfaces/element'

function App() {
  const startNewGame = useGameStore((state) => state.startNewGame);
  const nextRound = useGameStore((state) => state.nextRound);
  const playerMap = usePlayerStore((state) => state.playerMap);
  const updateElementBasePoints = usePlayerStore((state) => state.updateElementBasePoints);
  const updateElementAddedPoints = usePlayerStore((state) => state.updateElementAddedPoints);
  const [gameStarted, setGameStarted] = useState(false);
  const [refresh, setRefresh] = useState(false); // State to trigger re-render

  const forceUpdate = () => setRefresh(!refresh); // Function to toggle the refresh state

  const players = [playerMap[1], playerMap[2]];

  const updateBasePoints = (playerId: number, type: typeof ElementEnum[keyof typeof ElementEnum], value: string) => {
    updateElementBasePoints(playerId, type, value === '' ? 0 : Number(value));
  };

  return (
    <>
      <button onClick={() => {
        startNewGame(['Alice', 'Bob']);
        setGameStarted(true);
      }}>Start New Game</button>
      {gameStarted && (
        <div>
          <button onClick={() => {nextRound(); forceUpdate();}}>Next Round</button>
          {players.map((player, index) => player && (
            <div key={player.id}>
              <h2>{player.name || `Player ${index + 1}`}</h2>
              <p>Points: {player.points}</p>
              {[ElementEnum.Wind, ElementEnum.Fire, ElementEnum.Water, ElementEnum.Earth].map((type) => (
                <div key={type}>
                  <label>{type} Base Points:</label>
                  <input
                    type="number"
                    value={player[`${type}Element`].basePoints}
                    onChange={(event) => updateBasePoints(player.id, type, event.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default App
