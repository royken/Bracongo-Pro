import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

const ComplaintItem = (props) => {
    const { description, type, datePlainte } = props.complaint;

    return (
        <View style={styles.containerStyle}>
            <Text style={{color: 'white'}}>{type}</Text>
            <View style={styles.contentStyle}>
                <Text style={{color: 'white'}}>{description}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}>
                <Text style={{color: 'white'}}>
                {moment(datePlainte).format("DD-MM-YY HH:mm")}
                </Text> 
            </View>
        </View>
    );
}

ComplaintItem.propTypes = {
    complaint: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    containerStyle: {
        marginVertical: 7,
        marginHorizontal: 20,
        padding: 10,
        backgroundColor: "#7B7C9E"
    },
    contentStyle: {
        marginTop: 5,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'white',
        minHeight: 100
    }
});

export default ComplaintItem;
