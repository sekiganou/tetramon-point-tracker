import type { Element } from './element';

export type PlayerId = string;

export default interface Player {
    id: PlayerId;
    name: string;
    points: number;
    windElement: Element;
    fireElement: Element;
    waterElement: Element;
    earthElement: Element;
}
