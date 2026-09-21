import { create } from 'zustand';
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
    updateElementBasePoints: (id: PlayerId, type: ElementType, basePoints: number) => void;
    updateElementAddedPoints: (id: PlayerId, type: ElementType, addedPoints: number) => void;
}

const usePlayerStore = create<PlayerStore>((set) => ({
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
}));

export default usePlayerStore;