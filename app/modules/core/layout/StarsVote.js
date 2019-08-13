import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

const StarsVote = (props) => {
    const { vote, colorVote, colorNoVote, size, handleVote } = props;

    return (
        <View style={styles.main_container}>
            {
                [1, 2, 3, 4, 5].map((value, key) => {
                    return <Icon
                                key={key} 
                                name="star" 
                                type="font-awesome"
                                size={size}
                                iconStyle={{color : value <= vote ? colorVote : colorNoVote}}
                                containerStyle={{marginRight: 5}}
                                onPress={handleVote !== null ? () => handleVote(value) : null} 
                            />;
                })
            }
        </View>
    );
}

StarsVote.defaultProps = {
    colorVote: "yellow",
    colorNoVote: "#4A4964",
    size: 26,
    handleVote: null
}

StarsVote.propTypes = {
    vote: PropTypes.number.isRequired,
    colorVote: PropTypes.string,
    colorNoVote: PropTypes.string,
    size: PropTypes.number,
    handleVote: PropTypes.func
}

const styles = StyleSheet.create({
    main_container: {
        flexDirection: 'row'
    }
});

export default StarsVote;
