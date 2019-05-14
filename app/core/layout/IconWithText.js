import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon, Text, Image } from 'react-native-elements';
import PropTypes from 'prop-types';

const IconWithText = (props) => {
    const { title, titleStyle, containerStyle, containerTitleStyle, 
        withImage, imageUrl, imageStyle, iconContainerStyle, boxShadow } = props;

    return (
        <View style={containerStyle}>
            {withImage ?
                <TouchableOpacity {...props}>
                    <Image 
                        style={imageStyle}
                        source={imageUrl}
                        onError={() => {}}
                    /> 
                </TouchableOpacity> :
                <Icon {...props} 
                    raised={boxShadow} 
                    containerStyle={iconContainerStyle} 
                />
            }
            
            {title !== null &&
                <View style={containerTitleStyle}>
                    <Text style={titleStyle}>{title}</Text>
                </View>
            }
        </View>
    );
}

IconWithText.defaultProps = {
    titleStyle: null,
    title: null,
    boxShadow: true,
    containerTitleStyle: null,
    iconContainerStyle: null,
    containerStyle: { alignItems: "center", backgroundColor: 'white' },
    withImage: false,
    imageUrl: "undefined",
    imageStyle: null
}

IconWithText.propTypes = {
    titleStyle: PropTypes.object,
    title: PropTypes.string,
    containerStyle: PropTypes.object,
    boxShadow: PropTypes.bool,
    containerTitleStyle: PropTypes.object,
    withImage: PropTypes.bool,
    imageUrl: PropTypes.any,
    imageStyle: PropTypes.object
};

export default IconWithText;
