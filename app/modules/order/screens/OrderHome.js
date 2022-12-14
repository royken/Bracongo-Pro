import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { isEmpty } from 'lodash';

import { 
    setPaginationListener, 
    unsetPaginatorListener, 
    getStatus,
    updateCart, 
    postCart, 
    initCart,
    cancelRequest,
    getData 
} from '../../../store/actions';
import { PRODUCTPRICES } from '../../../models/paths';
import { toast } from '../../../utils/toast';

import MainView from '../../core/layout/MainView';
import MainHeader from '../../core/layout/MainHeader';
import OrderItem from '../components/OrderItem';
import ConfirmModal from '../../core/layout/ConfirmModal';
import Spinner from '../../core/layout/Spinner';

const toDay = new Date();
const currentDate = moment(toDay).format("DD-MM-YY");
toDay.setTime(toDay.getTime() +  (2 * 24 * 60 * 60 * 1000));
const twoDayAgoDate = moment(toDay).format("DD-MM-YY");

class OrderHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isConfirmModalVisible: false,
            initList: false
        };

        this.query = {
            collection: PRODUCTPRICES,
            orderBy: [['code', 'DESC']],
            storeAs: 'productPrices'
        };
    }

    componentDidMount() {
        const { setPaginationListener } = this.props;

        setPaginationListener(this.query);
    }

    componentWillUnmount() {
        const { unsetPaginatorListener, initCart, cancelRequest } = this.props;

        unsetPaginatorListener(this.query);
        initCart();
        cancelRequest();
    }

    _renderHeader = () => {
        return (
            <View>
                <View style={{backgroundColor: "#7B7C9E", alignItems: "center", padding: 5}}>
                    <Text style={{color: "white"}}>Note</Text>
                </View>
                <Text style={{color: "white", padding: 5}}>
                    Pour vos ??v??nements sp??ciaux uniquement.{"\n"}
                    Note: Les commandes envoy??es ce jour ({ currentDate }) 
                    pourront ??tre livr??es le ({ twoDayAgoDate }) sous r??serve 
                    de la disponibilit?? du stock.
                </Text>
            </View>
        );
    }

    _increase = (unitPrice, amount, name, code) => {
        const { updateCart } = this.props;
        updateCart(unitPrice, amount, name, code);
    }

    _decrease = (unitPrice, amount, name, code) => {
        const { updateCart } = this.props;
        updateCart(unitPrice, amount, name, code, false);
    }

    _renderItem = ({item, index}) => {
        const { initList } = this.state;
        
        return (
            <OrderItem 
                product={item}
                kin={this.props.kin}
                increase={this._increase}
                decrease={this._decrease}
                init={initList}
            />
        );
    }

    _showFormConfirm = () => {
        this.setState({ isConfirmModalVisible: true });
    }

    _hideFormConfirm = () => {
        this.setState({ isConfirmModalVisible: false });
    }

    _processOrder = () => {
        const { numero, cart, postCart, initCart } = this.props;
        if(isEmpty(cart)) {
            toast.warning("Aucun produit n'a ??t?? choisi.");
            this._hideFormConfirm();
            return;
        }

        postCart(numero, cart)
        .then(() => {
                initCart();
                this.setState({ initList: !this.state.initList, isConfirmModalVisible: false });
                toast.success("Votre commande a ??t?? enregistr??e avec succ??s.");
            }
        ).catch((error) => {});

    }

    _loadProducts(products) {
        const { isLoaded, isError, isEmpty } = getStatus(products);

        if(!isLoaded) {
            return (
                <Spinner 
                    color="blue" 
                    containerStyle={{flex: 1, alignItems: 'center', marginTop: "10%"}} 
                /> 
            );
        } else if(isError) {
            return (
                <View style={{flex: 1, alignItems: 'center', marginTop: "10%"}}>
                    <Text style={{color: 'white'}}>Probl??me de connexion</Text>
                </View>
            ); 
        } else if(isEmpty) {
            return (
                <View style={{flex: 1, alignItems: 'center', marginTop: "10%"}}>
                    <Text style={{color: 'white'}}>Aucun produit trouv??</Text>
                </View>
            );
        } else {
            const data = getData(products);
            const { setPaginationListener } = this.props;
            
            return (
                <FlatList 
                    contentContainerStyle={styles.listContent}
                    keyExtractor={(item, index) => item.id}
                    data={data}
                    ItemSeparatorComponent={() => (<View style={{height: 10}}></View>)}
                    ListHeaderComponent={this._renderHeader}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        setPaginationListener(this.query, true);
                    }}
                />
            );
        }
    }

    render() {
        const { navigation, isLoading, products, details } = this.props;
        const { isConfirmModalVisible } = this.state;

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_line_bottom.png')}>
                <MainHeader 
                    title="commandes sp??ciales"
                    uri={require('../../../assets/images/special_order.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: hp('5%')}}
                />
                {this._loadProducts(products)}
                <View style={styles.details}>
                    <View style={styles.infoDetails}> 
                        <Text style={{color: "white"}}>Total</Text>
                        <Text style={{color: "white"}}>
                            {details.total} FC | {details.amount} CS
                        </Text>
                    </View>
                    <Button 
                        title="ENVOYER"
                        containerStyle={styles.buttonDetails}
                        onPress={this._showFormConfirm}
                    />
                </View>
                <ConfirmModal 
                    title="Veuillez confirmer votre commande"
                    isVisible={isConfirmModalVisible}
                    isLoading={isLoading}
                    hideForm={this._hideFormConfirm}
                    handleConfirm={this._processOrder}
                />
            </MainView>
        );
    }
}

const styles = StyleSheet.create({
    listContent: {
        marginHorizontal: 5,
        paddingTop: 5
    },
    details: {
        height: hp("14%"), 
        justifyContent: 'flex-end', 
        margin: 5
    },
    infoDetails: {
        backgroundColor: "#7B7C9E",
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5
    },
    buttonDetails: {
        marginTop: 5
    }
});

const mapStateToProps = (state) => ({
    isLoading: state.uiLoading.isLoading,
    numero: state.profile.numero,
    kin: state.profile.kin,
    products: state.firestorePaginator.productPrices,
    details: state.orders.details,
    cart: state.orders.cart
});

const mapActionsToProps = {
    setPaginationListener,
    unsetPaginatorListener,
    updateCart,
    postCart,
    initCart,
    cancelRequest
};

export default connect(mapStateToProps, mapActionsToProps)(OrderHome);