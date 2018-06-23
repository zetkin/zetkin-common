import React from 'react';
import ReactDOM from 'react-dom';

export default class ActionMap extends React.Component {
    static propTypes = {
        locations: React.PropTypes.array,
        style: React.PropTypes.object,
        zoom: React.PropTypes.number,
    };

    componentDidMount() {
        var ctrDOMNode = ReactDOM.findDOMNode(this.refs.mapContainer);

        var mapOptions = {
            center: this.props.pendingLocation,
            disableDefaultUI: true,
            zoomControl: true,
            zoom: this.props.zoom || 4,
        };

        this.map = new google.maps.Map(ctrDOMNode, mapOptions);

        this.markers = [];

        this.resetMarkers();
    }

    componentWillUnmount() {
        var marker;
        // Remove old markers
        while (marker = this.markers.pop()) {
            marker.setMap(null);
            google.maps.event.clearInstanceListeners(marker);
        }
    }

    render() {
        return (
            <div className="ActionMap"
                ref="mapContainer" style={ this.props.style }/>
        )
    }

    resetMarkers() {
        var i;
        var marker;
        var bounds;

        var locations = this.props.locations;
        // Remove old markers
        while (marker = this.markers.pop()) {
            marker.setMap(null);
            google.maps.event.clearInstanceListeners(marker);
        }

        var pendingId;
        if (this.props.pendingLocation) {
            this.createMarker({data: this.props.pendingLocation});
            pendingId = this.props.pendingLocation.id;

            this.map.setZoom(this.props.zoom || 16);
            this.map.setCenter(new google.maps.LatLng(
                this.props.pendingLocation.lat,
                this.props.pendingLocation.lng));
        }

        if (locations) {
            for (i = 0; i < locations.length; i++) {
                if (pendingId !== locations[i].data.id) {
                    this.createMarker(locations[i], false, bounds);
                }
            }
        }
    }

    createMarker(loc, bounds) {
        var marker;
        var latLng = new google.maps.LatLng(loc.data.lat, loc.data.lng);

        marker = new google.maps.Marker({
            position: latLng,
            map: this.map,
            draggable: false,
            title: loc.data.title,
        });

        this.markers.push(marker);
    }
}
