import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { signOut, cancelRequest, getDiscountAndTurnover } from '../../../store/actions';
import { getHighLigthColor } from '../../profile/profileHelper';

import MainView from '../layout/MainView';
import Logo from '../layout/Logo';
import IconWithText from '../layout/IconWithText';
import Spinner from '../layout/Spinner';

const dimIconMenu = wp("9%") + hp("5%");
const dimTurnoverContent = wp("30%") + hp("10%");
const dimLogo = hp("5%") + wp("7%");

class Home extends Component {

    componentDidMount() {
        const { profile, getDiscountAndTurnover } = this.props;

        getDiscountAndTurnover(profile.numero, profile.password);
    }

    componentWillUnmount() {
        const { cancelRequest } = this.props;
        
        cancelRequest();
    }

    _onGoToScreen = (screen) => {
        const { navigation } = this.props;

        navigation.navigate(screen);
    }

    render() {
        const { profile, isLoading, signOut, navigation } = this.props;
        const { turnover, discount, categorie } = profile;
        const catColor = getHighLigthColor(categorie);

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_line_bottom.png')}>
                <View style={styles.headerStyle} >
                    <View style={{alignItems: 'center'}}>
                        <Logo imageHeight={dimLogo} imageWidth={dimLogo} />
                    </View>
                    <View style={styles.metalsStyle}>
                        <Text style={{color: catColor.bronze}}>{"bronze - ".toUpperCase()}</Text>
                        <Text style={{color: catColor.argent}}>{"argent - ".toUpperCase()}</Text>
                        <Text style={{color: catColor.or}}>{"or - ".toUpperCase()}</Text>     
                        <Text style={{color: catColor.diamant}}>{"diamant".toUpperCase()}</Text>
                    </View>
                </View>
                <View style={styles.turnoverStyle}>
                    <View style={styles.turnoverContentStyle}>
                        {isLoading ? 
                            <Spinner containerStyle={{alignItems: 'center'}} 
                                color="blue" />
                            :
                            <View>
                                <View style={{alignItems: 'center'}}>
                                    <Text style={{color: 'white'}}>Remise</Text>
                                    <Text style={{color: 'white'}}>
                                        {discount ? discount : 0} FC</Text>
                                </View>
                                <View style={{alignItems: 'center', marginTop: "7%"}}>
                                    <Text style={{color: 'white'}}>Chiffre d'affaire</Text>
                                    <Text style={{color: 'white'}}>
                                        {turnover ? turnover : 0} FC</Text>
                                </View>
                            </View>
                        }
                    </View>
                </View>
                <View style={styles.menuStyle}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <View>
                            {profile.yaka === true &&
                                <IconWithText 
                                    withImage={true}
                                    title="Yaka"
                                    titleStyle={{color: 'white'}}
                                    imageStyle={styles.iconMenu}
                                    imageUrl={require('../../../assets/images/wappi.png')}
                                    containerStyle={{alignItems: "center"}}
                                    onPress={() => this._onGoToScreen('WappiHome')}
                                />
                            }
                            <IconWithText 
                                withImage={true}
                                title={"camion".toUpperCase()}
                                titleStyle={{color: 'white'}}
                                imageStyle={styles.iconMenu}
                                imageUrl={require('../../../assets/images/van.png')}
                                containerStyle={{alignItems: "center", marginTop: profile.yaka === true ? 15 : 0}}
                                onPress={() => this._onGoToScreen('VanHome')}
                            />
                        </View>
                        <View>
                            <IconWithText 
                                withImage={true}
                                title={"achat".toUpperCase()}
                                titleStyle={{color: 'white'}}
                                imageStyle={styles.iconMenu}
                                imageUrl={require('../../../assets/images/purchase.png')}
                                containerStyle={{alignItems: "center"}}
                                onPress={() => this._onGoToScreen("PurchaseHome")}
                            />
                            <IconWithText 
                                withImage={true}
                                title={"message".toUpperCase()}
                                titleStyle={{color: 'white'}}
                                imageStyle={styles.iconMenu}
                                imageUrl={require('../../../assets/images/message.png')}
                                containerStyle={{alignItems: "center", marginTop: 15}}
                                onPress={() => this._onGoToScreen("MessageHome")}
                            />
                        </View>
                        <View style={{justifyContent: 'space-around'}}>
                            <IconWithText 
                                withImage={true}
                                title={"plainte".toUpperCase()}
                                titleStyle={{color: 'white'}}
                                imageStyle={styles.iconMenu}
                                imageUrl={require('../../../assets/images/complaint.png')}
                                containerStyle={{alignItems: "center"}}
                                onPress={() => this._onGoToScreen("ComplaintHome")}
                            />
                            <IconWithText 
                                withImage={true}
                                title={"commande".toUpperCase()}
                                titleStyle={{color: 'white', fontSize: 13}}
                                imageStyle={styles.iconMenu}
                                imageUrl={require('../../../assets/images/special_order.png')}
                                containerStyle={{alignItems: "center", marginTop: 15}}
                                onPress={() => this._onGoToScreen("OrderHome")}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.logoutStyle}>
                    <Icon 
                        type="font-awesome" 
                        name="sign-out"
                        iconStyle={{color: "white"}}
                        containerStyle={styles.logoutIconStyle}
                        onPress={() => { signOut().then(() => navigation.navigate("SignIn")); }} 
                    />
                </View>
            </MainView>
        );
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 50
    },
    turnoverStyle: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    turnoverContentStyle: {
        borderColor: 'white', 
        borderWidth: 3,
        width: dimTurnoverContent, 
        height: dimTurnoverContent, 
        borderRadius: Math.floor(dimTurnoverContent / 2), 
        alignItems: 'center',
        justifyContent: 'center'
    },
    menuStyle: {
        flex: 2,
        justifyContent: 'flex-end',
        paddingBottom: 10
    },
    metalsStyle: {
        flexDirection: 'row', 
        justifyContent: 'center',
        marginTop: 10
    },
    logoutStyle: {
        position: "absolute",
        top: hp("2%"),
        bottom: 0,
        left: wp("2%"),
        right: 0
    },
    logoutIconStyle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "transparent"
    },
    iconMenu: {
        width: dimIconMenu, 
        height: dimIconMenu,
        borderRadius: Math.floor(dimIconMenu / 2)
    }
});

const mapStateToProps = (state) => ({
    profile: state.profile,
    isLoading: state.uiLoading.isLoading
}); 

const mapActionsToProps = { 
    getDiscountAndTurnover, 
    cancelRequest, 
    signOut 
};

export default connect(mapStateToProps, mapActionsToProps)(Home);