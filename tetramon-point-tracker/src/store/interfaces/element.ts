export const ElementEnum = {
    Wind: 'wind',
    Fire: 'fire',
    Water: 'water',
    Earth: 'earth'
} as const;

export type ElementType = 'wind' | 'fire' | 'water' | 'earth';

export interface Element {
    basePoints: number;
    addedPoints: number;
}