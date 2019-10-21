import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Text, Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

class OrderItem extends PureComponent {
    state = {
        amount: 0,
        isUpdated: false
    };

    static getDerivedStateFromProps(props, state) {
        if(props.init !== state.isUpdated) {
            return {
                amount: 0,
                isUpdated: props.init
            };
        }

        return null;
    }

    render() {
        const { product, kin, increase, decrease } = this.props;
        const { image, nom, code, prixUKin, prixUHKin } = product;
        const { amount } = this.state;
        const unitPrice = kin === true ? prixUKin : prixUHKin 

        return (
            <View style={styles.container}>
                <FastImage 
                    source={{uri: image}} 
                    style={{height: hp("12%"), width: wp("7%")}} 
                    onError={() => {}} 
                />
                <View style={{justifyContent: 'center', alignItems: "center"}}>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>{nom}</Text>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>
                        {unitPrice + " FC x " + amount} 
                    </Text>
                </View>
                <View style={{justifyContent: 'space-between'}}>
                    <Icon 
                        type="font-awesome"
                        name="plus"
                        iconStyle={{color: '#7B7C9E'}}
                        containerStyle={styles.buttonContainer}
                        onPress={() => {
                            const newAmount = amount + 1;
                            this.setState({ amount: newAmount }, () => {
                                increase(unitPrice, newAmount, nom, code);
                            });
                        }}
                    />
                    <Icon 
                        type="font-awesome"
                        name="minus"
                        iconStyle={{color: '#7B7C9E'}}
                        containerStyle={styles.buttonContainer}
                        onPress={() => {
                            if(amount > 0) {
                                const newAmount = amount - 1;
                                this.setState({ amount: newAmount }, () => {
                                    decrease(unitPrice, newAmount, nom, code);
                                });
                            }
                        }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: 'space-between',
        height: hp("16%"),
        backgroundColor: "#7B7C9E",
        padding: 5
    },
    buttonContainer: {
        height: 24, 
        width: 24, 
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    }
});

OrderItem.propTypes = {
    product: PropTypes.object.isRequired,
    kin: PropTypes.bool.isRequired,
    increase: PropTypes.func.isRequired,
    decrease: PropTypes.func.isRequired
};

export default OrderItem;