import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import MainView from '../../../core/layout/MainView';
import Logo from '../../../core/layout/Logo';
import { Input, Icon, Button } from 'react-native-elements';
import validateField from '../../../utils/validator';
import { signIn, signOut } from '../actions/actions';
import { connect } from 'react-redux';
import { SALEPOINTSPLAYERIDS } from '../../../models/paths';
import { getDoc } from '../../../utils/firebase';

class SignIn extends Component {

    constructor(props) {
        super(props);

        this.state = {
            securePasswordInput: true,
            iconRightPasswordColor: 'black',
            errorNumero: "",
            errorPass: "",
        }; 

        this.fields = {
            numero: "",
            password: ""
        };
        
    }

    componentDidMount() {
        const { signOut } = this.props;
        signOut();
    }

    componentDidUpdate() {
        const { navigation, isLoaded, willSale, numero, playerId } = this.props;
        
        if(isLoaded) {
            
            if(playerId) {
                getDoc(SALEPOINTSPLAYERIDS, numero)
                .set({ playerId: playerId })
                .catch((error) => {});
            }

            if(willSale) {
                navigation.navigate("Home");
            } else {
                navigation.navigate("WappiHome");
            }
        }
        
    }

    _handleInputNumero = (text) => {
        this.fields.numero = text;

        const errorNumero = validateField('numero', this.fields.numero);
        this.setState({ errorNumero: errorNumero === null ? "" : errorNumero });
    }

    _handleInputPassword = (text) => {
        this.fields.password = text;

        const errorPass = validateField('password', this.fields.password);
        this.setState({ errorPass: errorPass === null ? "" : errorPass });
    }

    _toggleSecureTextEntryMode() {
        const securePasswordInput = !this.state.securePasswordInput;    
        
        this.setState({ 
            securePasswordInput: securePasswordInput, 
            iconRightPasswordColor: securePasswordInput ? 'black' : 'white' 
        });
    }

    _toggleDisabledSubmitButton() {
        if(this.fields.numero === "" || this.fields.password === ""){
            return true;
        }

        if(this.state.errorNumero !== "" || this.state.errorPass !== ""){
            return true;
        }

        return false;
    }

    _handleSubmit = () => {
        const { numero, password } = this.fields;
        const { signIn } = this.props;

        signIn(numero, password);
        
    }

    render() {
        const {
            errorNumero, 
            errorPass, 
            securePasswordInput, 
            iconRightPasswordColor
        } = this.state;
        const { isLoading } = this.props;
        
        return (
            <MainView backgroundImageUri={require('../../../assets/images/background_line_top.png')}>
                <View style={styles.signHeaderStyle}>
                    <Logo imageHeight={100} imageWidth={100} />
                </View>
                <View style={styles.signFormStyle}>
                    <Input 
                        inputContainerStyle={styles.input_style_container}
                        style={{ backgroundColor: 'white' }}
                        inputStyle={{ color: 'white' }}
                        containerStyle={{ marginBottom: 10 }}
                        placeholder={"numéro de compte".toUpperCase()} 
                        placeholderTextColor="#f8d7da"
                        leftIcon={{ color: 'white', type: 'font-awesome', name: 'user' }}
                        leftIconContainerStyle={{ marginLeft: 0, marginRight: 3 }}
                        onChangeText={this._handleInputNumero}
                        errorStyle={styles.input_error_style}
                        errorMessage={errorNumero}
                    />
                    <Input 
                        secureTextEntry={securePasswordInput}
                        inputContainerStyle={styles.input_style_container}
                        inputStyle={{ color: 'white' }}
                        placeholder={"mot de passe".toUpperCase()}
                        placeholderTextColor="#f8d7da"
                        leftIcon={{ color: 'white', type: 'font-awesome', name: 'lock' }}
                        leftIconContainerStyle={{ marginLeft: 0, marginRight: 3 }}
                        rightIcon={
                            <Icon type='font-awesome' 
                                    name='eye'  
                                    color={iconRightPasswordColor}
                                    onPress={() => this._toggleSecureTextEntryMode()}                  
                            />
                        }
                        onChangeText={this._handleInputPassword}
                        errorStyle={styles.input_error_style}
                        errorMessage={errorPass}
                    />
                    <View style={{marginTop: '10%'}}>
                        <Button title={"connexion".toUpperCase()} 
                            containerStyle={{ marginHorizontal: 48, borderRadius: 10 }}
                            buttonStyle={{ backgroundColor: 'white' }}
                            titleStyle={{ color: '#494B64' }}
                            onPress={() => this._handleSubmit()}
                            disabled={this._toggleDisabledSubmitButton()}
                            disabledStyle={{backgroundColor: "#f8d7da", borderColor: "grey"}}
                            disabledTitleStyle={{color: "#494B64"}}
                            loading={isLoading}
                            loadingProps={{color: 'blue'}}
                        />
                    </View>
                </View>
            </MainView>
        );
    }
}

const styles = StyleSheet.create({
    signHeaderStyle: {
        flex: 1,
        alignItems: 'center',
        marginTop: '30%'
    },
    signFormStyle: {
        flex: 2
    },
    input_style_container: { 
        marginHorizontal: 40, 
        borderBottomColor: 'white' 
    },
    input_error_style: { 
        color: 'red', 
        marginHorizontal: 40 
    }
});

const mapStateToProps = (state) => ({
    isLoading: state.uiLoading.isLoading,
    isLoaded: state.profile.isLoaded,
    numero: state.profile.numero,
    playerId: state.profile.playerId,
    willSale: state.profile.ventes
});

export default connect(mapStateToProps, { signIn, signOut })(SignIn);