import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Text, Image, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import Share from 'react-native-share';
import { setListener, unsetListener, getStatus } from '../../../core/actions/actions';
import { createQuery, update } from '../../../utils/firebase';
import { PROMOTIONS } from '../../../models/paths';
import Spinner from '../../../core/layout/Spinner';
import MainView from '../../../core/layout/MainView';
import MainHeader from '../../../core/layout/MainHeader';
import moment from 'moment';
import ConfirmModal from '../../../core/layout/ConfirmModal';
import { toast } from '../../../utils/toast';
import { CONNEXION_PROBLEM_MSG } from '../../../core/constants';

const deviceWidth = Dimensions.get('window').width;
const imageHeight = Math.floor(deviceWidth / 2); 

class WappiPromoDetails extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            isConfirmModalVisible: false,
            isConfirmProcessing: false
        };

        this.query = null;
    }

    componentDidMount() {
        const { setListener, navigation } = this.props;
        const promoId = navigation.state.params.promoId;

        this.query = createQuery({
            collection: PROMOTIONS,
            doc: promoId,
            storeAs: 'promotion'
        });

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
            urls: [promo.image, cover],
            title: "Promotion point de vente " + raisonSociale,
            message: promo.description
        };

        Share.open(options).catch((error) => {});
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

    _deletePromo = () => {
        this.setState({ isConfirmProcessing: false });
        const { navigation } = this.props;
        const promoId = navigation.state.params.promoId;

        const query = createQuery({
            collection: PROMOTIONS,
            doc: promoId
        });

        update(query, { deleted: true }).then(() => {
            navigation.navigate("WappiPromo");
            toast("Cet événement a été supprimé avec succès.", "success", 5000);
        }).catch((error) => {
            this.setState({ isConfirmProcessing: false });
            toast(CONNEXION_PROBLEM_MSG, "danger", 5000)
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
            const { isConfirmModalVisible, isConfirmProcessing } = this.state;

            return (
                <ScrollView style={{marginTop: 10}}>
                    <Image 
                        source={{uri: image}}
                        onError={() => {}}
                        style={{height: imageHeight, width: deviceWidth, backgroundColor: 'grey'}}
                    />
                    <View style={{marginHorizontal: 10, marginTop: 10}}>
                        {!visible &&
                            <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'space-between'}}>
                                <Text style={{color: 'red'}}>En attente d'approbation</Text>
                                <Icon type="font-awesome" name="trash"
                                    iconStyle={{color: 'red'}} 
                                    onPress={() => this._showFormConfirm()}
                                />
                                <ConfirmModal 
                                    title="Voulez-vous vraiment effectuer cette suppression ?"
                                    isVisible={isConfirmModalVisible}
                                    isLoading={isConfirmProcessing}
                                    hideForm={this._hideFormConfirm}
                                    handleConfirm={this._deletePromo}
                                />
                            </View>
                        }
                        <View style={{marginTop: 10}}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>
                                {title.toUpperCase()}
                            </Text>
                        </View>
                        <View style={{marginTop: 10, flexDirection: 'row'}}>
                            <View>
                                <Text style={{color: 'white'}}>
                                    Debut : {moment(new Date(beginDate)).format("DD-MM-Y HH:mm")}
                                </Text>
                            </View>
                            <View style={{marginLeft: 20}}>
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

const mapStateToProps = (state) => ({
    numero: state.profile.numero,
    raisonSociale: state.profile.raisonSociale,
    cover: state.profile.cover,
    promotion: state.firestoreListener.promotion
});

export default connect(mapStateToProps, { setListener, unsetListener })(WappiPromoDetails);