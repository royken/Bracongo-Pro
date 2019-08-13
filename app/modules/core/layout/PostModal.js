import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Overlay, Text, Input, Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const PostModal = (props) => {
    const { 
        title, 
        hideForm, 
        isSubmitting,
        handleSubmit, 
        handleInput, 
        initialInputValue,
        isValid,
        inputError,
        height,
        isVisible 
    } = props;

    return (
        <Overlay isVisible={isVisible} onBackdropPress={() => hideForm()}
            overlayBackgroundColor="white" height={height} width={wp("84%")}
        >
            <KeyboardAwareScrollView>
                <View style={styles.titleContainerstyle}>
                    <Text h4 style={{color: '#7B7C9E'}}>{title.toUpperCase()}</Text>
                </View>
                <View>
                    <Input multiline
                        containerStyle={{padding: 5}}
                        numberOfLines={5} 
                        inputStyle={{color: '#7B7C9E', paddingHorizontal: 5}}
                        maxLength={200}
                        placeholder="(Max: 200 caractères)"
                        placeholderTextColor="#7B7C9E" 
                        inputContainerStyle={{borderWidth: 1, borderColor: "#7B7C9E", borderRadius: 5}}
                        onChangeText={handleInput}
                        defaultValue={initialInputValue}
                        errorStyle={{color: '#f8d7da', marginHorizontal: 10}}
                        errorMessage={inputError}
                    />
                </View>
                <Button title="Valider" 
                    titleStyle={{color: "white"}}
                    containerStyle={{marginTop: 15, marginHorizontal: 10}}
                    buttonStyle={{backgroundColor: "#7B7C9E"}}
                    disabled={!isValid}
                    disabledStyle={{backgroundColor: "grey"}}
                    onPress={() => handleSubmit()}  
                    loading={isSubmitting}
                    loadingProps={{color: 'blue'}}
                />
            </KeyboardAwareScrollView>
        </Overlay>
    );
}

PostModal.defaultProps = {
    initialInputValue: "",
    isSubmitting: false,
    inputError: "",
    height: "47%",
    isVisible: false,
    isValid: true
}

PostModal.propTypes = {
    title: PropTypes.string.isRequired,
    initialInputValue: PropTypes.string,
    isSubmitting: PropTypes.bool,
    inputError: PropTypes.string,
    hideForm: PropTypes.func.isRequired,
    handleInput: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    isValid: PropTypes.bool,
    height: PropTypes.any,
    isVisible: PropTypes.bool
}

const styles = StyleSheet.create({  
    titleContainerstyle: {
        alignItems: 'center', 
        marginHorizontal: 0, 
        marginTop: 0,
        marginBottom: 15
    }
});

export default PostModal;
