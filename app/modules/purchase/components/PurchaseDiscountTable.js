import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { toInteger } from 'lodash';

const months = [
    'Jan',
    'Fev',
    'Mars',
    'Avr',
    'Mai',
    'Juin',
    'Juil',
    'Août',
    'Sept',
    'Oct',
    'Nov',
    'Dec'
];

const renderTable = ({item, index}) => {
    return (
        <View style={{marginTop: 10}}>
            <View style={{flexDirection: 'row'}}>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>{months[toInteger(item.mois) - 1]}</Text>
                </View>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>{item.remise}</Text>
                </View>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>{item.chiffreAffaire}</Text>
                </View>
            </View>
        </View>
    );
};

const PurchaseDiscountTable = (props) => {

    const { discounts } = props;

    return (
        <View style={styles.containerStyle}>
            <View style={styles.headStyle}>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>Mois</Text>
                </View>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>Remise</Text>
                </View>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>Chiffre d'affaire</Text>
                </View>
            </View>
            {discounts.length > 0 ?
                <FlatList 
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderTable}
                    data={discounts}
                /> :
                <View style={{marginTop: 50}}>
                    <Text style={styles.textStyle}>Aucun résultat trouvé.</Text>
                </View>
            }      
        </View>
    );

}

PurchaseDiscountTable.defaultProps = {
    discounts: []
};

PurchaseDiscountTable.propTypes = {
    discounts: PropTypes.array
};

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        marginTop: 20,
        paddingBottom: 5
    },
    headStyle: {
        height: 40,  
        backgroundColor: '#7B7C9E',
        flexDirection: 'row'
    },
    textContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        textAlign: 'center',
        color: 'white'
    },
    panelBottomStyle: {
        backgroundColor: 'white', 
        marginTop: 2, 
        marginHorizontal: 10,
        padding: 5
    }
});

export default PurchaseDiscountTable;
