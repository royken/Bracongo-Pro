import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { 
    setPaginationListener, 
    unsetPaginatorListener, 
    getStatus 
} from '../../../store/actions';
import { onSnapshot } from '../../../utils/firebase';

import { LOYALTIES } from '../../../models/paths';

import MainView from '../../core/layout/MainView';
import MainHeader from '../../core/layout/MainHeader';
import Spinner from '../../core/layout/Spinner';
import WappiLoyaltyItem from '../components/WappiLoyaltyItem';

const dimLoyaltyContent = wp("15%") + hp("10%");

class WappiLoyalty extends Component {

    constructor(props) {
        super(props);

        this.state = {
            totalScan: 0
        };

        this.query = null;
        this.unsubscribe = null;
    }

    componentDidMount() {
        const { setPaginationListener, numero } = this.props;
        
        this.query = {
            collection: LOYALTIES,
            orderBy: [['lastDate', 'DESC']],
            where: [['numero', "==", numero]],
            storeAs: 'loyalties'
        };
        
        setPaginationListener(this.query);

        this.unsubscribe = onSnapshot(
            (res) => {
                if(res.size > 0) {
                    let scansCount = 0;
                    const docs = res.docs;

                    docs.forEach((doc) => {
                        const val = isFinite(doc.data().scansCount) ?
                            doc.data().scansCount : 0;
                        scansCount += val;
                    });

                    this.setState({ totalScan: scansCount });
                }
            },
            (error) => {},
            this.query
        );
    }

    componentWillUnmount() {
        if(this.query) {
            const { unsetPaginatorListener } = this.props;
            unsetPaginatorListener(this.query);
        }

        if(this.unsubscribe) {
            this.unsubscribe();
        }
    }

    _renderItem = ({item, index}) => {
        const { byId } = this.props.loyalties;
        const fields = byId[item];
        
        return (
            <WappiLoyaltyItem 
                uid={fields.uid}
                scanDate={fields.lastDate}
                scansCount={fields.scansCount}
            />
        );
    }

    _displayLoyalties(loyalties) {
        const { isLoaded, isEmpty } = getStatus(loyalties);

        if(!isLoaded) {
            return (
                <Spinner  
                    color="blue" 
                    containerStyle={{alignItems: 'center', marginTop: "50%"}} 
                /> 
            );
        } else if(isEmpty) {
            return (
                <View style={{alignItems: 'center', marginTop: "30%"}}>
                    <Text style={{color: 'white'}}>Aucune fidélité trouvée</Text>
                </View>
            );
        } else {
            const { allIds, canPaginate } = loyalties;
            const { setPaginationListener } = this.props;

            return (
                <FlatList numColumns={3}
                    contentContainerStyle={{marginHorizontal: 10, marginTop: 10, marginBottom: 5}}
                    keyExtractor={(item, index) => item}
                    data={allIds}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if(canPaginate === true) {
                            setPaginationListener(this.query);
                        }
                    }}
                />
            );
        }
    }

    render() {
        const { navigation, loyalties } = this.props;
        const { totalScan } = this.state;

        return (
            <MainView containerStyle={{paddingBottom: 10}}
                backgroundImageUri={require('../../../assets/images/background_line_bottom.png')}>
                <MainHeader 
                    title="fidélité"
                    uri={require('../../../assets/images/wappi.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                />
                <View style={{alignItems: 'center', marginTop: "5%"}}>
                    <View style={styles.scoreContainer}>
                        <Text h4 style={{color: "#7B7C9E", fontWeight: 'bold'}}>{totalScan}</Text>
                    </View>
                </View>
                {this._displayLoyalties(loyalties)}
            </MainView>
        );
    }
}

const styles = StyleSheet.create({
    scoreContainer: {
        backgroundColor: 'white',
        width: dimLoyaltyContent, 
        height: dimLoyaltyContent, 
        borderRadius: Math.floor(dimLoyaltyContent / 2),
        alignItems: 'center',
        justifyContent: 'center'     
    }
});

const mapStateToProps = (state) => ({
    numero: state.profile.numero,
    loyalties: state.firestorePaginator.loyalties
});

const mapActionsToProps = { setPaginationListener, unsetPaginatorListener };

export default connect(mapStateToProps, mapActionsToProps)(WappiLoyalty);