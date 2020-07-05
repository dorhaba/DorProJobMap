import React from 'react';
import { GoogleMap, withScriptjs, withGoogleMap, Marker, Polyline } from "react-google-maps"
import * as CarMove from "./simul/route3"

interface Iprops {

}

interface Istate {
  lat: Number;
  lng: Number;
}

const trkpt = CarMove.default.trkpt;

function Map() {


  return (<GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: 32.08626, lng: 34.77778 }} >
    {trkpt.map((car, index) =>
      <Marker key={index} position={{ lat: Number(car.lat), lng: Number(car.lng) }}>
      </Marker>

    )}

  </GoogleMap>

  );

}





const WrappedMap: any = withScriptjs(withGoogleMap(Map));

class App extends React.Component<Iprops, Istate>{
  constructor(props: Readonly<Iprops>) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0
    }
  }

  render() {
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <WrappedMap
          googleMapURL={
            `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyByl9qc7gCZsYz-wgmekCKgvzxFKpy66Cg`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}>
        </WrappedMap>


      </div>
    );
  }
}

export default App;
