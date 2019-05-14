import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import MainView from '../../../core/layout/MainView';
import MainHeader from '../../../core/layout/MainHeader';

class VanHome extends Component {
    render() {
        const { navigation } = this.props;

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_no_line.png')}>
                <MainHeader 
                    title="position de mon camion vendeur"
                    uri={require('../../../assets/images/van.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                />
                <View>

                </View>
            </MainView>
        );
    } 
}

export default VanHome;