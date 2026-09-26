export const ElementEnum = {
    Fire: 'fire',
    Earth: 'earth',
    Water: 'water',
    Wind: 'wind',
} as const;

export const ELEMENT_TYPES = ['fire', 'earth', 'water', 'wind'] as const;

export type ElementTypes = typeof ELEMENT_TYPES[number];

export interface Element {
    basePoints: number;
    addedPoints: number;
    cardPoints: number;
}