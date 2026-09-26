export const ElementEnum = {
    Wind: 'wind',
    Fire: 'fire',
    Water: 'water',
    Earth: 'earth'
} as const;

export const ELEMENT_TYPES = ['wind', 'fire', 'water', 'earth'] as const;

export type ElementTypes = typeof ELEMENT_TYPES[number];

export interface Element {
    basePoints: number;
    addedPoints: number;
    cardPoints: number;
}