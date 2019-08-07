import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Text, Picker } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon, Overlay, Button, Input } from 'react-native-elements';
import { isEmpty } from 'lodash';
import MainView from '../../../core/layout/MainView';
import MainHeader from '../../../core/layout/MainHeader';
import ComplaintItem from './ComplaintItem';
import { listComplaints, newComplaint } from '../actions/actions';
import { cancelRequest } from '../../../core/actions/actions';
import Spinner from '../../../core/layout/Spinner';
import validateField from '../../../utils/validator';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const TYPE = [
    "MATERIEL", "PRODUIT HORS NORME", "REMISE", "DISTRIBUTION", "NUMERO DE COMPTE", "CONCURRENCE", 
    "PROMOTION", "DECORATION", "RUPTURE", "ESCROQUERIE", "EMBALLAGE", "CONTRAT", "CHANGEMENT", 
    "ADRESSE", "REPARATION", "DISPONIBILITE", "FACTURATION", "AUTRE"
];

class ComplaintHome extends Component {

    _isMounted = false;

    state = {
        formVisible: false,
        isSubmitting: false,
        inputMessage: "",
        inputType: "",
        inputErrorMessage: ""
    };

    componentDidMount() {
        this._isMounted = true;
        const { listComplaints, numero } = this.props;
        listComplaints(numero);
    }

    componentWillUnmount() {
        this._isMounted = false;
        const { cancelRequest } = this.props;

        cancelRequest();
    }

    _handleInput = (text) => {
        const error = validateField('description', text);
        this.setState({ 
            inputMessage: text, 
            inputErrorMessage: error === null ? "" : error
        });
    }

    _isInputValid() {
        const { inputMessage, inputErrorMessage, inputType } = this.state;

        if(inputMessage === "" || inputErrorMessage !== "") {
            return false;
        } 

        if(inputType === "") {
            return false;
        }

        return true;
    }

    _selectType = (itemValue, itemIndex) => {
        this.setState({ inputType: itemValue });
    }

    _showFormComplaint() {
        this.setState({ formVisible: true });
    }

    _hideFormComplaint() {
        this.setState({ 
            formVisible: false, 
            isSubmitting: false,
            inputMessage: "",
            inputType: "",
            inputErrorMessage: ""
        });
    }

    _newComplaint() {
        this.setState({ isSubmitting: true });
        const { inputMessage, inputType } = this.state;
        const { newComplaint, numero } = this.props;

        newComplaint({ description: inputMessage, type: inputType, client: numero })
        .then(() => {
            if(this._isMounted) {
                this._hideFormComplaint();
            }
        })
        .catch((error) => {
            if(this._isMounted) {
                this.setState({ isSubmitting: false });
            }
        });
    }

    _renderItem = ({item}) => (
        <ComplaintItem 
            complaint={item}
        />
    )

    render() {
        const { navigation, isLoading, complaints, numero, page, pageable, listComplaints } = this.props;
        const { formVisible, isSubmitting, inputType, inputErrorMessage } = this.state;

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_line_bottom.png')}>
                <MainHeader 
                    title="plaintes"
                    uri={require('../../../assets/images/complaint.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                />
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 15, marginHorizontal: 10}}>
                    <Icon 
                        containerStyle={styles.addButtonContainer}
                        type="font-awesome"
                        name="plus"
                        iconStyle={{color: "#7B7C9E"}}
                        onPress={() => this._showFormComplaint()}
                    />
                </View>
                {isLoading ?
                    <Spinner containerStyle={{marginTop: 150, alignItems: 'center'}} 
                        color="blue" /> 
                    :
                    isEmpty(complaints) ? 
                    <View style={{alignItems: 'center', marginTop: 150}}>
                        <Text style={{color: 'white'}}>Aucune plainte trouvée.</Text>
                    </View>
                    :
                    <FlatList 
                        contentContainerStyle={{marginTop: 20, paddingBottom: 10}}
                        data={complaints}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this._renderItem}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            if(pageable) {
                                listComplaints(numero, page + 1);
                            }
                        }}
                    />
                }
                <Overlay 
                    isVisible={formVisible}
                    onBackdropPress={() => this._hideFormComplaint()} 
                    overlayBackgroundColor="white" height="55%" width={wp("84%")}
                >
                    <KeyboardAwareScrollView>
                        <View style={{ marginTop: 10, alignItems: 'center' }}>
                            <Text style={{ color: "#7B7C9E" }}>
                                {"nouvelle plainte".toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.selectContainer}>
                            <Picker
                                selectedValue={inputType}
                                style={styles.selectContainerElement}
                                itemStyle={{color: "#7B7C9E"}}
                                onValueChange={this._selectType} 
                            >
                                {
                                    TYPE.map((value, index) => (
                                        <Picker.Item key={index}
                                            label={value} value={value} />
                                    ))
                                }

                            </Picker>
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
                                onChangeText={this._handleInput}
                                errorStyle={{color: '#f8d7da', marginHorizontal: 10}}
                                errorMessage={inputErrorMessage}
                            />
                        </View>
                        <Button title="Valider" 
                            titleStyle={{color: "white"}}
                            containerStyle={{marginTop: 15, marginHorizontal: 10}}
                            buttonStyle={{backgroundColor: "#7B7C9E"}}
                            disabled={!this._isInputValid()}
                            disabledStyle={{backgroundColor: "grey"}}
                            onPress={() => this._newComplaint()}  
                            loading={isSubmitting}
                            loadingProps={{color: 'blue'}}
                        />
                    </KeyboardAwareScrollView>
                </Overlay>
                <View style={{height: 1, marginTop: 6}}></View>
            </MainView>
        );
    }
}

const styles = StyleSheet.create({
    addButtonContainer: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: "white",
        justifyContent: 'center'
    },
    selectContainer: {
        flexDirection: 'row',
        marginVertical: 15, 
        marginLeft: 10,
        backgroundColor: "#7B7C9E",
        marginRight: 10
    },
    selectContainerElement: {
        height: 50, width: "100%"
    }
});

const mapStateToProps = (state) => ({
    numero: state.profile.numero,
    isLoading: state.uiLoading.isLoading,
    complaints: state.complaints.complaints,
    page: state.complaints.page,
    pageable: state.complaints.pageable
});

export default connect(mapStateToProps, { listComplaints, newComplaint, cancelRequest })(ComplaintHome);