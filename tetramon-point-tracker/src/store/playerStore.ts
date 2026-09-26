import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

import type Player from './interfaces/player';
import type { PlayerId } from './interfaces/player';
import { ELEMENT_TYPES, type Element, type ElementTypes } from './interfaces/element';

const DEFAULT_ELEMENT_POINTS = 0;
const DEFAULT_PLAYER_POINTS = 500;

interface PlayerStore {
    playerMap: Record<PlayerId, Player>;

    addPlayer: (name?: string) => PlayerId;

    resetPlayers: () => void;
    resetAllAddedPoints: () => void;
    resetAllCardPoints: () => void;
    resetOneAddedPoints: (id: PlayerId) => void;
    resetOneCardPoints: (id: PlayerId) => void;

    updatePlayerPoints: (id: PlayerId, points: number) => void;
    updateElementBasePoints: (id: PlayerId, type: ElementTypes, basePoints: number) => void;
    updateElementAddedPoints: (id: PlayerId, type: ElementTypes, addedPoints: number) => void;
    updateElementCardPoints: (id: PlayerId, type: ElementTypes, cardPoints: number) => void;
}

const usePlayerStore = create<PlayerStore>()(persist((set) => ({
    playerMap: {},
    addPlayer: (name?: string) => {
        const newPlayerId = uuidv4();

        const player: Player = {
            id: newPlayerId,
            name: name ?? `${newPlayerId}`,
            points: DEFAULT_PLAYER_POINTS,
            windElement: { basePoints: DEFAULT_ELEMENT_POINTS, addedPoints: DEFAULT_ELEMENT_POINTS, cardPoints: DEFAULT_ELEMENT_POINTS },
            fireElement: { basePoints: DEFAULT_ELEMENT_POINTS, addedPoints: DEFAULT_ELEMENT_POINTS, cardPoints: DEFAULT_ELEMENT_POINTS },
            waterElement: { basePoints: DEFAULT_ELEMENT_POINTS, addedPoints: DEFAULT_ELEMENT_POINTS, cardPoints: DEFAULT_ELEMENT_POINTS },
            earthElement: { basePoints: DEFAULT_ELEMENT_POINTS, addedPoints: DEFAULT_ELEMENT_POINTS, cardPoints: DEFAULT_ELEMENT_POINTS },
        };

        set((state) => ({ playerMap: { ...state.playerMap, [newPlayerId]: player } }));
        return newPlayerId;
    },

    resetPlayers: () => set({ playerMap: {} }),

    resetAllAddedPoints: () => set((state) => ({
        playerMap: Object.fromEntries(Object.entries(state.playerMap).map(([id, player]) => [id, {
            ...player,
            windElement: { ...player.windElement, addedPoints: DEFAULT_ELEMENT_POINTS },
            fireElement: { ...player.fireElement, addedPoints: DEFAULT_ELEMENT_POINTS },
            waterElement: { ...player.waterElement, addedPoints: DEFAULT_ELEMENT_POINTS },
            earthElement: { ...player.earthElement, addedPoints: DEFAULT_ELEMENT_POINTS },
        }])),
    })),

    resetAllCardPoints: () => set((state) => ({
        playerMap: Object.fromEntries(Object.entries(state.playerMap).map(([id, player]) => [id, {
            ...player,
            windElement: { ...player.windElement, cardPoints: DEFAULT_ELEMENT_POINTS },
            fireElement: { ...player.fireElement, cardPoints: DEFAULT_ELEMENT_POINTS },
            waterElement: { ...player.waterElement, cardPoints: DEFAULT_ELEMENT_POINTS },
            earthElement: { ...player.earthElement, cardPoints: DEFAULT_ELEMENT_POINTS },
        }])),
    })),

    updatePlayerPoints: (id, points) => set((state) => {
        const player = state.playerMap[id];
        if (!player) return state;
        return { playerMap: { ...state.playerMap, [id]: { ...player, points } } };
    }),

    resetOneAddedPoints: (id) => set((state) => {
        const player = state.playerMap[id];
        if (!player) return state;
        return {
            playerMap: {
                ...state.playerMap,
                [id]: {
                    ...player,
                    windElement: { ...player.windElement, addedPoints: DEFAULT_ELEMENT_POINTS },
                    fireElement: { ...player.fireElement, addedPoints: DEFAULT_ELEMENT_POINTS },
                    waterElement: { ...player.waterElement, addedPoints: DEFAULT_ELEMENT_POINTS },
                    earthElement: { ...player.earthElement, addedPoints: DEFAULT_ELEMENT_POINTS },
                },
            },
        };
    }),

    resetOneCardPoints: (id) => set((state) => {
        const player = state.playerMap[id];
        if (!player) return state;
        return {
            playerMap: {
                ...state.playerMap,
                [id]: {
                    ...player,
                    windElement: { ...player.windElement, cardPoints: DEFAULT_ELEMENT_POINTS },
                    fireElement: { ...player.fireElement, cardPoints: DEFAULT_ELEMENT_POINTS },
                    waterElement: { ...player.waterElement, cardPoints: DEFAULT_ELEMENT_POINTS },
                    earthElement: { ...player.earthElement, cardPoints: DEFAULT_ELEMENT_POINTS },
                },
            },
        };
    }),

    updateElementBasePoints: (id, type, basePoints) => set((state) => {
        const player = state.playerMap[id];
        if (!player) return state;
        const updatedPlayer = { ...player };

        for (const elementType of ELEMENT_TYPES) {
            if (elementType === type) {
                (updatedPlayer[`${elementType}Element` as keyof Player] as Element).basePoints = basePoints;
            }
        }

        return { playerMap: { ...state.playerMap, [id]: updatedPlayer } };
    }),

    updateElementAddedPoints: (id, type, addedPoints) => set((state) => {
        const player = state.playerMap[id];
        if (!player) return state;
        const updatedPlayer = { ...player };

        for (const elementType of ELEMENT_TYPES) {
            if (elementType === type) {
                (updatedPlayer[`${elementType}Element` as keyof Player] as Element).addedPoints += addedPoints;
            }
        }

        return { playerMap: { ...state.playerMap, [id]: updatedPlayer } };
    }),

    updateElementCardPoints: (id, type, cardPoints) => set((state) => {
        const player = state.playerMap[id];
        if (!player) return state;
        const updatedPlayer = { ...player };

        for (const elementType of ELEMENT_TYPES) {
            if (elementType === type) {
                (updatedPlayer[`${elementType}Element` as keyof Player] as Element).cardPoints = cardPoints;
            }
        }

        return { playerMap: { ...state.playerMap, [id]: updatedPlayer } };
    }),
}), { name: 'tetramon-player-store' }));

export default usePlayerStore;