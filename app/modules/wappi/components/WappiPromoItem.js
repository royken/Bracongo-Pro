import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Text, Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

const WappiPromoItem = (props) => {
    const { promo, displayDetails, onShare } = props;
    const { id, description, title, image, commentsCount, likesCount } = promo;

    return (
        <ListItem 
            onPress={() => displayDetails(id)}
            containerStyle={styles.container}
            title={
                <Text style={{color: '#7B7C9E', fontWeight: 'bold'}} numberOfLines={1}>
                    {title}
                </Text>
            }
            leftAvatar={
                <FastImage 
                    source={{uri: image}}
                    onError={() => {}}
                    style={{backgroundColor: 'grey', width: 90, height: 90, borderRadius: 10, marginHorizontal: 5}}
                />
            }
            subtitle={
                <View>
                    <Text style={{color: '#7B7C9E'}} 
                            numberOfLines={3}>
                            {description}
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
                        <Icon type="font-awesome" name="share-alt"
                            iconStyle={{color: 'red'}} 
                            onPress={() => onShare(promo)}
                        />
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#7B7C9E'}}>{commentsCount}</Text>
                            <Icon type="font-awesome" name="comment" 
                                iconStyle={{color: '#7B7C9E'}} 
                                containerStyle={{marginLeft: 5}} 
                            />
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#7B7C9E'}}>{likesCount}</Text>
                            <Icon type="font-awesome" name="heart" 
                                iconStyle={{color: '#7B7C9E'}} 
                                containerStyle={{marginLeft: 5}} 
                            />
                        </View>
                    </View>
                </View>
            } 
        />
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        marginVertical: 5,
        padding: 10,
        borderRadius: 10
    }
});

WappiPromoItem.propTypes = {
    promo: PropTypes.object.isRequired,
    displayDetails: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired
}

export default WappiPromoItem;
