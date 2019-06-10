import React, { Component } from 'react';
import { StyleSheet, View, ImageBackground, Dimensions } from 'react-native';
import MainView from '../../../core/layout/MainView';
import MainHeader from '../../../core/layout/MainHeader';
import { Text, Icon } from 'react-native-elements';
import IconWithText from '../../../core/layout/IconWithText';
import { connect } from 'react-redux';
import { setProfileListener, unsetProfileListener } from '../../profile/actions/actions';
import { signOut } from '../../sign/actions/actions';
import ImagePicker from 'react-native-image-picker';
import { IMAGEPICKEROPTIONS, CONNEXION_PROBLEM_MSG } from '../../../core/constants';
import { toast } from '../../../utils/toast';
import { updateFile } from '../../../utils/firebase';
import { SALEPOINTSPROFILESTORAGE } from '../../../models/paths';
import { updateProfile } from '../../profile/profileHelper';
import Spinner from '../../../core/layout/Spinner';
import PostModal from '../../../core/layout/PostModal';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const deviceWidth = Dimensions.get('window').width;
const photoHeigth = Math.floor(deviceWidth / 2);

class WappiHome extends Component {

    state = {
        isLoading: false,
        isSubmitting: false,
        isVisible: false,
        description: ""
    };

    componentDidMount() {
        const { setProfileListener } = this.props;

        setProfileListener();
    }

    componentWillUnmount() {
        const { unsetProfileListener } = this.props;

        unsetProfileListener();
    }

    _uploadCover() {
        const { profile } = this.props;
        this.setState({ isLoading: true });

        ImagePicker.showImagePicker(IMAGEPICKEROPTIONS, (response) => {
            if(response.didCancel){
                this.setState({ isLoading: false });
                return;
            } else if(response.error){ 
                this.setState({ isLoading: false });
                toast("Erreur de chargement : Vérifier votre appareil photo.", "warning", 5000);
                return;
            } else {
                updateFile(
                    response.uri, 
                    SALEPOINTSPROFILESTORAGE + "/" + response.fileName, 
                    profile.cover === "undefined" ? "" : profile.cover
                ).then(
                    (url) => {
                        updateProfile({cover: url}).then(
                            () => {
                                this.setState({ isLoading: false });
                                toast("Votre profil a été édité avec succès.", "success", 5000);
                            }
                        ).catch((error) => {
                            this.setState({ isLoading: false });
                            toast(CONNEXION_PROBLEM_MSG, "danger", 5000);
                        });
                    }
                ).catch((error) => {
                    this.setState({ isLoading: false });
                    toast(CONNEXION_PROBLEM_MSG, "danger", 5000);
                });
            }
        });
    }

    _handleFormDescription = (text) => {
        this.setState({ description: text });
    }

    _showFormDescription() {
        this.setState({ isVisible: true });
    }

    _checkFormDescription() {
        if(this.state.description.length === 0) {
            return false;
        }

        return true;
    }

    _hideFormDescription = () => {
        this.setState({ isVisible: false, description: "", isSubmitting: false });
    }

    _handleSubmitFormDescription = () => {
        const { description } = this.state;
        this.setState({ isSubmitting: true });

        updateProfile({ description: description }).then(
            () => this._hideFormDescription()
        ).catch(() => {
                this.setState({ isSubmitting: false });
                toast(CONNEXION_PROBLEM_MSG, "danger", 5000);
            }
        );
    }

    _onGoToScreen(screen) {
        const { navigation } = this.props;

        navigation.navigate(screen);
    }

    render() {
        const { navigation, profile, signOut } = this.props;
        const { cover, description, ventes } = profile;
        const { isLoading, isSubmitting, isVisible } = this.state;

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_line_bottom.png')}>
                <MainHeader 
                    title="position de mon camion vendeur"
                    uri={require('../../../assets/images/wappi.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                    showTitle={false}
                />
                
                <ImageBackground 
                    source={{uri: cover ? cover : "undefined"}}
                    onError={() => {}}
                    style={{marginTop: "3%", width: "100%", height: photoHeigth, backgroundColor: 'grey'}}
                >
                    {isLoading &&
                        <Spinner color="blue" 
                            containerStyle={{
                                position: 'absolute',
                                top: "50%",
                                left: 0,
                                bottom: 0,
                                right: 0
                            }} 
                        />
                    }
                    <Icon type="font-awesome" 
                        name="edit" 
                        onPress={() => this._uploadCover()} 
                        iconStyle={{color: 'white'}}
                        containerStyle={styles.editImageContainerStyle}
                    />
                </ImageBackground>
                <View style={{flex: 1, justifyContent: 'space-between'}}>
                    <View style={{marginTop: "10%", marginHorizontal: 20}}>
                        <Text style={{color: 'white'}} numberOfLines={7}>
                            Description: <Text style={{color: 'white'}}>
                                {description ? description : ""}
                            </Text>
                        </Text>
                        <Icon type="font-awesome" 
                            name="edit" 
                            onPress={() => this._showFormDescription()} 
                            iconStyle={{color: 'white'}}
                            containerStyle={{alignItems: 'flex-end', marginTop: 2}}
                        />
                        <PostModal
                            title="description"
                            initialInputValue={description ? description : ""}
                            handleInput={this._handleFormDescription}
                            handleSubmit={this._handleSubmitFormDescription}
                            isValid={this._checkFormDescription()}
                            isSubmitting={isSubmitting}
                            isVisible={isVisible}
                            hideForm={this._hideFormDescription}
                        />
                    </View>
                    <View style={styles.menuStyle}>
                        <IconWithText 
                            title="Promotions"
                            titleStyle={{color: 'white'}}
                            iconStyle={{color: 'white'}}
                            type="font-awesome"
                            name="gift"
                            boxShadow={false}
                            size={35}
                            containerStyle={{alignItems: "center", flex: 1}}
                            onPress={() => this._onGoToScreen("WappiPromo")}
                        />
                        <IconWithText 
                            title="Photos"
                            titleStyle={{color: 'white'}}
                            type="font-awesome"
                            name="photo"
                            boxShadow={false}
                            iconStyle={{color: 'white'}}
                            size={35}
                            containerStyle={{alignItems: "center", flex: 1}}
                            onPress={() => this._onGoToScreen("WappiPhoto")}
                        />
                        <IconWithText 
                            title="Avis"
                            titleStyle={{color: 'white'}}
                            type="font-awesome"
                            name="comments"
                            boxShadow={false}
                            iconStyle={{color: 'white'}}
                            size={35}
                            containerStyle={{alignItems: "center", flex: 1}}
                            onPress={() => this._onGoToScreen("WappiNote")}
                        />
                        <IconWithText 
                            title="Fidélité"
                            titleStyle={{color: 'white'}}
                            type="font-awesome"
                            name="heart"
                            boxShadow={false}
                            iconStyle={{color: 'white'}}
                            size={35}
                            containerStyle={{alignItems: "center", flex: 1}}
                            onPress={() => this._onGoToScreen("WappiLoyalty")}
                        />
                    </View>
                </View>
                {!ventes &&
                    <View style={styles.logoutStyle}>
                        <Icon 
                            type="font-awesome" 
                            name="sign-out"
                            iconStyle={{color: "#7B7C9E"}}
                            containerStyle={styles.logoutIconStyle}
                            onPress={() => { signOut().then(() => navigation.navigate("SignIn")); }} 
                        />
                    </View>
                }
            </MainView>
        );
    }
}

const styles = StyleSheet.create({
    menuStyle: {
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'flex-start',
        marginBottom: "3%"
    },
    editImageContainerStyle: {  
        marginTop: photoHeigth - 45,
        marginLeft: "87%",
        backgroundColor: 'black',
        height: 40,
        width: 40,
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    logoutStyle: {
        position: "absolute",
        top: hp("4%"),
        bottom: 0,
        left: wp("87%"),
        right: 0
    },
    logoutIconStyle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "white"
    }
});

const mapStateToProps = (state) => ({
    profile: state.profile
});

export default connect(mapStateToProps, { setProfileListener, unsetProfileListener, signOut })(WappiHome);