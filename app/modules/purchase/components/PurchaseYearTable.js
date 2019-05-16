import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';

const renderTable = ({item, index}) => {
    return (
        <View style={{marginTop: 10}}>
            <View style={{flexDirection: 'row'}}>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>{index + 1}</Text>
                </View>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>{item[0]}</Text>
                </View>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>{item[1]}</Text>
                </View>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>{item[2]}</Text>
                </View>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>{item[3]}</Text>
                </View>
            </View>
        </View>
    );
};

const PurchaseYearTable = (props) => {

    const { purchases } = props;

    return (
        <View style={styles.containerStyle}>
            <View style={styles.headStyle}>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>MOIS</Text>
                </View>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>BI</Text>
                </View>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>BG</Text>
                </View>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>PET</Text>
                </View>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>CA</Text>
                </View>
            </View>
            {purchases.length > 0 ?
                <FlatList 
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderTable}
                    data={purchases}
                /> :
                <View style={{marginTop: 50}}>
                    <Text style={styles.textStyle}>Aucun résultat trouvé.</Text>
                </View>
            }      
        </View>
    );
}

PurchaseYearTable.defaultProps = {
    purchases: []
};

PurchaseYearTable.propTypes = {
    purchases: PropTypes.array
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
});

export default PurchaseYearTable;
