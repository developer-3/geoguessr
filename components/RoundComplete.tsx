import { useEffect, useRef, useState } from "react";
import { Location } from "../types/types"

interface RoundCompleteProps {
    guess: google.maps.LatLng|null,
    actual: Location|undefined
}

export default function RoundComplete(props: RoundCompleteProps) {

    const [score, setScore] = useState(0);
    const [distance, setDistance] = useState(0);
    
    const ref = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map>();

    useEffect(() => {
        let res = calculateScore(props.guess, props.actual);
        setScore(res[0]);
        setDistance(res[1]);
    }, [])

    useEffect(() => {
        if (ref.current && !map) {
            // Set up map
            let _map = new window.google.maps.Map(ref.current, 
                {
                    center: {
                        lat: 35.216, lng: -10.618
                    },
                    zoom: 1,
                    disableDefaultUI: true,
            });

            // create markers
            let guess_marker = new google.maps.Marker({
                position: props.guess
            })
            let actual_marker = new google.maps.Marker({
                position: props.actual,
                icon: "/images/correct-location.svg"
            })

            // add markers to map
            guess_marker.setMap(_map)
            actual_marker.setMap(_map)

            // create dotted line and add to map
            const lineSymbol = {
                path: "M 0,-1 0,1",
                strokeOpacity: 1,
                scale: 4,
            };

            const line = new google.maps.Polyline({
                path: [props.actual!, props.guess!],
                strokeColor: "#000000",
                strokeWeight: 3,
                strokeOpacity: 0,
                icons: [
                {
                    icon: lineSymbol,
                    offset: "0",
                    repeat: "20px",
                }],
                map: _map
            })

            // apply bounds to map
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(props.guess!);
            bounds.extend(props.actual!);
            _map.fitBounds(bounds);

            // set map
            setMap(_map);
        }
    }, [ref, map])

    return (
        <div className="w-full h-full">
            <div ref={ref} className="w-full h-2/3"/>
            <div className="h-1/3 pt-4 flex flex-col gap-4 items-center bg-gradient-to-tr from-sky-900 to-indigo-900">
                <p className="text-xl font-bold italic text-amber-300">{score.toFixed(0)} points</p>
                <p className="flex flex-row items-center gap-1 font-medium">Your guess was <Distance distance={distance} /> from the current location</p>
                <button className="h-[2rem] px-8 mt-2 border-none bg-gradient-to-r from-green-600 to-green-700 rounded-2xl font-bold text-sm hover:scale-110">NEXT ROUND</button>
            </div>
        </div>
    )
}

function Distance(props: {distance: number}) {
    return <div className="px-1 bg-gray-500 rounded-sm bg-opacity-50">
                <p className="text-white font-bold text-md italic ">{props.distance.toFixed(0)} KM</p>
            </div>
}

/**
 * Calculate score for guess
 * @returns the calculated score
 */
function calculateScore(guess: google.maps.LatLng|null, actual: Location|undefined) : number[] {
    if (guess == null || actual == null) {
        return [0,0]
    }
    let distance = getDistanceFromLatLonInKm(guess.lat(), guess?.lng(), actual.lat, actual.lng);
    let score = 5000*Math.pow(0.998036, distance)
    return [score, distance];
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