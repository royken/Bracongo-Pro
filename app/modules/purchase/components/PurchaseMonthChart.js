import React from 'react';
import { StyleSheet, View, Dimensions, processColor } from 'react-native';
import PropTypes from 'prop-types';

const deviceWidth = Dimensions.get('window').width;

const getDays = () => {
    const dayOfMonth = (new Date()).getDate();
    let i = 1;

    return Array(dayOfMonth).fill().map(() => i++);
}

const xAxis = {
    granularityEnabled: true,
    granularity: 1,
};

const PurchaseMonthChart = (props) => {
    
    const { purchases } = props;
    
    const bi = []; const bg = []; const pet = []; 
    
    purchases.map((element, index) => {
        bi.push({x: index + 1, y: element[0]});
        bg.push({x: index + 1, y: element[1]});
        pet.push({x: index + 1, y: element[2]});
    });

    return (
        <View style={styles.containerStyle}>
            
        </View>
    );
}

PurchaseMonthChart.defaultProps = {
    purchases: []
};

PurchaseMonthChart.propTypes = {
    purchases: PropTypes.array
};

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        marginTop: 50,
        backgroundColor: 'white'
    }
});

export default PurchaseMonthChart;
