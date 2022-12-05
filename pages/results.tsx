import { useEffect, useState } from "react"
import { GameData, Location } from "../types/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobeAmericas } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Results() {

    const [game, setGame] = useState<GameData|null>(null);
    const [totalScore, setTotalScore] = useState(0);

    useEffect(() => {
        const result = JSON.parse(localStorage.getItem("game_results")!);
        setGame(result);

        setTotalScore(result.scores.reduce((part:number, a:number) => part+a, 0))
    }, [])

    return (
        <div className="w-full h-screen flex flex-col place-content-around items-center bg-gradient-to-tr from-sky-900 to-indigo-900">
            <div className="flex flex-col items-center justify-center gap-10">
                <p className="text-4xl uppercase font-bold">Results</p>
                <p className="text-xl font-bold italic text-amber-300 animate-fade-in">
                    {totalScore.toFixed(0)} points
                </p>
            </div>
            {game ? 
                <div className="w-3/5 flex flex-col">
                    <ResultRow score={game.scores[0]} round={1} coords={game.roundCoordinates[0]} />
                    <ResultRow score={game.scores[1]} round={2} coords={game.roundCoordinates[1]} />
                    <ResultRow score={game.scores[2]} round={3} coords={game.roundCoordinates[2]} />
                    <ResultRow score={game.scores[3]} round={4} coords={game.roundCoordinates[3]} />
                    <ResultRow score={game.scores[4]} round={5} coords={game.roundCoordinates[4]} />
                </div>
                :
                <div>
                </div>
            }
            <Link href={"/"}>
                <button className="h-[2rem] px-8 mt-2 border-none bg-gradient-to-r from-green-600 to-green-700 rounded-2xl font-bold text-sm hover:scale-110 uppercase">play again</button>
            </Link>
        </div>
    )
}

function ResultRow(props: {score: number, round: number, coords: Location}) {
    return (
        <div className="flex flex-row place-content-between w-full p-2 bg-gray-700 text-white border-white">
            <p>{props.round}</p>
            <p>{props.score.toFixed(0)}</p>
            <Link href={`https://maps.google.com/maps?q=&layer=c&cbll=${props.coords.lat},${props.coords.lng}`}>
                <FontAwesomeIcon icon={faGlobeAmericas} />
            </Link>
        </div>
    )
}