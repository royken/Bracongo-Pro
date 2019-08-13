import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { Text, Image, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';

import { setListener, unsetListener, getStatus } from '../../../store/actions';
import { update, updateFile } from '../../../utils/firebase';
import { toast } from '../../../utils/toast';
import { shareToSN } from '../../../utils/shareUtil';
import { getTimeFromStringDate } from '../../../utils/helper';

import { PROMOTIONS, PROMOTIONSTORAGE } from '../../../models/paths';
import { CONNEXION_PROBLEM_MSG, IMAGEPICKEROPTIONS } from '../../core/constants';

import Spinner from '../../core/layout/Spinner';
import MainView from '../../core/layout/MainView';
import MainHeader from '../../core/layout/MainHeader';
import ConfirmModal from '../../core/layout/ConfirmModal';
import WappiPromoCommentFormEdit from '../components/WappiPromoCommentFormEdit';

const deviceWidth = Dimensions.get('window').width;
const imageHeight = Math.floor(deviceWidth / 2); 

class WappiPromoDetails extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            isConfirmModalVisible: false,
            isConfirmProcessing: false,
            isUploading: false,
            isFormVisible: false,
            isSubmitting: false
        };

        this.query = null;
    }

    componentDidMount() {
        const { setListener, navigation } = this.props;
        const promoId = navigation.state.params.promoId;

        this.query = {
            collection: PROMOTIONS,
            doc: promoId,
            storeAs: 'promotion'
        };

        setListener(this.query);
    }

    componentWillUnmount() {
        if(this.query) {
            const { unsetListener } = this.props;
            unsetListener(this.query);
        }
    }

    _onShare(promo) {
        const { raisonSociale, cover } = this.props;

        const options = {
            url: promo.image,
            title: "Promotion point de vente " + raisonSociale,
            message: promo.description
        };

        shareToSN(options).catch((error) => {});
    }

    _displayComments(promoId, promoTitle) {
        const { navigation } = this.props;

        navigation.navigate("WappiPromoComments", { promoId: promoId, promoTitle: promoTitle });
    }

    _showFormConfirm() {
        this.setState({ isConfirmModalVisible: true });
    }

    _hideFormConfirm = () => {
        this.setState({ isConfirmModalVisible: false, isConfirmProcessing: false });
    }

    _hideFormPromo = () => {
        this.setState({ isFormVisible: false, isSubmitting: false });
    }

    _openFormPromo() {
        this.setState({ isFormVisible: true });
    }

    _handleSubmitEdit = (title, dateBegin, dateEnd, comment,) => {
        this.setState({ isSubmitting: true });
        const { navigation } = this.props;
        const { promoId } = navigation.state.params;

        update(
            {collection: PROMOTIONS, doc: promoId}, 
            {
                title: title,
                description: comment,
                beginDate: getTimeFromStringDate(dateBegin, "DD-MM-YYYY HH:mm"),
                endDate: getTimeFromStringDate(dateEnd, "DD-MM-YYYY HH:mm")
            }
        ).then(() => {
            this._hideFormPromo();
            toast.success("Votre promotion a été éditée avec succès.");
        })
        .catch((error) => {
            this.setState({ isSubmitting: false });
            toast.danger(CONNEXION_PROBLEM_MSG);
        });
    }

    _updateCover() {
        this.setState({ isUploading: true });
        
        ImagePicker.showImagePicker(IMAGEPICKEROPTIONS, (response) => {
            if(response.didCancel){
                this.setState({ isUploading: false });
            } else if(response.error){
                this.setState({ isUploading: false });
                toast.warning("Erreur de chargement : vérifier votre appareil photo.");
            } else {
                const { navigation, promotion } = this.props;
                const { image } = promotion.data;
                const { promoId } = navigation.state.params;

                updateFile(response.uri, PROMOTIONSTORAGE + response.fileName, image)
                .then((url) => {
                    update({collection: PROMOTIONS, doc: promoId}, {
                        image: url
                    }).then(() => {
                        this.setState({ isUploading: false });
                        toast.success("Cette photo a été éditée avec succès.");
                    })
                    .catch((error) => {
                        this.setState({ isUploading: false });
                        toast.danger(CONNEXION_PROBLEM_MSG);
                    });
                }).catch((error) => {
                    this.setState({ isUploading: false });
                    toast.danger(CONNEXION_PROBLEM_MSG);
                });
            }
        });
    }

    _deletePromo = () => {
        this.setState({ isConfirmProcessing: false });
        const { navigation } = this.props;
        const promoId = navigation.state.params.promoId;

        const query = {
            collection: PROMOTIONS,
            doc: promoId
        };

        update(query, { deleted: true }).then(() => {
            navigation.navigate("WappiPromo");
            toast.success("Cet événement a été supprimé avec succès.");
        }).catch((error) => {
            this.setState({ isConfirmProcessing: false });
            toast.danger(CONNEXION_PROBLEM_MSG)
        });
    }

    _loadPromotion = (promotion) => {
        const { isLoaded, isEmpty } = getStatus(promotion);

        if(!isLoaded) {
            return (
                <Spinner 
                    color="blue" 
                    containerStyle={{alignItems: 'center', marginTop: "50%"}} 
                />
            );
        } else if(isEmpty) {
            return (
                <View style={{alignItems: 'center', marginTop: "50%"}}>
                    <Text style={{color: 'white'}}>Erreur de connexion</Text>
                </View>
            );
        } else {
            const { 
                id,
                visible, beginDate, 
                endDate, description, 
                title, image, 
                commentsCount, likesCount 
            } = promotion.data;
            const { 
                isConfirmModalVisible, 
                isConfirmProcessing, 
                isUploading,
                isSubmitting,
                isFormVisible 
            } = this.state;

            return (
                <ScrollView style={{marginTop: 10}}>
                    <Image 
                        source={{uri: image}}
                        onError={() => {}}
                        style={{height: imageHeight, width: deviceWidth, backgroundColor: 'grey'}}
                    />
                    {!visible && 
                        <Icon 
                            type="font-awesome"
                            name="camera"
                            iconStyle={{color: "#7B7C9E"}}
                            containerStyle={styles.editCoverContainer}
                            onPress={() => this._updateCover()}
                        />
                    }
                    {!visible && isUploading &&
                        <Spinner 
                            color="blue" 
                            containerStyle={styles.uploadSpinnerContainer} 
                        />
                    }
                    <View style={{marginHorizontal: 10, marginTop: 10}}>
                        {!visible &&
                            <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'space-between'}}>
                                <Text style={{color: 'red'}}>En attente d'approbation</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Icon type="font-awesome" name="pencil"
                                        iconStyle={{color: '#7B7C9E'}} 
                                        onPress={() => this._openFormPromo()}
                                        containerStyle={{marginRight: 20}}
                                    />
                                    <Icon type="font-awesome" name="trash"
                                        iconStyle={{color: 'red'}} 
                                        onPress={() => this._showFormConfirm()}
                                    />
                                </View>
                                <ConfirmModal 
                                    title="Voulez-vous vraiment effectuer cette suppression ?"
                                    isVisible={isConfirmModalVisible}
                                    isLoading={isConfirmProcessing}
                                    hideForm={this._hideFormConfirm}
                                    handleConfirm={this._deletePromo}
                                />
                                <WappiPromoCommentFormEdit
                                    isVisible={isFormVisible}
                                    handleSubmit={this._handleSubmitEdit}
                                    hideForm={this._hideFormPromo}
                                    isLoading={isSubmitting}
                                    defaultTitle={title}
                                    defaultBeginDate={moment(new Date(beginDate)).format("DD-MM-Y HH:mm")}
                                    defaultEndDate={moment(new Date(endDate)).format("DD-MM-Y HH:mm")}
                                    defaultDescription={description}
                                />
                            </View>
                        }
                        <View style={{marginTop: 10}}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>
                                {title.toUpperCase()}
                            </Text>
                        </View>
                        <View style={{marginTop: 10}}>
                            <View>
                                <Text style={{color: 'white'}}>
                                    Debut : {moment(new Date(beginDate)).format("DD-MM-Y HH:mm")}
                                </Text>
                            </View>
                            <View style={{marginTop: 5}}>
                                <Text style={{color: 'white'}}>
                                    Fin : {moment(new Date(endDate)).format("DD-MM-Y HH:mm")}
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                            <Icon type="font-awesome" name="share-alt"
                                iconStyle={{color: 'red'}} 
                                onPress={() => this._onShare(promotion.data)}
                            />
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{color: '#7B7C9E'}}>{commentsCount}</Text>
                                <Icon type="font-awesome" name="comment" 
                                    iconStyle={{color: '#7B7C9E'}} 
                                    containerStyle={{marginLeft: 5}} 
                                    onPress={() => this._displayComments(id, title)}
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
                        <View style={{marginVertical: 10}}>
                            <Text numberOfLines={10} 
                                style={{color: 'white'}}>
                                Description : {description}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            );
        }
    }

    render() {
        const { navigation, promotion } = this.props;

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_line_bottom.png')}>
                <MainHeader 
                    title="details promotion"
                    uri={require('../../../assets/images/wappi.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                />
                {this._loadPromotion(promotion)}
            </MainView>    
        );
    }
}

const styles = StyleSheet.create({
    editCoverContainer: {
        position: 'absolute',
        top: hp("20%"),
        bottom: 0,
        left: wp("82%"),
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50,
        backgroundColor: 'white',
        borderRadius: 25
    },
    uploadSpinnerContainer: {
        position: 'absolute',
        top: "20%",
        bottom: 0,
        left: "1%",
        right: 0,
    }
});

const mapStateToProps = (state) => ({
    numero: state.profile.numero,
    raisonSociale: state.profile.raisonSociale,
    cover: state.profile.cover,
    promotion: state.firestoreListener.promotion
});

const mapActionsToProps = { setListener, unsetListener };

export default connect(mapStateToProps, mapActionsToProps)(WappiPromoDetails);