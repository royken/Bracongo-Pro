import React, { Component } from 'react';
import { View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Icon, Image, Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import { getActiveRouteName } from '../../utils/navigationHelper';
import { connect } from 'react-redux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

class MainHeader extends Component {
    
    _isMainScreens = (currentScreen) => {
        if(currentScreen === 'PurchaseHome' ||
            currentScreen === 'MessageHome' ||
            currentScreen === 'VanHome' ||
            currentScreen === 'WappiHome'
        ) {
            return true;
        } else {
            return false;
        }
    }

    _onGoBack = (navigation, willGoToHome) => {

        if(willGoToHome) {
            navigation.navigate('Home');
        } else {
            navigation.dispatch(NavigationActions.back());
        }
    }

    render() {
        const { profile, title, uri, navigation, containerStyle, showTitle } = this.props;
        const currentScreen = getActiveRouteName(navigation.state);
        const willGoToHome = this._isMainScreens(currentScreen);
        const willHideIcon = currentScreen === "WappiHome" && 
                             profile.isLoaded === true && 
                             profile.ventes === false;

        return (
            <View style={containerStyle}>
                {!willHideIcon ?
                    <Icon 
                        type="font-awesome"
                        name={willGoToHome ? 'home' : 'arrow-left'}
                        iconStyle={{color: 'white'}}
                        containerStyle={{alignItems: 'flex-start', marginHorizontal: '7%'}}
                        onPress={() => this._onGoBack(navigation, willGoToHome)}
                    /> : null
                }
                
                <View style={{marginTop: '1%', alignItems: 'center'}}>
                    <Image 
                        source={uri}
                        onError={() => {}}
                        style={{borderRadius: wp("3%"), width: wp("15%"), height: hp("9%")}}
                    />
                    {showTitle &&
                        <View style={{
                            marginTop: '3%', 
                            backgroundColor: '#7B7C9E',
                            borderRadius: 25,
                            height: hp("7%"),
                            width: wp("80%"),
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>
                                {title.toUpperCase()}
                            </Text>
                        </View>
                    }
                </View>
            </View>
        );  
    }
}

MainHeader.defaultProps = {
    containerStyle: null,
    showTitle: true
};

MainHeader.propTypes = {
    title: PropTypes.string.isRequired,
    uri: PropTypes.any.isRequired,
    navigation: PropTypes.object.isRequired,
    containerStyle: PropTypes.object,
    showTitle: PropTypes.bool
};

const mapStateToProps = (state) => ({
    profile: state.profile
});

export default connect(mapStateToProps)(MainHeader);
