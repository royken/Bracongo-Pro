import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import PropTypes from 'prop-types';

const _renderItem = ({ item }) => (
    <View style={styles.productContainerStyle}>
        <View style={styles.producTitleStyle}>
            <Text style={{color: 'white'}}>{item.name + "".toUpperCase()}</Text>
        </View>
        <View><Text style={{color: 'white'}}>{item.amount}</Text></View>
    </View> 
);

const PurchaseMonthDetails = (props) => {
    const { products } = props;

    return (
        <View style={styles.containerStyle}>
            {products.length > 0 ?
                <FlatList 
                    renderItem={_renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    data={products}
                /> :
                <View style={{marginTop: 50}}>
                    <Text style={{textAlign: 'center', color: 'white'}}>
                        Aucun résultat trouvé.
                    </Text>
                </View>
            }
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
        width: "70%", 
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

PurchaseMonthDetails.defaultProps = {
    products: []
};

PurchaseMonthDetails.propTypes = {
    products: PropTypes.array
};

export default PurchaseMonthDetails;
