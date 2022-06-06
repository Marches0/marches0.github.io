export interface SeasonEvent {
    name: string;
    colour: string;
    typical: number;
    seasonCurrency: string;
    seasonCurrencyPlural: string | undefined;
    seasonPoints: number[][];
}

export enum SeasonPointIndex {
    Currency = 0,
    SeasonPoints = 1
}