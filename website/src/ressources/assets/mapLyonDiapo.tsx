import Image from "next/image";
import MapLyonDiapoPNG from "./sources/mapLyonDiapo.png"

type MapLyonProps = {
    className?: string;
}

export const MapLyon = ({className}: MapLyonProps) => (
    <Image src={MapLyonDiapoPNG} alt="map de la zone" width={345} height={377} className={className}/>
);