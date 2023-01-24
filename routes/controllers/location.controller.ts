import { Request, Response } from 'express';
import getDistance from '../../utils/getDistance';
import { Location, FilteredLocation, SignalPhase, SignalTiming } from './type';

const locationListStore: FilteredLocation[] = [];

const getLocationList = async() => {
  if (locationListStore.length) return locationListStore;

  const response = await fetch(process.env.LOCATION_LIST as string);
  const locationList = await response.json();

  locationList.forEach((location: Location) => {
    const filterdLocation = {
      ...location,
      lat: location.mapCtptIntLat / 10000000,
      lng: location.mapCtptIntLot / 10000000,
    };

    locationListStore.push(filterdLocation);
  });

  return locationListStore;
};

const getAroundLocationList = async(userPosition: FilteredLocation) => {
  const userLocation: FilteredLocation = userPosition;
  const locationListStore = await getLocationList();
  const aroundLocationList = locationListStore.map((signalLocation: FilteredLocation) => {
    if (getDistance({ userLocation, signalLocation }) <= 2) return signalLocation;
  });

  return aroundLocationList;
}

const createSignalMap = (informations: SignalPhase[] | SignalTiming[]) => {
  const filteredMap = new Map();

  informations.forEach((info: SignalPhase | SignalTiming) => {
    filteredMap.set(info.itstId, info);
  });

  return filteredMap;
}

export const getAroundSignalInformation = async (req: Request, res: Response) => {
  const userLocation = JSON.parse(req.body);
  const [aroundLocationList, signalPhase, signalTiming] = await Promise.all([
    getAroundLocationList(userLocation),
    fetch(process.env.SIGNAL_TIMING as string),
    fetch(process.env.SIGNAL_PHASE as string)
  ]);
  const signalPhaseMap = createSignalMap(signalPhase as unknown as SignalPhase[]);
  const signalTimingMap = createSignalMap(signalTiming as unknown as SignalPhase[]);
  const aroundSiganlInformation = aroundLocationList.map(location => {
    const information = {...location, phase: null, timing: null};
    const locationId = location?.itstId;

    information.phase = signalPhaseMap.get(locationId);
    information.timing = signalTimingMap.get(locationId);
    
    return information;
  });
  
  res.status(200).json(aroundSiganlInformation);
}
