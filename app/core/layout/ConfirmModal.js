import React from 'react';
import { View } from 'react-native';
import { Overlay, Text, Button } from 'react-native-elements';
import PropTypes from 'prop-types';

const ConfirmModal = (props) => {
    const { data, isVisible, isLoading, hideForm, title, handleConfirm } = props;

    return (
        <Overlay isVisible={isVisible} onBackdropPress={() => hideForm()}
            overlayBackgroundColor="#7B7C9E" height="25%">
            <View>
                <View style={{alignItems: 'center', marginBottom: 15}}>
                    <Text h4 h4Style={{fontSize: 18}} style={{color: 'white'}}>{title}</Text>
                </View>
                <Button title="confirmer" 
                    titleStyle={{color: "#7B7C9E"}}
                    containerStyle={{marginTop: 15, marginHorizontal: 10}}
                    buttonStyle={{backgroundColor: "white"}}
                    onPress={() => handleConfirm(data)}  
                    loading={isLoading}
                    loadingProps={{color: 'blue'}}
                />
            </View>
        </Overlay>
    );
}

ConfirmModal.defaultProps = {
    isVisible: false,
    isLoading: false,
    title: "",
    data: null
};

ConfirmModal.propTypes = {
    isVisible: PropTypes.bool, 
    title: PropTypes.string, 
    isLoading: PropTypes.bool, 
    data: PropTypes.any,
    hideForm: PropTypes.func.isRequired, 
    handleConfirm: PropTypes.func.isRequired
};

export default ConfirmModal;
