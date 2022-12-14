import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { getMonthDiscountAndTurnoverByDate, cancelRequest } from '../../../store/actions';

import MainView from '../../core/layout/MainView';
import MainHeader from '../../core/layout/MainHeader';
import Spinner from '../../core/layout/Spinner';
import MYCalendar from '../../core/layout/MYCalendar';
import PurchaseDiscountTable from '../components/PurchaseDiscountTable';

const dimTurnoverContent = wp("30%") + hp("10%");

class PurchaseDiscount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showCalendar: false,
        };
    }

    componentDidMount() {
        const { getMonthDiscountAndTurnoverByDate, profile } = this.props;

        getMonthDiscountAndTurnoverByDate(profile.numero, profile.password);
    }

    componentWillUnmount() {
        const { cancelRequest } = this.props;

        cancelRequest();
    }

    _getDiscountAndTurnoverByDate = (selectedMonth, selectedYear) => {
        const { getMonthDiscountAndTurnoverByDate, profile } = this.props;

        getMonthDiscountAndTurnoverByDate(
            profile.numero, 
            profile.password, 
            selectedYear, 
            selectedMonth,
            false
        );
    
    }

    _handleShowCalendar() {
        this.setState({ showCalendar: true });
    }

    _handleHideCalendar = () => {
        this.setState({ showCalendar: false });
    }

    render() {
        const { navigation, isLoading, turnover, discount, discounts } = this.props;
        const { showCalendar } = this.state;

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_no_line.png')}>
                <MainHeader 
                    title="historique des r??mises"
                    uri={require('../../../assets/images/purchase.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                />
                <View style={styles.dateContainerStyle}>
                    <Button 
                        buttonStyle={{backgroundColor: "#7B7C9E"}}
                        titleStyle={{color: "white"}}
                        title="Choisir une date" 
                        onPress={() => this._handleShowCalendar()} 
                    />
                </View>
                <MYCalendar 
                    headerBackgroundColor="#7B7C9E"
                    btnTextConfirmColor="#7B7C9E"
                    btnTextCancelColor="#7B7C9E"
                    selectedBackgroundColor="#7B7C9E"
                    hide={this._handleHideCalendar} 
                    isVisible={showCalendar} 
                    confirm={this._getDiscountAndTurnoverByDate} 
                />
                <ScrollView style={styles.contentContainerStyle}>
                    <View style={styles.turnoverStyle}>
                        <View style={styles.turnoverContentStyle}>
                            {isLoading ? 
                                <Spinner containerStyle={{alignItems: 'center'}} 
                                    color="blue" />
                                :
                                <View>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={{color: 'white'}}>Remise</Text>
                                        <Text style={{color: 'white'}}>{discount} FC</Text>
                                    </View>
                                    <View style={{alignItems: 'center', marginTop: "7%"}}>
                                        <Text style={{color: 'white'}}>Chiffre d'affaire</Text>
                                        <Text style={{color: 'white'}}>{turnover} FC</Text>
                                    </View>
                                </View>
                            }
                        </View>
                    </View> 
                    <PurchaseDiscountTable discounts={discounts} />
                </ScrollView>
            </MainView>
        );
    }
}

const styles = StyleSheet.create({
    contentContainerStyle: {
        marginHorizontal: 5
    },
    dateContainerStyle: {
        alignItems: 'center',
        marginHorizontal: "15%",
        marginTop: 40
    },
    turnoverStyle: {
        marginTop: "5%",
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
    }
});

const mapStateToProps = (state) => ({
    profile: state.profile,
    isLoading: state.uiLoading.isLoading,
    turnover: state.purchases.turnover,
    discount: state.purchases.discount,
    discounts: state.purchases.discounts
});

const mapActionsToProps = {getMonthDiscountAndTurnoverByDate, cancelRequest};

export default connect(mapStateToProps, mapActionsToProps)(PurchaseDiscount);