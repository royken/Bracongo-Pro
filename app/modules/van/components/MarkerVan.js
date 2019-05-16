import React from 'react';
import { View, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import PropTypes from 'prop-types';
import moment from 'moment';
import { parseGeoCoord } from '../../../utils/helper';

const _getImageURI = (speed) => {
    
    if (speed > 0) {
        return require('../../../assets/images/vert.png');
    } else {
        return require('../../../assets/images/jaune.png');
    }
}

const MarkerVan = (props) => {
    const { name, lat, lng, speed, dt } = props.van;
    const uri = _getImageURI(speed);

    return (
        <Marker image={uri}  
            coordinate={{latitude: parseGeoCoord(lat), longitude: parseGeoCoord(lng)}}>
            <Callout>             
                <View style={{flex: 1, backgroundColor: "#7B7C9E", padding: 5}}>
                    <Text style={{color: 'white', fontSize: 20}}>
                        {name}
                    </Text>
                    <Text style={{color: 'white', fontSize: 20}}>
                        Dernière position : {moment(new Date(dt)).format('DD-MM-YYYY HH:mm')}
                    </Text>            
                </View>
            </Callout>    
        </Marker>  
    );
}

MarkerVan.propTypes = {
    van: PropTypes.object.isRequired,
};

export default MarkerVan;
