import React, { Component, Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text, ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getYearPurchases, cancelRequest } from '../../../store/actions';

import MainView from '../../core/layout/MainView';
import PurchaseYearTable from '../components/PurchaseYearTable';
import PurchaseYearChart from '../components/PurchaseYearChart';
import MainHeader from '../../core/layout/MainHeader';
import Spinner from '../../core/layout/Spinner';

class PurchaseYear extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0
        };
    }

    componentDidMount() {
        const { getYearPurchases, profile } = this.props;
        
        getYearPurchases(profile.numero, profile.password);
    }

    componentWillUnmount() {
        const { cancelRequest } = this.props;

        cancelRequest();
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
    
    render() {
        const { navigation, purchases, isLoading } = this.props;
        const { selectedIndex } = this.state;
        const buttons = [
            { element: this.tableLabel }, 
            { element: this.chartLabel }, 
        ]; 

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_no_line.png')}>
                <MainHeader 
                    title="historique des achats de l'année"
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
                            <PurchaseYearTable purchases={purchases} /> :
                            <PurchaseYearChart purchases={purchases} />   
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

PurchaseYear.defaultProps = {
    purchases: []
};

PurchaseYear.propTypes = {
    purchases: PropTypes.array
};

const mapStateToProps = (state) => ({
    profile: state.profile,
    isLoading: state.uiLoading.isLoading,
    purchases: state.purchases.purchasesYear
});

const mapActionsToProps = { 
    getYearPurchases, 
    cancelRequest 
};

export default connect(mapStateToProps, mapActionsToProps)(PurchaseYear);