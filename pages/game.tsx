import { useState } from "react";
import { StreetViewService, useJsApiLoader } from '@react-google-maps/api';
import { GameData, Location } from '../types/types'
import GuessMap from "../components/GuessMap";
import StreetViewMap from "../components/StreetViewMap";
import RoundComplete from "../components/RoundComplete";

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

    const onLoad = (streetViewService: google.maps.StreetViewService | null) => {
        generateGame(streetViewService).then((res) =>{
            setGame(res);
            setLoading(false);
        });
    };

    function guessCallback(guess: google.maps.LatLng) {
        setDidGuess(true);
        setGuess(guess);
        console.log("guess", guess)
    }

    return (
        <div className="w-full h-screen">
            <StreetViewService
                onLoad={onLoad}
            />
            { loading ? <p>loading game</p> : 
                <div className="w-full h-full">
                    {didGuess ? <RoundComplete guess={guess} actual={game?.roundCoordinates[0]} /> : <div className="w-full h-screen flex items-center justify-center relative">
                        <GuessMap guessCallback={guessCallback} />
                        <StreetViewMap location={game?.roundCoordinates[0]} round={0}/>
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

    await getLocations(service, numRounds).then((locations) => {
        game.roundCoordinates = locations
    });

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

async function getLocations(service: google.maps.StreetViewService, numRounds: number) : Promise<any> {
    let coords: Location[] = [];
    while (coords.length < numRounds) {
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

                coords.push(location);
            }
        })
    }
    
    return coords;
}