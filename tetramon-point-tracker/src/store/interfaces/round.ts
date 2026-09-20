import type Player from "./player";

export default interface Round {
    index: number;
    activePlayer: Player;
    nextPlayer: Player;
    nextPlayerPointsBefore: number;
}