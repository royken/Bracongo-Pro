import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';

const element = (products, index) => (
    <View style={styles.panelBottomStyle}>
        <Text style={{color: '#00151C'}} numberOfLines={5}>
        {isArray(products) ? products.join(" ") : ""}
        </Text>
    </View>
);

const PurchaseMonthTable = (props) => {

    const { head, purchases } = props;

    return (
        <View style={styles.containerStyle}>
            
        </View>
    );

}

PurchaseMonthTable.defaultProps = {
    purchases: []
};

PurchaseMonthTable.propTypes = {
    head: PropTypes.array.isRequired,
    purchases: PropTypes.array
};

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        marginTop: 20
    },
    headStyle: {
        height: 40,  
        backgroundColor: '#7B7C9E'
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

export default PurchaseMonthTable;
