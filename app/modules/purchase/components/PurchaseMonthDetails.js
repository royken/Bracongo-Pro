import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';

const data = [
    ['SKOL 50CL', 15],
    ['SKOL 72CL', 15],
    ['DOPPEL 50CL', 15],
    ['BEAUFORT 50CL', 15],
    ['TEMBO 50CL', 15]
];

const _renderItem = ({ item }) => (
    <View style={styles.productContainerStyle}>
        <View style={styles.producTitleStyle}>
            <Text style={{color: 'white'}}>{item[0] + "".toUpperCase()}</Text>
        </View>
        <View><Text style={{color: 'white'}}>{item[1]}</Text></View>
    </View> 
);

const PurchaseMonthDetails = (props) => {
    
    return (
        <View style={styles.containerStyle}>
            <FlatList 
                renderItem={_renderItem}
                keyExtractor={(item, index) => index.toString()}
                data={data}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        marginTop: 20
    },
    productContainerStyle: {
        flexDirection: 'row', 
        marginVertical: 5, 
        marginHorizontal: 10, 
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    producTitleStyle: {
        borderRadius: 10, 
        backgroundColor: '#7B7C9E', 
        width: "40%", 
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default PurchaseMonthDetails;
