import { useEffect, useState } from "react";
import { Location } from "../types/types"

interface RoundCompleteProps {
    guess: google.maps.LatLng|null,
    actual: Location|undefined
}

export default function RoundComplete(props: RoundCompleteProps) {

    const [score, setScore] = useState(0);

    useEffect(() => {
        setScore(calculateScore())
    }, [])

    function calculateScore() : number {
        console.log(props.guess?.lat(), props.guess?.lng())
        if (props.guess == null || props.actual == null) {
            return 0
        }
        let distance = getDistanceFromLatLonInKm(props.guess?.lat(), props.guess?.lng(), props.actual?.lat, props.actual.lng);
        console.log(distance)
        let score = 5000*Math.pow(0.998036, distance)
        return score;
    }

    return (
        <div>
            <h1>{score}</h1>
        </div>
    )
}


// from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function getDistanceFromLatLonInKm(lat1: number,lon1: number,lat2: number,lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}
  
function deg2rad(deg: number) {
    return deg * (Math.PI/180)
}