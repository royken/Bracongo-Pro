import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';
import MainView from '../../../core/layout/MainView';
import { getMonthDiscountAndTurnoverByDate } from '../actions/actions';
import MainHeader from '../../../core/layout/MainHeader';
import Spinner from '../../../core/layout/Spinner';
import MYCalendar from '../../../core/layout/MYCalendar';
import { Button } from 'react-native-elements';
import { cancelRequest } from '../../../core/actions/actions';

class PurchaseDiscount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showCalendar: false,
        };
    }

    componentDidMount() {
        const { getMonthDiscountAndTurnoverByDate, profile } = this.props;

        getMonthDiscountAndTurnoverByDate(profile.numero, profile.password, null, null);
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
            selectedMonth
        );
    
    }

    _handleShowCalendar() {
        this.setState({ showCalendar: true });
    }

    _handleHideCalendar = () => {
        this.setState({ showCalendar: false });
    }

    render() {
        const { navigation, isLoading, turnover, discount } = this.props;
        const { showCalendar } = this.state;

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
                <View style={styles.contentContainerStyle}>
                    <View style={styles.turnoverStyle}>
                        <View style={styles.turnoverContentStyle}>
                            {isLoading ? 
                                <Spinner containerStyle={{marginTop: "40%", alignItems: 'center'}} 
                                    color="blue" />
                                :
                                <View>
                                    <View style={{alignItems: 'center', marginTop: '25%'}}>
                                        <Text style={{color: 'white'}}>Remise</Text>
                                        <Text style={{color: 'white'}}>{discount} FC</Text>
                                    </View>
                                    <View style={{alignItems: 'center', marginTop: 20}}>
                                        <Text style={{color: 'white'}}>Chiffre d'affaire:</Text>
                                        <Text style={{color: 'white'}}>{turnover} FC</Text>
                                    </View>
                                </View>
                            }
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
        width: 220,
        height: 220,
        borderRadius: 110,
        alignItems: 'center'
    }
});

const mapStateToProps = (state) => ({
    profile: state.profile,
    isLoading: state.uiLoading.isLoading,
    turnover: state.purchases.turnover,
    discount: state.purchases.discount
});

export default connect(mapStateToProps, { getMonthDiscountAndTurnoverByDate, cancelRequest })(PurchaseDiscount);