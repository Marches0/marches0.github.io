export interface SeasonEvent {
    name: string;
    colour: string;
    typical: number;
    seasonCurrency: string;
    seasonPoints: number[][];
}

export enum SeasonPointIndex {
    Currency = 0,
    SeasonPoints = 1
}