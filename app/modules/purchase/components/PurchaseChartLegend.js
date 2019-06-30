import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';

const PurchaseChartLegend = (props) => {
    const { BIColor, BGColor, PETColor } = props;

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row'}}>
                <View style={{...styles.indicator, backgroundColor: BIColor}}>
                </View>
                <Text style={{color: 'white'}}>BI</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <View style={{...styles.indicator, backgroundColor: BGColor}}>
                </View>
                <Text style={{color: 'white'}}>BG</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <View style={{...styles.indicator, backgroundColor: PETColor}}>
                </View>
                <Text style={{color: 'white'}}>PET</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10, 
        flexDirection: 'row', 
        justifyContent: 'space-around'
    },
    indicator: {
        marginRight: 5, 
        borderWidth: 1, 
        width: 20, 
        height: 20, 
        borderRadius: 10
    }
});

PurchaseChartLegend.defaultProps = {
    BIColor: `rgba(134, 65, 244, 1)`,
    BGColor: `rgba(34, 165, 244, 1)`,
    PETColor: `rgba(134, 165, 144, 1)`
};

PurchaseChartLegend.propTypes = {
    BIColor: PropTypes.string,
    BGColor: PropTypes.string,
    PETColor: PropTypes.string
};

export default PurchaseChartLegend;
