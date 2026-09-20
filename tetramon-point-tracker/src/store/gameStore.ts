import { create } from 'zustand';
import usePlayerStore from './playerStore';
import type Round from './interfaces/round';

interface GameStore {
    rounds: Round[];
    currentRoundIndex: number;
    currentPlayerId: number;
    startNewGame: (playerNames: string[]) => void;
    nextRound: () => void;
}

const useGameStore = create<GameStore>(() => ({
    rounds: [],
    currentRoundIndex: 0,
    currentPlayerId: 1,
    startNewGame: (playerNames) => {
        playerNames.forEach((name) => {
            usePlayerStore.getState().addPlayer(name);
        });
    },
    nextRound: () => {
        if (usePlayerStore.getState().lastAddedPlayerId < 2) {
            throw new Error('At least two players are required to start a new round.');
        }

        const playerStore = usePlayerStore.getState();
        const gameStore = useGameStore.getState();

        const activePlayerId = gameStore.currentPlayerId;
        const playerIds = Object.keys(playerStore.playerMap).map(Number);
        const activePlayerIndex = playerIds.indexOf(activePlayerId);
        const nextPlayerId = playerIds[(activePlayerIndex + 1) % playerIds.length];

        const activePlayer = playerStore.playerMap[activePlayerId];
        const nextPlayer = playerStore.playerMap[nextPlayerId];

        if (!activePlayer || !nextPlayer) {
            throw new Error('Unable to determine the active and next players.');
        }

        const currentRoundIndex = gameStore.currentRoundIndex;
        const nextRoundIndex = currentRoundIndex + 1;

        const nextPlayerPointsBefore = nextPlayer.points;

        const activePlayerElementBasePoints = activePlayer.windElement.basePoints +
            activePlayer.fireElement.basePoints +
            activePlayer.waterElement.basePoints +
            activePlayer.earthElement.basePoints;

        const activePlayerElementAddedPoints = activePlayer.windElement.addedPoints +
            activePlayer.fireElement.addedPoints +
            activePlayer.waterElement.addedPoints +
            activePlayer.earthElement.addedPoints;

        const totalActivePlayerElementPoints = activePlayerElementBasePoints + activePlayerElementAddedPoints;

        nextPlayer.points -= totalActivePlayerElementPoints;

        const nextRound: Round = {
            index: nextRoundIndex,
            activePlayer,
            nextPlayer,
            nextPlayerPointsBefore: nextPlayerPointsBefore,
        };

        useGameStore.setState((state) => ({
            rounds: [...state.rounds, nextRound],
            currentRoundIndex: nextRoundIndex,
            currentPlayerId: nextPlayerId,
        }));
    },
}));

export default useGameStore;