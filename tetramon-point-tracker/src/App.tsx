import { useState } from 'react'
import './App.css'
import useGameStore from './store/gameStore'
import usePlayerStore from './store/playerStore'
import type { PlayerId } from './store/interfaces/player'
import { ElementEnum, type ElementType } from './store/interfaces/element'
import type Player from './store/interfaces/player'

function App() {
  const startNewGame = useGameStore((state) => state.startNewGame);
  const nextRound = useGameStore((state) => state.nextRound);
  const playerMap = usePlayerStore((state) => state.playerMap);
  const playerIds = useGameStore((state) => state.playerIds);
  const updateElementBasePoints = usePlayerStore((state) => state.updateElementBasePoints);
  const updateElementAddedPoints = usePlayerStore((state) => state.updateElementAddedPoints);
  const winnerId = useGameStore((state) => state.winnerId);
  const [gameStarted, setGameStarted] = useState(false);
  const [refresh, setRefresh] = useState(false); // State to trigger re-render
  const elements = Object.values(ElementEnum) as ElementType[]; // Get the element types from the enum
  const players = playerIds.map((id) => playerMap[id]).filter((player): player is Player => Boolean(player));

  const forceUpdate = () => setRefresh(!refresh); // Function to toggle the refresh state

  const updateBasePoints = (playerId: PlayerId, type: ElementType, value: string) => {
    updateElementBasePoints(playerId, type, value === '' ? 0 : Number(value));
  };

  console.log('Player Map:', playerMap);
  console.log('Player IDs:', playerIds);
  console.log('Players:', players);
  console.log('Rounds:', useGameStore((state) => state.rounds));

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
              {winnerId === player.id && <p>Winner!</p>}
              {elements.map((type) => (
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
