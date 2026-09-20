import type { Element } from './element';

export default interface Player {
    id: number;
    name: string;
    points: number;
    windElement: Element;
    fireElement: Element;
    waterElement: Element;
    earthElement: Element;
}
