import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';

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
            <View style={styles.panelBottomStyle}>
                <Text style={{color: '#00151C'}} numberOfLines={5}>
                    {
                        isArray(item[4]) ?
                        item[4].map((subItem, subIndex) => {
                            return (
                                <Text key={subIndex}>
                                    {subItem.name} : {subItem.amount}
                                    {(item[4].length - 1) === subIndex ? "" : ", "}
                                </Text>
                            )
                        }) : ""
                    }
                </Text>
            </View>
        </View>
    );
};

const PurchaseMonthTable = (props) => {

    const { purchases } = props;

    return (
        <View style={styles.containerStyle}>
            <View style={styles.headStyle}>
                <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>JOUR</Text>
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

PurchaseMonthTable.defaultProps = {
    purchases: []
};

PurchaseMonthTable.propTypes = {
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
    panelBottomStyle: {
        backgroundColor: 'white', 
        marginTop: 2, 
        marginHorizontal: 10,
        padding: 5
    }
});

export default PurchaseMonthTable;
