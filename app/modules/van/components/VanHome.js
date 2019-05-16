import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MainView from '../../../core/layout/MainView';
import MainHeader from '../../../core/layout/MainHeader';
import { connect } from 'react-redux';
import { getVanTrucks } from '../actions/actions';
import Spinner from '../../../core/layout/Spinner';
import MarkerSalePoint from './MarkerSalePoint';
import MarkerVan from './MarkerVan';

const deviceDimWidth = Dimensions.get('window').width;
const deviceDimHeight = Dimensions.get('window').height;
const mapHeight = deviceDimWidth - 80;
const spinnerTop = Math.floor(mapHeight / 2);

const LATITUDE_DELTA = 0.09;
const LONGITUDE_DELTA = LATITUDE_DELTA * (deviceDimWidth / deviceDimHeight);

const initialLocation = {
    latitude: -4.3277476,
    longitude: 15.3414303,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
};

class VanHome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            latitude: initialLocation.latitude,
            longitude: initialLocation.longitude,
            markers: []
        };

        this.mapRef = null;
    }

    componentDidMount() {
        const { getVanTrucks, profile } = this.props;
        const ccode = profile.numero.slice(0, 5); 
        
        getVanTrucks(profile.uuid, ccode);
    }

    componentWillReceiveProps(nextProps) {
        const { profile, vans } = nextProps;

        if(this.state.markers.length === 0) {
            const markers = [];

            if(profile.latitude !== null && profile.longitude !== null) {
                markers.push({ 
                    latitude: parseFloat(profile.latitude),
                    longitude: parseFloat(profile.longitude)
                });
            }

            vans.map((van) => {
                markers.push({ 
                    latitude: parseFloat(van.lat),
                    longitude: parseFloat(van.lng)
                });
            });

            this.setState({
                markers: markers,
                latitude: profile.latitude ? profile.latitude : this.state.latitude,
                longitude: profile.longitude ? profile.longitude : this.state.longitude,
            });
             
        }
    }

    _getMapRegion = () => ({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    });

    _handleFitZoom(allMarkers) {
        if(this.mapRef && allMarkers.length > 0) {
            
            this.mapRef.fitToCoordinates(
                allMarkers, {
                    edgePadding: {
                        right: (deviceDimWidth / 20),
                        bottom: (deviceDimHeight / 20),
                        left: (deviceDimWidth / 20),
                        top: (deviceDimHeight / 20),
                    }
                }
            );
            
        }
    }

    render() {
        const { navigation, isLoading, vans, profile } = this.props;
        const { markers } = this.state;

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_no_line.png')}>
                <MainHeader 
                    title="position de mon camion vendeur"
                    uri={require('../../../assets/images/van.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                />
                <View style={styles.mapContainer}>
                    <MapView 
                        ref={(ref) => { this.mapRef = ref }}
                        provider={PROVIDER_GOOGLE}
                        region={this._getMapRegion()}
                        style={styles.mapStyle} 
                        zoomControlEnabled={true}
                        onLayout={(event) => this._handleFitZoom(markers)}
                    >
                        {profile.latitude && profile.longitude &&
                            <MarkerSalePoint profile={profile} />
                        }
                        {vans.map((van, index) => (
                                <MarkerVan key={index.toString()} van={van} />
                            ))
                        }
                        
                    </MapView>
                    {isLoading ?
                            <Spinner containerStyle={{
                                position: 'absolute', 
                                top: spinnerTop,
                                left: '50%'
                            }} 
                            color="blue" /> : null
                    }
                </View>
            </MainView>
        );
    } 
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        marginTop: "10%",
        paddingBottom: 5
    },
    mapStyle: {
        flex: 1
    }
});

const mapStateToProps = (state) => ({
    profile: state.profile,
    isLoading: state.uiLoading.isLoading,
    vans: state.trucks.vans
});

export default connect(mapStateToProps, { getVanTrucks })(VanHome);