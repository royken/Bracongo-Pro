import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

const Spinner = (props) => {
    const { containerStyle, color } = props;

    return (
        <View style={containerStyle}>
            <ActivityIndicator color={color} size='large' />
        </View>
    );
}

Spinner.defaultProps = {
    containerStyle: {},
    color: "white"
};

Spinner.propTypes = {
    containerStyle: PropTypes.object,
    color: PropTypes.string
};

export default Spinner;
