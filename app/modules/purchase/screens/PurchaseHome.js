import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

import MainView from '../../core/layout/MainView';
import MainHeader from '../../core/layout/MainHeader';

class PurchaseHome extends Component {

    _onGoToScreen = (screen) => {
        const { navigation } = this.props;

        navigation.navigate(screen);
    }

    render() {
        const { navigation } = this.props;

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_no_line.png')}>
                <View style={styles.headerStyle}>
                    <MainHeader 
                        title="historique des achats"
                        uri={require('../../../assets/images/purchase.png')}
                        navigation={navigation}
                    />
                </View>
                <View style={styles.menuStyle}>
                    <Button 
                        title={"historique des achats du mois".toUpperCase()}
                        titleStyle={{color: 'white'}}
                        buttonStyle={styles.buttonStyle}
                        containerStyle={styles.buttonContainerStyle}
                        onPress={() => this._onGoToScreen('PurchaseMonth')}
                    />
                    <Button 
                        title={"historique des achats de l'année".toUpperCase()}
                        titleStyle={{color: 'white'}}
                        buttonStyle={styles.buttonStyle}
                        containerStyle={styles.buttonContainerStyle}
                        onPress={() => this._onGoToScreen('PurchaseYear')}
                    />
                    <Button 
                        title={"historique des remises".toUpperCase()}
                        titleStyle={{color: 'white'}}
                        buttonStyle={styles.buttonStyle}
                        containerStyle={styles.buttonContainerStyle}
                        onPress={() => this._onGoToScreen('PurchaseDiscount')}
                    />    
                </View>
            </MainView>
        );
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        flex: 1,
        paddingTop: '7%'
    },
    menuStyle: {
        flex: 2,
        paddingTop: '10%'
    },
    buttonContainerStyle: {
        marginBottom: '10%', 
        marginHorizontal: '5%'
    },
    buttonStyle: {
        backgroundColor: '#7B7C9E', 
        borderRadius: 5
    }
}); 

export default PurchaseHome;