import { useEffect, useRef, useState } from "react";
import { Location } from '../types/types'

interface StreetViewMapProps {
    location: Location | undefined,
    round: number
}

export default function StreetViewMap(props: StreetViewMapProps) {

    const ref = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.StreetViewPanorama>();

    useEffect(() => {
        console.log("location", props.location)
        if (ref.current && !map && props.location != undefined) {
            setMap(new window.google.maps.StreetViewPanorama(ref.current, {
                position: { lat: props.location.lat, lng: props.location.lng },
                pov: {
                    heading: 0,
                    pitch: 0,
                },
                disableDefaultUI: true,
            }));
        }
    }, [ref, map]);

    return <div ref={ref} className="z-0 w-full h-full"></div>
}