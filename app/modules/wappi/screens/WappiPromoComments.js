import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';

import { 
    setPaginationListener, 
    unsetPaginatorListener, 
    getStatus, getData 
} from '../../../store/actions';

import { PROMOTION_COMMENTS } from '../../../models/paths';

import MainView from '../../core/layout/MainView';
import MainHeader from '../../core/layout/MainHeader';
import Spinner from '../../core/layout/Spinner';
import CommentsItem from '../../core/components/CommentsItem';

class WappiPromoComments extends Component {

    constructor(props) {
        super(props);

        const { promoId } = props.navigation.state.params;
        this.query = {
            collection: PROMOTION_COMMENTS, 
            orderBy: [['createdAt', 'DESC']],
            where: [["promoId", "==", promoId], ['deleted', "==", false]],
            storeAs: "promoComments"
        };
    }

    componentDidMount() {
        const { setPaginationListener } = this.props;
        setPaginationListener(this.query);
    }

    componentWillUnmount() {
        const { unsetPaginatorListener } = this.props;
        unsetPaginatorListener(this.query);
    }

    _renderItem = ({item, index}) => {
        return (
            <CommentsItem 
                uid={item.uid}
                date={item.createdAt}
                comment={item.content}
            />
        );
    }

    _loadComments(comments) {
        const { isLoaded, isEmpty } = getStatus(comments);

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
                    <Text style={{color: 'white'}}>Aucun commentaire trouvé</Text>
                </View>
            );
        } else {
            const data = getData(comments);
            const { setPaginationListener } = this.props;

            return (
                <FlatList
                    keyExtractor={(item, index) => item.id} 
                    data={data}
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
        const { navigation, comments } = this.props;
        const { promoTitle } = navigation.state.params;

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_line_bottom.png')}>
                <MainHeader 
                    title="commentaires promotion"
                    uri={require('../../../assets/images/wappi.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                />
                <View style={{marginVertical: 10, alignItems: 'center'}}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                        {promoTitle.toUpperCase()}
                    </Text>
                </View>
                {this._loadComments(comments)}
            </MainView>
        );
    }
}

const mapStateToProps = (state) => ({
    comments: state.firestorePaginator.promoComments
});

const mapActionsToProps = { setPaginationListener, unsetPaginatorListener };

export default connect(mapStateToProps, mapActionsToProps)(WappiPromoComments);