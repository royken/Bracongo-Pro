import React, { Component, Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import MainView from '../../../core/layout/MainView';
import { ButtonGroup, Text, Icon } from 'react-native-elements';
import PurchaseMonthTable from './PurchaseMonthTable';
import PurchaseMonthChart from './PurchaseMonthChart';
import PurchaseMonthDetails from './PurchaseMonthDetails';
import MainHeader from '../../../core/layout/MainHeader';
import { getMonthPurchases } from '../actions/actions';
import Spinner from '../../../core/layout/Spinner';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class PurchaseMonth extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0
        };
    }

    componentDidMount() {
        const { getMonthPurchases, profile } = this.props;

        getMonthPurchases(profile.numero, profile.password);
    }

    _updateIndex = (selectedIndex) => {
        this.setState({selectedIndex});
    }

    tableLabel = () => {
        const { selectedIndex } = this.state;
        const color = selectedIndex === 0 ? 'white' : '#00151C';
        
        return (
            <View>
                <Icon type="font-awesome" name="table" iconStyle={{color: color}} />
                <Text style={{color: color}}>Tableau</Text>
            </View>
        );
    }

    chartLabel = () => {
        const { selectedIndex } = this.state;
        const color = selectedIndex === 1 ? 'white' : '#00151C';

        return (
            <View>
                <Icon type="font-awesome" name="line-chart" iconStyle={{color: color}} />
                <Text style={{color: color}}>Graphe</Text>
            </View>
        );
    }
    
    detailsLabel = () => {
        const { selectedIndex } = this.state;
        const color = selectedIndex === 2 ? 'white' : '#00151C';

        return (
            <View>
                <Icon type="font-awesome" name="info-circle" iconStyle={{color: color}} />
                <Text style={{color: color}}>
                Détails par produit
                </Text>
            </View>
        );
    }

    render() {
        const { navigation, isLoading, purchases, products } = this.props;
        const { selectedIndex } = this.state;
        const buttons = [
            { element: this.tableLabel }, 
            { element: this.chartLabel }, 
            { element: this.detailsLabel }
        ]; 

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_no_line.png')}>
                <MainHeader 
                    title="historique des achats du mois"
                    uri={require('../../../assets/images/purchase.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                />
                {isLoading ?
                    <Spinner containerStyle={{marginTop: 150, alignItems: 'center'}} 
                        color="blue" /> :
                    <Fragment>
                        <View style={styles.contentContainerStyle}>
                        {
                            selectedIndex === 0 ?
                            <PurchaseMonthTable purchases={purchases} /> :
                            selectedIndex === 1 ? 
                            <PurchaseMonthChart purchases={purchases} /> :
                            <PurchaseMonthDetails products={products} />  
                        }
                        </View>
                        <ButtonGroup 
                            onPress={this._updateIndex}
                            buttons={buttons}
                            buttonStyle={{marginHorizontal: 0}}
                            selectedButtonStyle={{backgroundColor: '#7B7C9E'}}
                            selectedIndex={selectedIndex}
                            containerStyle={styles.tabButtonContainerStyle}
                        />
                    </Fragment>
                }
            </MainView>
        );
    }
}

const styles = StyleSheet.create({
    contentContainerStyle: {
        marginHorizontal: 5,
        flex: 1
    },
    tabButtonContainerStyle: {
        height: 50, 
        justifyContent: 'flex-end', 
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0
    }
});

PurchaseMonth.defaultProps = {
    purchases: []
};

PurchaseMonth.propTypes = {
    purchases: PropTypes.array
};

const mapStateToProps = (state) => ({
    profile: state.profile,
    isLoading: state.uiLoading.isLoading,
    purchases: state.purchases.purchasesMonth,
    products: state.purchases.products
});

export default connect(mapStateToProps, { getMonthPurchases })(PurchaseMonth);