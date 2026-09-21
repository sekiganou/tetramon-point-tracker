import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

import type Player from './interfaces/player';
import type { PlayerId } from './interfaces/player';
import type { Element, ElementType } from './interfaces/element';

const DEFAULT_ELEMENT_POINTS = 0;
const DEFAULT_PLAYER_POINTS = 500;

const ELEMENT_TYPES = ['wind', 'fire', 'water', 'earth'] as const;

interface PlayerStore {
    playerMap: Record<PlayerId, Player>;
    addPlayer: (name?: string) => PlayerId;
    resetPlayers: () => void;
    resetAddedPoints: () => void;
    updatePlayerPoints: (id: PlayerId, points: number) => void;
    clearAddedPoints: (id: PlayerId) => void;
    updateElementBasePoints: (id: PlayerId, type: ElementType, basePoints: number) => void;
    updateElementAddedPoints: (id: PlayerId, type: ElementType, addedPoints: number) => void;
}

const usePlayerStore = create<PlayerStore>()(persist((set) => ({
    playerMap: {},
    addPlayer: (name?: string) => {
        const newPlayerId = uuidv4();

        const player: Player = {
            id: newPlayerId,
            name: name ?? `${newPlayerId}`,
            points: DEFAULT_PLAYER_POINTS,
            windElement: { basePoints: DEFAULT_ELEMENT_POINTS, addedPoints: DEFAULT_ELEMENT_POINTS },
            fireElement: { basePoints: DEFAULT_ELEMENT_POINTS, addedPoints: DEFAULT_ELEMENT_POINTS },
            waterElement: { basePoints: DEFAULT_ELEMENT_POINTS, addedPoints: DEFAULT_ELEMENT_POINTS },
            earthElement: { basePoints: DEFAULT_ELEMENT_POINTS, addedPoints: DEFAULT_ELEMENT_POINTS },
        };

        set((state) => ({ playerMap: { ...state.playerMap, [newPlayerId]: player } }));
        return newPlayerId;
    },

    resetPlayers: () => set({ playerMap: {} }),

    resetAddedPoints: () => set((state) => ({
        playerMap: Object.fromEntries(Object.entries(state.playerMap).map(([id, player]) => [id, {
            ...player,
            windElement: { ...player.windElement, addedPoints: 0 },
            fireElement: { ...player.fireElement, addedPoints: 0 },
            waterElement: { ...player.waterElement, addedPoints: 0 },
            earthElement: { ...player.earthElement, addedPoints: 0 },
        }])),
    })),

    updatePlayerPoints: (id, points) => set((state) => {
        const player = state.playerMap[id];
        if (!player) return state;
        return { playerMap: { ...state.playerMap, [id]: { ...player, points } } };
    }),

    clearAddedPoints: (id) => set((state) => {
        const player = state.playerMap[id];
        if (!player) return state;
        return {
            playerMap: {
                ...state.playerMap,
                [id]: {
                    ...player,
                    windElement: { ...player.windElement, addedPoints: 0 },
                    fireElement: { ...player.fireElement, addedPoints: 0 },
                    waterElement: { ...player.waterElement, addedPoints: 0 },
                    earthElement: { ...player.earthElement, addedPoints: 0 },
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
    })
}), { name: 'tetramon-player-store' }));

export default usePlayerStore;