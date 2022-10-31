export type { GameData, Location };

interface GameData {
    scores: number[],
    roundCoordinates: Location[],
    id: number,
    numberOfRounds: number
}

interface Location {
    lat: number,
    lng: number
}