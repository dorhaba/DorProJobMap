import React from 'react';
import { withGoogleMap, withScriptjs, GoogleMap, Marker, Polyline } from 'react-google-maps'
import * as CarMove from "./simul/route3"

interface Iprops {

}

interface Istate {
    progress: any[]
}

class Map extends React.Component<Iprops, Istate> {

    constructor(props: Readonly<Iprops>) {
        super(props);
        this.state = {
            progress: [],
        }

        this.getDistance = this.getDistance.bind(this);
        this.moveObject = this.moveObject.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.UNSAFE_componentWillMount = this.UNSAFE_componentWillMount.bind(this);
    }

    interval = 0
    velocity = 5
    initialDate: Date = new Date()
    trkpt = CarMove.default.trkpt;

    position = {
        lat: this.trkpt[0].lat,
        lng: this.trkpt[0].lng
    };

    getDistance = () => {
        const differentInTime = (new Date().getTime() - this.initialDate.getTime()) / 1000
        // console.log("differentInTime" + new Date().getTime())
        return differentInTime * this.velocity
    }

    moveObject = () => {
        const distance = this.getDistance()
        if (!distance) {
            return
        }
        let progress = this.trkpt.filter(coordinates => coordinates.distance < distance)
        this.setState({ progress })

        const nextLine = this.trkpt.find(coordinates => coordinates.distance > distance)
        if (!nextLine) {
            this.setState({ progress })
            return
        }
        const lastLine = progress[progress.length - 1]

        const lastLineLatLng = new window.google.maps.LatLng(
            lastLine.lat,
            lastLine.lng
        )

        const nextLineLatLng = new window.google.maps.LatLng(
            nextLine.lat,
            nextLine.lng
        )

        const totalDistance = nextLine.distance - lastLine.distance
        const percentage = (distance - lastLine.distance) / totalDistance

        const position: any = window.google.maps.geometry.spherical.interpolate(
            lastLineLatLng,
            nextLineLatLng,
            percentage
        )

        progress = progress.concat(position)
        this.setState({ progress })
    }

    componentDidMount = () => {
        this.interval = window.setInterval(this.moveObject, 1000)
    }

    componentWillUnmount = () => {
        window.clearInterval(this.interval)
    }

    UNSAFE_componentWillMount = () => {
        const { lat: lat1, lng: lng1 } = this.trkpt[0]
        let lastPoint = new window.google.maps.LatLng(lat1, lng1)
        let latLong2 = new window.google.maps.LatLng(lat1, lng1)
        let totalDistance = 0
        let distance = 0
        this.trkpt = this.trkpt.map((coordinates: any, i: Number, array: any) => {
            if (i === 0) {
                return { ...coordinates, distance: 0 }
            }

            totalDistance = distance
            const { lat: lat2, lng: lng2 } = coordinates
            latLong2 = new window.google.maps.LatLng(lat2, lng2)

            distance = window.google.maps.geometry.spherical.computeDistanceBetween(
                lastPoint,
                latLong2
            )

            lastPoint = latLong2
            distance = distance + totalDistance

            return { ...coordinates, distance }
        })
        console.log(this.trkpt)
    }

    render = () => {
        return (
            <GoogleMap
                defaultZoom={15}
                defaultCenter={this.position} >
                <Marker position={this.state.progress[this.state.progress.length - 1]} >
                </Marker>
                <Polyline path={(this.state.progress)} options={{ strokeColor: "#0000FF " }} />
            </GoogleMap>
        )
    }
}

const WrappedMap = withScriptjs(withGoogleMap(Map))

export default () => (
    <div style={{ height: '100vh', width: '100vw' }}>
        <WrappedMap
            googleMapURL={
                `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyByl9qc7gCZsYz-wgmekCKgvzxFKpy66Cg`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}>
        </WrappedMap>
    </div>
)