import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const Logo = (props) => {
    const { imageWidth, imageHeight, style } = props;

    return (
        <View style={{
            ...styles.main_container, 
            height: imageHeight, 
            width: imageWidth, 
            ...style
        }}>
            <Image 
                style={{height: imageHeight, width: imageWidth}}
                source={require('../../../assets/images/logo.png')}
                onError={() => {}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    main_container: {
        borderRadius: 10
    }
});

Logo.defaultProps = {
    style: {}
};

Logo.propTypes = {
    imageWidth: PropTypes.number.isRequired,
    imageHeight: PropTypes.number.isRequired,
    style: PropTypes.object
};

export default Logo;
