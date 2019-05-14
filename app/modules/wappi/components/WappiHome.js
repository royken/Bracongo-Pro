import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MainView from '../../../core/layout/MainView';
import MainHeader from '../../../core/layout/MainHeader';
import { Image, Text, Icon } from 'react-native-elements';
import IconWithText from '../../../core/layout/IconWithText';

const deviceWidth = Dimensions.get('window').width;
const photoHeigth = deviceWidth / 2;

class WappiHome extends Component {
    render() {
        const { navigation } = this.props;

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_line_bottom.png')}>
                <MainHeader 
                    title="position de mon camion vendeur"
                    uri={require('../../../assets/images/wappi.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                    showTitle={false}
                />
                <Image 
                    containerStyle={{marginTop: "3%", marginHorizontal: 0}}
                    source={require('../../../assets/images/test.jpg')}
                    onError={() => {}}
                    style={{width: "100%", height: photoHeigth}}
                />
                <View style={{marginTop: "10%", marginHorizontal: 20}}>
                    <Text style={{color: 'white'}} numberOfLines={7}>
                        Description: Situé dans la commune de Lemba, l'un des coins les plus
                        hot de Kinshasa, le bar température 40 régule la météo de l'ambiance de
                        "Lemba, c'Miami" hot de Kinshasa, le bar température 40 régule la météo de l'ambiance de
                        "Lemba, c'Miami" hot de Kinshasa, le bar température 40 régule la météo de l'ambiance de
                        "Lemba, c'Miami" hot de Kinshasa, le bar température température
                    </Text>
                    <View style={{alignItems: 'flex-end', marginTop: 2}}>
                        <Icon type="font-awesome" 
                            name="edit" 
                            onPress={() => {}} 
                            iconStyle={{color: 'white'}}
                        />
                    </View>
                </View>
                <View style={styles.menuStyle}>
                    <IconWithText 
                        title="Promotions"
                        titleStyle={{color: 'white'}}
                        iconStyle={{color: 'white'}}
                        type="font-awesome"
                        name="gift"
                        boxShadow={false}
                        size={50}
                        containerStyle={{alignItems: "center", flex: 1}}
                        onPress={() => {}}
                    />
                    <IconWithText 
                        title="Photos"
                        titleStyle={{color: 'white'}}
                        type="font-awesome"
                        name="photo"
                        boxShadow={false}
                        iconStyle={{color: 'white'}}
                        size={50}
                        containerStyle={{alignItems: "center", flex: 1}}
                        onPress={() => {}}
                    />
                    <IconWithText 
                        title="Avis"
                        titleStyle={{color: 'white'}}
                        type="font-awesome"
                        name="comments"
                        boxShadow={false}
                        iconStyle={{color: 'white'}}
                        size={50}
                        containerStyle={{alignItems: "center", flex: 1}}
                        onPress={() => {}}
                    />
                </View>
            </MainView>
        );
    }
}

const styles = StyleSheet.create({
    menuStyle: {
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginTop: "10%"
    }
});

export default WappiHome;