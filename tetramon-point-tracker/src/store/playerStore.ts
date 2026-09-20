import { create } from 'zustand';

import type Player from './interfaces/player';
import type { ElementType } from './interfaces/element';
import { ElementEnum } from './interfaces/element';


const DEFAULT_ELEMENT_POINTS = 0;
const DEFAULT_PLAYER_POINTS = 500;

interface PlayerStore {
    lastAddedPlayerId: number;
    playerMap: Record<number, Player>;
    addPlayer: (name?: string) => void;
    updateElementBasePoints: (id: number, type: ElementType, basePoints: number) => void;
    updateElementAddedPoints: (id: number, type: ElementType, addedPoints: number) => void;
}

const usePlayerStore = create<PlayerStore>((set) => ({
    lastAddedPlayerId: 0,
    playerMap: {},
    addPlayer: (name?: string) => set((state) => {
        const newPlayerId = state.lastAddedPlayerId + 1;

        const player: Player = {
            id: newPlayerId,
            name: name ?? `Player ${newPlayerId}`,
            points: DEFAULT_PLAYER_POINTS,
            windElement: { type: ElementEnum.Wind, basePoints: DEFAULT_ELEMENT_POINTS, addedPoints: DEFAULT_ELEMENT_POINTS },
            fireElement: { type: ElementEnum.Fire, basePoints: DEFAULT_ELEMENT_POINTS, addedPoints: DEFAULT_ELEMENT_POINTS },
            waterElement: { type: ElementEnum.Water, basePoints: DEFAULT_ELEMENT_POINTS, addedPoints: DEFAULT_ELEMENT_POINTS },
            earthElement: { type: ElementEnum.Earth, basePoints: DEFAULT_ELEMENT_POINTS, addedPoints: DEFAULT_ELEMENT_POINTS },
        };

        return { playerMap: { ...state.playerMap, [newPlayerId]: player }, lastAddedPlayerId: newPlayerId };
    }),

    updateElementBasePoints: (id, type, basePoints) => set((state) => {
        const player = state.playerMap[id];
        if (!player) return state;
        const updatedPlayer = { ...player };
        switch (type) {
            case ElementEnum.Wind:
                updatedPlayer.windElement!.basePoints = basePoints;
                break;
            case ElementEnum.Fire:
                updatedPlayer.fireElement!.basePoints = basePoints;
                break;
            case ElementEnum.Water:
                updatedPlayer.waterElement!.basePoints = basePoints;
                break;
            case ElementEnum.Earth:
                updatedPlayer.earthElement!.basePoints = basePoints;
                break;
        }
        return { playerMap: { ...state.playerMap, [id]: updatedPlayer } };
    }),

    updateElementAddedPoints: (id, type, addedPoints) => set((state) => {
        const player = state.playerMap[id];
        if (!player) return state;
        const updatedPlayer = { ...player };
        switch (type) {
            case ElementEnum.Wind:
                updatedPlayer.windElement!.addedPoints = addedPoints;
                break;
            case ElementEnum.Fire:
                updatedPlayer.fireElement!.addedPoints = addedPoints;
                break;
            case ElementEnum.Water:
                updatedPlayer.waterElement!.addedPoints = addedPoints;
                break;
            case ElementEnum.Earth:
                updatedPlayer.earthElement!.addedPoints = addedPoints;
                break;
        }
        return { playerMap: { ...state.playerMap, [id]: updatedPlayer } };
    })
}));

export default usePlayerStore;