import type { NextApiRequest, NextApiResponse } from 'next'
import { GameData, Location } from '../../types/types'
import {Loader} from '@googlemaps/js-api-loader';
import { useJsApiLoader } from '@react-google-maps/api';

type Data = {
  game: GameData
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
}