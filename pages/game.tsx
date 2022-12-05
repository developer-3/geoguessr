import { useState } from "react";
import { StreetViewService, useJsApiLoader } from '@react-google-maps/api';
import { GameData, Location } from '../types/types'
import GuessMap from "../components/GuessMap";
import StreetViewMap from "../components/StreetViewMap";
import RoundComplete from "../components/RoundComplete";
import { useRouter } from "next/router";

export default function GameWrapper() {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_KEY!
    })

    return (
        <div className="w-full h-screen">
            { isLoaded ? <Game /> : <h1>loading google</h1>}
        </div>
    )
}

function Game() {
    const [loading, setLoading] = useState(true);
    const [game, setGame] = useState<GameData|null>(null);
    const [didGuess, setDidGuess] = useState(false);
    const [guess, setGuess] = useState<google.maps.LatLng|null>(null)
    const [currentRound, setCurrentRound] = useState(0);

    const [streetViewService, setStreetViewService] = useState<google.maps.StreetViewService|null>(null);

    const router = useRouter();

    const onLoad = (service: google.maps.StreetViewService | null) => {
        if (streetViewService != null) {
            return
        }
        setStreetViewService(service);
        
        var _game: GameData = {
            scores: [],
            roundCoordinates: [],
            id: 1,
            numberOfRounds: 5
        }

        getLocation(service).then((location) => {
            if (location != null) {
                _game.roundCoordinates.push(location);
                setGame(_game);
                setLoading(false);
            }
        })
    };

    function guessCallback(guess: google.maps.LatLng) {
        setDidGuess(true);
        setGuess(guess);
        console.log("guess", guess)
    }

    function nextRound(score: number) {
        game?.scores.push(score);
        if (currentRound + 1 >= game!.numberOfRounds) {
            localStorage.setItem('game_results', JSON.stringify(game));
            router.push('/results')
            return;
        }
        setCurrentRound(currentRound + 1);
        setLoading(true);
        setDidGuess(false);
        getLocation(streetViewService).then((location) => {
            if (location != null)
                game?.roundCoordinates.push(location);
                setLoading(false);
        })
    }

    return (
        <div className="w-full h-screen">
            <StreetViewService
                onLoad={onLoad}
            />
            { loading ? <div className="w-full h-full flex items-center justify-center"><p>loading game</p></div> : 
                <div className="w-full h-full">
                    {didGuess ? <RoundComplete guess={guess} actual={game?.roundCoordinates[currentRound]} nextRoundCallback={nextRound} /> : <div className="w-full h-screen flex items-center justify-center relative">
                        <GuessMap guessCallback={guessCallback} />
                        <StreetViewMap location={game?.roundCoordinates[game.roundCoordinates.length-1]} />
                    </div>}
                </div>
            }
        </div>
    )
}

async function generateGame(service: google.maps.StreetViewService | null) : Promise<any> {
    // generate game object
    var game = {} as GameData;

    if (service == null) {
        return game;
    }
    // get 5 panos
    let numRounds = 5;

    game.numberOfRounds = numRounds;
    game.id = 1;
    game.scores = []

    return game;
}

function getRandomInRange(from: number, to: number, fixed: number) : number {
    // @ts-ignore
    let res: number =  (Math.random() * (to-from) + from).toFixed(fixed) * 1;
    return res;
}

async function getLocation(service: google.maps.StreetViewService|null) : Promise<any> {
    if (service == null) {
        return null;
    }

    let loc = null;
    while (loc == null) {
        let lat: number = getRandomInRange(-180, 180, 3);
        let long: number = getRandomInRange(-180, 180, 3);
        
        await service.getPanorama({
            location: {
                lat: lat,
                lng: long
            },
            preference: window.google.maps.StreetViewPreference.NEAREST,
            radius: 10000,
            source: google.maps.StreetViewSource.OUTDOOR
        }, function(data, status) {
            if (status == window.google.maps.StreetViewStatus.OK) {
                if (data == null) {
                    return;
                }
                if (data.location == null) {
                    return;
                }
                if (data.location.latLng == null) {
                    return;
                }

                let location: Location = {
                    lat: data.location.latLng.lat() as unknown as number,
                    lng: data.location.latLng.lng() as unknown as number
                }

                loc = location
            }
        })
    }
    return loc;
}