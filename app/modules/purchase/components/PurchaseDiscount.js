import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MainView from '../../../core/layout/MainView';

import { Icon } from 'react-native-elements';
import MainHeader from '../../../core/layout/MainHeader';

class PurchaseDiscount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dateMonth: '01-2017'
        };
    }

    _handleDatePickedMonth(date) {
        this.setState({ dateMonth: date });
    }

    render() {
        const { navigation } = this.props;
        const { dateMonth } = this.state;

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_no_line.png')}>
                <MainHeader 
                    title="historique des rémises"
                    uri={require('../../../assets/images/purchase.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                />
                <View style={styles.dateContainerStyle}>
                    
                </View>
                <View style={styles.contentContainerStyle}>
                    <View style={styles.turnoverStyle}>
                        <View style={styles.turnoverContentStyle}>
                            <View style={{alignItems: 'center', marginTop: '25%'}}>
                                <Text style={{color: 'white'}}>Remise</Text>
                                <Text style={{color: 'white'}}>250 000 Fcfa</Text>
                            </View>
                            <View style={{alignItems: 'center', marginTop: 20}}>
                                <Text style={{color: 'white'}}>Chiffre d'affaire:</Text>
                                <Text style={{color: 'white'}}>4 565 000 Fcfa</Text>
                            </View>
                        </View>
                    </View> 
                </View>
            </MainView>
        );
    }
}

const styles = StyleSheet.create({
    contentContainerStyle: {
        marginHorizontal: 5
    },
    dateContainerStyle: {
        alignItems: 'center'
    },
    turnoverStyle: {
        marginTop: "5%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    turnoverContentStyle: {
        borderColor: 'white', 
        borderWidth: 3,
        width: 220,
        height: 220,
        borderRadius: 110,
        alignItems: 'center'
    }
});

export default PurchaseDiscount;