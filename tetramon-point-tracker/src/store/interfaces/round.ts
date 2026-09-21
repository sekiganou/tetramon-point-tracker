import type { PlayerId } from "./player";

export default interface Round {
    index: number;
    currentPlayerId: PlayerId;
    nextPlayerId: PlayerId;
    nextPlayerPointsBefore: number;
    nextPlayerPointsAfter: number;
}