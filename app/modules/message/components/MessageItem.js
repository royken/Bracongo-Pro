import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

const MessageItem = (props) => {
    const { contenu, lienImage, dateMessage, hasImage } = props.message;

    return (
        <View style={styles.containerStyle}>
            <Text style={{color: 'white'}}>Bracongo</Text>
            <View style={styles.contentStyle}>
                <Text style={{color: 'white'}}>{contenu}</Text>
                {hasImage === true ?
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                        <FastImage 
                            source={{uri: lienImage}}
                            onError={() => {}}
                            style={{
                                backgroundColor: 'grey', 
                                width: 100, height: 100
                            }}
                        />
                        <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                            <Text style={{color: 'white'}}>
                            {moment(dateMessage).format("DD-MM-YY HH:mm")}
                            </Text>
                        </View>
                    </View> :
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}>
                        <Text style={{color: 'white'}}>
                        {moment(dateMessage).format("DD-MM-YY HH:mm")}
                        </Text> 
                    </View>  
                } 
            </View>
        </View>
    );
}

MessageItem.propTypes = {
    message: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    containerStyle: {
        marginVertical: 7,
        marginHorizontal: 20
    },
    contentStyle: {
        marginTop: 5,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'white'
    }
});

export default MessageItem;
