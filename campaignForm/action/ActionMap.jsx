import React from 'react';

export default class ActionMap extends React.Component {
    static propTypes = {
        pendingLocaton: React.PropTypes.object,
        zoom: React.PropTypes.number,
    }

    componentDidMount() {
        this.loadLeafletScript().then(() => {
            this.initMap();
        });
    }

    initMap() {
        const {lat, lng} = this.props.pendingLocation;
        const map = L.map('map').setView([lat, lng], this.props.zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.marker([lat, lng]).addTo(map);
    }

    loadLeafletScript() {
        return new Promise((resolve, reject) => {
            if (typeof L === 'undefined') {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);

                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            } else {
                resolve();
            }
        });
    }

    render() {
        return <div id="map" style={{height: 500 , width: "100%"}}></div>
    }
}
