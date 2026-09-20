export const ElementEnum = {
    Wind: 'wind',
    Fire: 'fire',
    Water: 'water',
    Earth: 'earth',
} as const;

export type ElementType = (typeof ElementEnum)[keyof typeof ElementEnum];

export interface Element {
    type: ElementType;
    basePoints: number;
    addedPoints: number;
}