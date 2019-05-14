import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ImageBackground, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const deviceDimwidth = Dimensions.get('window').width;

const MainView = (props) => {
    const { backgroundImageUri } = props; 

    return (
        <SafeAreaView style={styles.main_container}>
            <ImageBackground
                style={{flex: 1, width: deviceDimwidth}}
                source={backgroundImageUri} 
                onError={() => {}}
            >
                <StatusBar
                    barStyle="default"
                    backgroundColor="transparent"
                    translucent={true}
                />
                {props.children}
            </ImageBackground>
        </SafeAreaView>
    ) 
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    }
});

MainView.propTypes = {
    backgroundImageUri: PropTypes.any.isRequired
};

export default MainView;
