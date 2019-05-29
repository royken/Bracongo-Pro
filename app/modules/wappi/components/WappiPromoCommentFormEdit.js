import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Overlay, Input, Button, Text } from 'react-native-elements';
import { isEmpty } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import validateField from '../../../utils/validator';

const initialState = {
    dateBegin: '',
    dateEnd: '',
    title: '',
    titleError: '',
    comment: '',
    commentError: ''
};

class WappiPromoCommentFormEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...initialState
        };
    }
    
    componentWillReceiveProps(nextProps) {
        const { title, comment, dateBegin, dateEnd } = this.state;
        const { defaultTitle, defaultDescription, defaultBeginDate, defaultEndDate } = nextProps;

        if(dateBegin.length === 0 && dateEnd.length === 0 && title === '' && comment === '') {
            this.setState({ 
                title: defaultTitle,
                comment: defaultDescription,
                dateBegin: defaultBeginDate,
                dateEnd: defaultEndDate
            });
        }
    }

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
        const { title, titleError, comment, commentError, dateBegin, dateEnd } = this.state;

        if(title === '' && titleError !== "" || 
            comment === '' || commentError !== "" || 
            dateBegin === "" || dateEnd === ""
        ) {
            return false;
        }

        return true;
    }

    render() {
        const { 
            isVisible, 
            isLoading, 
            hideForm, 
            handleSubmit,
            defaultTitle,
            defaultDescription
        } = this.props;

        const { 
            dateBegin, 
            dateEnd, 
            title,
            titleError,
            comment, 
            commentError
        } = this.state;

        const dateCompare = moment(dateBegin, "DD-MM-YYY HH:mm") > moment(dateEnd, "DD-MM-YYY HH:mm");

        return (
            <Overlay isVisible={isVisible} onBackdropPress={() => { 
                this.setState({ ...initialState }); hideForm(); 
            }}
                overlayBackgroundColor="#7B7C9E" height="70%">
                <View>
                    <View style={{alignItems: 'center', marginTop: 10}}>
                        <Text h4 style={{color: 'white'}}>
                        {"nouveau événement".toUpperCase()}
                        </Text>
                    </View>
                    <Input 
                        containerStyle={{padding: 5, marginTop: 15}}
                        numberOfLines={1} 
                        defaultValue={defaultTitle}
                        inputStyle={{color: 'white', paddingHorizontal: 5}}
                        maxLength={100}
                        placeholder="(Titre : 100 caractères)"
                        placeholderTextColor="#00151C" 
                        inputContainerStyle={{borderWidth: 1, borderColor: "white", borderRadius: 5}}
                        onChangeText={this._handleInputTitle}
                        errorStyle={{color: '#f8d7da', marginHorizontal: 10}}
                        errorMessage={titleError}
                    />
                    <View style={{flexDirection: 'row', marginVertical: 15, justifyContent: 'space-between'}}>
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
                        containerStyle={{padding: 5, marginBottom: 15}}
                        numberOfLines={4} 
                        inputStyle={{color: 'white', paddingHorizontal: 5}}
                        maxLength={200}
                        defaultValue={defaultDescription}
                        placeholder="(Description : 200 caractères)"
                        placeholderTextColor="#00151C" 
                        inputContainerStyle={styles.inputCommentContainer}
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
                        onPress={() => handleSubmit(title, dateBegin, dateEnd, comment)}  
                        loading={isLoading}
                        loadingProps={{color: 'blue'}}
                    />
                </View>
            </Overlay>
        );
    }
}

const styles = StyleSheet.create({
    inputCommentContainer: {
        borderWidth: 1, 
        borderColor: "white", 
        borderRadius: 5
    }
});

WappiPromoCommentFormEdit.defaultProps = {
    isVisible: false,
    isLoading: false,
    defaultTitle: "",
    defaultBeginDate: "",
    defaultEndDate: "",
    defaultDescription: ""
};

WappiPromoCommentFormEdit.propTypes = {
    isVisible: PropTypes.bool,
    isLoading: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    hideForm: PropTypes.func.isRequired,
    defaultTitle: PropTypes.string,
    defaultBeginDate: PropTypes.string,
    defaultEndDate: PropTypes.string,
    defaultDescription: PropTypes.string
};

export default WappiPromoCommentFormEdit;