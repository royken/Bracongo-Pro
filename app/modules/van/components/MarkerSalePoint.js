import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { parseGeoCoord } from '../../../utils/helper';

const MarkerSalePoint = (props) => {
    const { latitude, longitude, cover, raisonSociale } = props.profile;
    const coverUrl = isEmpty(cover) ? "undefined" : cover;

    return (
        <Marker coordinate={{
                latitude: parseGeoCoord(latitude), 
                longitude: parseGeoCoord(longitude)
            }}
            title={raisonSociale ? raisonSociale : ""}
        >
            <Image style={styles.image_style} 
                source={{uri: coverUrl}} 
                onError={() => {}}
            />
        </Marker>  
    );
}

const styles = StyleSheet.create({
    image_style: {
        height: 38, 
        width: 38, 
        backgroundColor: "#7B7C9E", 
        borderRadius: 19,
        borderColor: "#936DF3", 
        borderWidth: 2
    }
});

MarkerSalePoint.propTypes = {
    profile: PropTypes.object.isRequired,
};

export default MarkerSalePoint;
