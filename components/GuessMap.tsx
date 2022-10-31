import { useEffect, useRef, useState } from "react";

interface GuessMapProps {
    guessCallback: CallableFunction
}

export default function GuessMap(props: GuessMapProps) {

    const ref = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map>();

    const [marker, setMarker] = useState<google.maps.Marker|null>(null);

    useEffect(() => {
        if (ref.current && !map) {
            let temp = new window.google.maps.Map(ref.current, 
                {
                    center: {
                        lat: 35.216, lng: -10.618
                    },
                    zoom: 1,
                    disableDefaultUI: true,
                    draggableCursor: 'crosshair',
                    draggingCursor: 'crosshair'
            });

            let new_marker = new google.maps.Marker({})
            
            new_marker.setMap(temp);
            temp.addListener('click', (mouse: any) => {
                new_marker.setPosition(mouse.latLng);
                setMarker(new_marker);
            })
            setMap(temp);
        }
    }, [ref, map]);

    function makeGuess() {
        if (marker == null) {
            return;
        }
        props.guessCallback(marker.getPosition())
    }

    return (
        <div className="z-10 absolute bottom-0 right-0 w-1/4 h-2/5 mr-4 opacity-30 transition-map hover:opacity-100 hover:w-2/5 hover:h-3/5">
            <div className="flex flex-col gap-4 h-full">
                <div ref={ref} className="h-3/4 w-full bg-blue-300"/>
                { marker ?
                    <button className="border-none bg-green-600 rounded-xl font-bold h-[2rem]" onClick={makeGuess}>Guess</button>
                :
                    <button className="border-none bg-green-600 rounded-xl font-bold h-[2rem]" onClick={makeGuess}>Guess</button>
                }
            </div>
        </div>
    )
}