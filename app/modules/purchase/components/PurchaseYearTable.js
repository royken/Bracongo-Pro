import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

const PurchaseYearTable = (props) => {
    const { head, data } = props;

    return (
        <View style={styles.containerStyle}>
            
        </View>
    ); 
}

PurchaseYearTable.defaultProps = {
    data: []
};

PurchaseYearTable.propTypes = {
    head: PropTypes.array.isRequired,
    data: PropTypes.array
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
    }
});

export default PurchaseYearTable;
