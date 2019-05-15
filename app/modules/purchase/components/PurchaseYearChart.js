import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { LineChart } from 'react-native-chart-kit';

const deviceWidth = Dimensions.get('window').width;

const PurchaseYearChart = (props) => {
    const { purchases } = props;
    
    const bi = []; const bg = []; const pet = []; const mois = [];
    
    if(purchases.length > 0) {
        
        purchases.map((element, index) => {
            mois.push(index + 1);
            bi.push(element[0]);
            bg.push(element[1]);
            pet.push(element[2]);
        });

    } else {

        for(let i = 1; i <= (new Date).getMonth(); i++) {
            bi.push(0);
            bg.push(0);
            pet.push(0);
            mois.push(i);
        } 

    }

    return (
        <View style={styles.containerStyle}>
             <LineChart 
                data={{
                    labels: mois,
                    datasets: [
                        {
                            data: bi,
                            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, 
                            strokeWidth: 2 
                        },
                        {
                            data: bg,
                            color: (opacity = 1) => `rgba(34, 165, 244, ${opacity})`, 
                            strokeWidth: 2 
                        },
                        {
                            data: pet,
                            color: (opacity = 1) => `rgba(134, 165, 144, ${opacity})`, 
                            strokeWidth: 2 
                        }
                    ]
                }}
                width={deviceWidth} 
                height={220}
                chartConfig={{
                    backgroundColor: '#7B7C9E',
                    backgroundGradientFrom: '#7B7C9E',
                    backgroundGradientTo: '#00151C',
                    decimalPlaces: 2, 
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    );
}

PurchaseYearChart.defaultProps = {
    purchases: []
};

PurchaseYearChart.propTypes = {
    purchases: PropTypes.array
};

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        marginTop: 50
    }
});

export default PurchaseYearChart;
