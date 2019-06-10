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
import IconWithText from '../../../core/layout/IconWithText';
import { parseGeoCoord } from '../../../utils/helper';
import { cancelRequest } from '../../../core/actions/actions';
import { isArray } from 'lodash';

const deviceDimWidth = Dimensions.get('window').width;
const deviceDimHeight = Dimensions.get('window').height;
const mapHeight = deviceDimWidth - 80;
const spinnerTop = Math.floor(mapHeight / 2);

const LATITUDE_DELTA = 0.05;
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
       this._loadVans();
    }

    componentWillUnmount() {
        const { cancelRequest } = this.props;

        cancelRequest();
    }

    _loadVans(isRefreshing = false) {
        const { getVanTrucks, profile } = this.props;
        const ccode = profile.numero.slice(0, 5); 
        
        if(isRefreshing === true) { 
            this.setState({ markers: [] }, () => {
                getVanTrucks(profile.uuid, ccode);
            });
        } else {
            getVanTrucks(profile.uuid, ccode);
        }

    }

    componentWillReceiveProps(nextProps) {
        const { vans } = nextProps;

        if(this.state.markers.length === 0) {
            const markers = [];

            vans.map((van) => {
                markers.push({ 
                    latitude: parseGeoCoord(van.lat),
                    longitude: parseGeoCoord(van.lng)
                });
            });

            if(isArray(vans) && vans.length > 0) {
                this.setState({
                    markers: markers,
                    latitude: parseGeoCoord(vans[0].lat),
                    longitude: parseGeoCoord(vans[0].lng),
                });
            }
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
                        onLayout={() => this._handleFitZoom(markers)}
                    >
                        {profile.latitude && profile.longitude &&
                            <MarkerSalePoint profile={profile} />
                        }
                        {vans.map((van, index) => (
                                <MarkerVan key={index.toString()} van={van} />
                            ))
                        }
                        
                    </MapView>
                    <IconWithText name="refresh" 
                        titleStyle={styles.title_icon_style} 
                        containerStyle={styles.button_reload_map_container}
                        size={25} color="#7B7C9E"
                        reverse reverseColor="white" type="font-awesome"
                        onPress={() => this._loadVans(true)} 
                    />
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
    },
    title_icon_style: { 
        fontSize: 12, 
        fontWeight: 'bold' 
    },
    button_reload_map_container: {
        position: 'absolute', 
        top: deviceDimWidth - 85, 
        bottom: 0, 
        left: "1%", 
        right: 0
    }
});

const mapStateToProps = (state) => ({
    profile: state.profile,
    isLoading: state.uiLoading.isLoading,
    vans: state.trucks.vans
});

export default connect(mapStateToProps, { getVanTrucks, cancelRequest })(VanHome);