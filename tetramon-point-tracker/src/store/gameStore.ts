import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import usePlayerStore from './playerStore';
import type Round from './interfaces/round';
import type { PlayerId } from './interfaces/player';

interface GameStore {
    rounds: Round[];
    currentPlayerIndex: number;
    playerIds: PlayerId[];
    winnerId?: PlayerId;
    startNewGame: (playerNames: string[]) => void;
    resetGame: () => void;
    nextRound: () => void;
}

const useGameStore = create<GameStore>()(persist((set) => ({
    rounds: [],
    playerIds: [],
    currentPlayerIndex: 0,
    winnerId: undefined,
    startNewGame: (playerNames) => {
        const gameStore = useGameStore.getState();
        const playerStore = usePlayerStore.getState();

        if (gameStore.playerIds.length > 0) {
            throw new Error('A game is already in progress. Please reset the game before starting a new one.');
        }
        playerStore.resetPlayers();
        const playerIds = playerNames.map((name) => {
            const playerId = playerStore.addPlayer(name);
            return playerId;
        });
        useGameStore.setState({ rounds: [], playerIds, currentPlayerIndex: 0, winnerId: undefined });
    },
    resetGame: () => {
        usePlayerStore.getState().resetPlayers();
        set({ rounds: [], playerIds: [], currentPlayerIndex: 0, winnerId: undefined });
    },
    nextRound: () => {
        const playerStore = usePlayerStore.getState();
        const gameStore = useGameStore.getState();

        if (!gameStore.playerIds.length) {
            throw new Error('No players in the game.');
        }

        const currentPlayerIndex = gameStore.currentPlayerIndex;
        const currentPlayerId = gameStore.playerIds[currentPlayerIndex];
        const currentPlayer = playerStore.playerMap[currentPlayerId];

        const nextPlayerIndex = (currentPlayerIndex + 1) % gameStore.playerIds.length;
        const nextPlayerId = gameStore.playerIds[nextPlayerIndex];
        const nextPlayer = playerStore.playerMap[nextPlayerId];

        if (!currentPlayer || !nextPlayer) {
            throw new Error('Unable to determine the active and next players.');
        }

        const nextPlayerPointsBefore = nextPlayer.points;

        const activePlayerElementBasePoints = currentPlayer.windElement.basePoints +
            currentPlayer.fireElement.basePoints +
            currentPlayer.waterElement.basePoints +
            currentPlayer.earthElement.basePoints;

        const activePlayerElementAddedPoints = currentPlayer.windElement.addedPoints +
            currentPlayer.fireElement.addedPoints +
            currentPlayer.waterElement.addedPoints +
            currentPlayer.earthElement.addedPoints;

        const totalActivePlayerElementPoints = activePlayerElementBasePoints + activePlayerElementAddedPoints;

        const nextPlayerPointsAfter = nextPlayer.points - totalActivePlayerElementPoints;
        playerStore.updatePlayerPoints(nextPlayerId, nextPlayerPointsAfter);
        playerStore.clearAddedPoints(currentPlayerId);

        useGameStore.setState((state) => ({
            ...state,
            currentPlayerIndex: nextPlayerIndex,
            winnerId: nextPlayerPointsAfter <= 0 ? currentPlayerId : undefined,
            rounds: [...state.rounds, {
                index: state.rounds.length,
                currentPlayerId,
                nextPlayerId,
                nextPlayerPointsBefore: nextPlayerPointsBefore,
                nextPlayerPointsAfter
            }]
        }));
    },
}), { name: 'tetramon-game-store' }));

export default useGameStore;