import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import Share from 'react-native-share';
import { connect } from 'react-redux';
import { createQuery, uploadFile, add } from '../../../utils/firebase';
import { setPaginationListener, unsetPaginatorListener, getStatus } from '../../../core/actions/actions';
import { PROMOTIONS, PROMOTIONSTORAGE } from '../../../models/paths';
import MainView from '../../../core/layout/MainView';
import MainHeader from '../../../core/layout/MainHeader';
import Spinner from '../../../core/layout/Spinner';
import WappiPromoItem from './WappiPromoItem';
import WappiPromoCommentForm from './WappiPromoCommentForm';
import { toast } from '../../../utils/toast';
import { CONNEXION_PROBLEM_MSG } from '../../../core/constants';
import { getTimeFromStringDate, getCurrentDate } from '../../../utils/helper';

class WappiPromo extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            isFormVisible: false,
            isSubmitting: false
        };

        this.query = null;
    }

    componentDidMount() {
        const { setPaginationListener, numero } = this.props;

        this.query = createQuery({
            collection: PROMOTIONS,
            orderBy: [['createdAt', 'DESC']],
            where: [['numero', '==', numero], ['deleted', "==", false]],
            storeAs: 'promotions'
        });
        
        setPaginationListener(this.query);
    }

    componentWillUnmount() {
        if(this.query) {
            const { unsetPaginatorListener } = this.props;
            unsetPaginatorListener(this.query);
        }
    }

    _displayDetails = (promoId) => {
        const { navigation } = this.props;

        navigation.navigate("WappiPromoDetails", { promoId: promoId });
    }

    _share = (promo) => {
        const { raisonSociale, cover } = this.props;

        const options = {
            urls: [promo.image, cover],
            title: "Promotion point de vente " + raisonSociale,
            message: promo.description
        };

        Share.open(options).catch((error) => {});
    }

    _renderItem = ({item, index}) => {
        return (
            <WappiPromoItem promo={item} 
                displayDetails={this._displayDetails} 
                onShare={this._share} 
            />
        );
    }

    _loadPromotions(promotions) {
        const { isLoaded, isEmpty } = getStatus(promotions);

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
                    <Text style={{color: 'white'}}>Aucune promotion trouvée</Text>
                </View>
            );
        } else {
            const { data, willPaginate } = promotions;
            const { setPaginationListener } = this.props;

            return (
                <FlatList 
                    contentContainerStyle={{marginHorizontal: 10, marginVertical: 15}}
                    keyExtractor={(item, index) => item.id}
                    data={data}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if(willPaginate === true) {
                            setPaginationListener(this.query);
                        }
                    }}
                />
            );
        }
    }

    _hideFormPromo = () => {
        this.setState({ isFormVisible: false, isSubmitting: false });
    }

    _openFormPromo() {
        this.setState({ isFormVisible: true });
    }

    _handleSubmit = (title, dateBegin, dateEnd, comment, photoUri, photoName) => {
        this.setState({ isSubmitting: true });

        uploadFile(photoUri, PROMOTIONSTORAGE + photoName)
        .then((url) => {
            const { numero } = this.props;

            add(
                createQuery({collection: PROMOTIONS}), 
                {
                    numero: numero,
                    title: title,
                    description: comment,
                    beginDate: getTimeFromStringDate(dateBegin, "DD-MM-YYYY HH:mm"),
                    endDate: getTimeFromStringDate(dateEnd, "DD-MM-YYYY HH:mm"),
                    image: url,
                    likesCount: 0,
                    commentsCount: 0,
                    visible: false,
                    deleted: false,
                    createdAt: getCurrentDate()
                }
            ).then(() => {
                this._hideFormPromo();
                toast("Votre promotion a été éditée avec succès.", "success", 5000);
            })
            .catch((error) => {
                this.setState({ isSubmitting: false });
                toast(CONNEXION_PROBLEM_MSG, "danger", 5000);
            });

        }).catch((error) => {
            this.setState({ isSubmitting: false });
            toast(CONNEXION_PROBLEM_MSG, "danger", 5000);
        })
    }

    render() {
        const { navigation, promotions } = this.props;
        const { isFormVisible, isSubmitting } = this.state;

        return (
            <MainView containerStyle={{paddingBottom: 10}}
                backgroundImageUri={require('../../../assets/images/background_line_bottom.png')}>
                <MainHeader 
                    title="promotions"
                    uri={require('../../../assets/images/wappi.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                />
                <Icon 
                    type="font-awesome"
                    name="plus"
                    iconStyle={{color: '#7B7C9E'}}
                    containerStyle={styles.addButtonContainer}
                    onPress={() => this._openFormPromo()}
                />
                <WappiPromoCommentForm 
                    isVisible={isFormVisible}
                    handleSubmit={this._handleSubmit}
                    hideForm={this._hideFormPromo}
                    isLoading={isSubmitting}
                />
                {this._loadPromotions(promotions, setPaginationListener)}   
            </MainView>    
        );
    }
}

const styles = StyleSheet.create({
    addButtonContainer: {
        height: 40, 
        width: 40, 
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 10,
        marginLeft: "85%"
    }
});

const mapStateToProps = (state) => ({
    numero: state.profile.numero,
    raisonSociale: state.profile.raisonSociale,
    cover: state.profile.cover,
    promotions: state.firestorePaginator.promotions
});

export default connect(mapStateToProps, { setPaginationListener, unsetPaginatorListener })(WappiPromo);
