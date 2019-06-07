import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Overlay, Icon, Input, Button, Text } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { isEmpty } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import validateField from '../../../utils/validator';
import { toast } from '../../../utils/toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { IMAGEPICKEROPTIONS } from '../../../core/constants';

const initialState = {
    dateBegin: '',
    dateEnd: '',
    title: '',
    titleError: '',
    comment: '',
    commentError: '',
    photoUri: null,
    photoName: null,
    isImageLoaded: false
};

class WappiPromoCommentForm extends Component {
    
    state = {
        ...initialState
    };

    _handleDatePickedBegin = (date) => {
        this.setState({ dateBegin: date });
    };

    _handleDatePickedEnd = (date) => {
        this.setState({ dateEnd: date });
    };

    _handleInputTitle = (text) => {
        this.setState({ title: text });

        const titleError = validateField('title', text);
        this.setState({ titleError: titleError === null ? "" : titleError });
    }

    _handleInputDescription = (text) => {
        this.setState({ comment: text });

        const commentError = validateField('description', text);
        this.setState({ commentError: commentError === null ? "" : commentError });
    }

    _isInputValid() {
        const { titleError, photoUri, commentError, dateBegin, dateEnd } = this.state;

        if(titleError !== "" || commentError !== "" || 
            !photoUri ||
            dateBegin === "" || dateEnd === ""
        ) {
            return false;
        }

        return true;
    }

    _loadImage() {
        ImagePicker.showImagePicker(IMAGEPICKEROPTIONS, (response) => {
            if(response.didCancel){
                this.setState({ photoUri: null, photoName: null, isImageLoaded: false});
            } else if(response.error){
                this.setState({ photoUri: null, photoName: null, isImageLoaded: false});
                toast("Erreur de chargement : vérifier votre appareil photo.", "warning", 5000);
            } else {
                this.setState({ 
                    photoUri: response.uri, 
                    photoName: "/" + response.fileName,  
                    isImageLoaded: true
                });
            }
        });
    }

    render() {
        const { isVisible, isLoading, hideForm, handleSubmit } = this.props;
        const { 
            dateBegin, 
            dateEnd, 
            title,
            titleError,
            comment, 
            commentError, 
            isImageLoaded,  
            photoUri, 
            photoName 
        } = this.state;
        const dateCompare = moment(dateBegin, "DD-MM-YYY HH:mm") > moment(dateEnd, "DD-MM-YYY HH:mm");

        return (
            <Overlay isVisible={isVisible} onBackdropPress={() => { 
                this.setState({ ...initialState }); hideForm(); 
            }}
                overlayBackgroundColor="#7B7C9E" height="77%">
                <KeyboardAwareScrollView>
                    <View style={{alignItems: 'center', marginTop: 10}}>
                        <Text h4 style={{color: 'white'}}>
                        {"nouvel évènement".toUpperCase()}
                        </Text>
                    </View>
                    <Input 
                        containerStyle={{padding: 5, marginTop: 15}}
                        numberOfLines={1} 
                        inputStyle={{color: 'white', paddingHorizontal: 5}}
                        maxLength={100}
                        placeholder="(Titre : 100 caractères)"
                        placeholderTextColor="#00151C" 
                        inputContainerStyle={{borderWidth: 1, borderColor: "white", borderRadius: 5}}
                        onChangeText={this._handleInputTitle}
                        errorStyle={{color: '#f8d7da', marginHorizontal: 10}}
                        errorMessage={titleError}
                    />
                    <View style={styles.cameraButtonContainer}>
                        <Icon 
                            type="font-awesome" 
                            name="camera" 
                            iconStyle={{color: 'white'}}
                            onPress={() => this._loadImage()}
                            containerStyle={isImageLoaded ? {marginRight: 5} : null}
                        />
                        {isImageLoaded && 
                            <Text style={{color: '#155724', fontSize: 14}}>
                            {"(Image chargée.)"}
                            </Text>
                        }   
                    </View>
                    <View style={{flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between'}}>
                        <DatePicker
                            date={dateBegin}
                            onDateChange={(date) => this._handleDatePickedBegin(date)}
                            placeholder="Debut"
                            minDate="01-05-2019 00:00"
                            androidMode="spinner"
                            confirmBtnText="Confirmer"
                            cancelBtnText="Annuler"
                            mode="datetime"
                            format="DD-MM-YYYY HH:mm" 
                            customStyles={{dateInput: {
                                marginTop: 0, 
                                padding: 5,
                                borderColor: "white"
                            }}}   
                        />
                        <DatePicker
                            date={dateCompare === true ? dateBegin : dateEnd}
                            onDateChange={(date) => this._handleDatePickedEnd(date)}
                            placeholder="Fin"
                            minDate={isEmpty(dateBegin) ? "01-05-2019 00:00" : dateBegin}
                            androidMode="spinner"
                            confirmBtnText="Confirmer"
                            cancelBtnText="Annuler"
                            mode="datetime"
                            format="DD-MM-YYYY HH:mm" 
                            customStyles={{dateInput: {
                                marginTop: 0, 
                                padding: 5,
                                borderColor: "white"
                            }}}   
                        />
                    </View>
                    <Input multiline
                        containerStyle={{padding: 5, marginVertical: 15}}
                        numberOfLines={4} 
                        inputStyle={{color: 'white', paddingHorizontal: 5}}
                        maxLength={200}
                        placeholder="(Description : 200 caractères)"
                        placeholderTextColor="#00151C" 
                        inputContainerStyle={{borderWidth: 1, borderColor: "white", borderRadius: 5}}
                        onChangeText={this._handleInputDescription}
                        errorStyle={{color: '#f8d7da', marginHorizontal: 10}}
                        errorMessage={commentError}
                    />
                    <Button title="Valider" 
                        titleStyle={{color: "#7B7C9E"}}
                        containerStyle={{marginTop: 15, marginHorizontal: 10}}
                        buttonStyle={{backgroundColor: "white"}}
                        disabled={!this._isInputValid()}
                        disabledStyle={{backgroundColor: "#CB314C"}}
                        onPress={() => handleSubmit(title, dateBegin, dateEnd, comment, photoUri, photoName)}  
                        loading={isLoading}
                        loadingProps={{color: 'blue'}}
                    />
                </KeyboardAwareScrollView>
            </Overlay>
        );
    }
}

const styles = StyleSheet.create({
    cameraButtonContainer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginVertical: 20
    }
});

WappiPromoCommentForm.defaultProps = {
    isVisible: false,
    isLoading: false
};

WappiPromoCommentForm.propTypes = {
    isVisible: PropTypes.bool,
    isLoading: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    hideForm: PropTypes.func.isRequired
};

export default WappiPromoCommentForm;