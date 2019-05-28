import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import MainView from '../../../core/layout/MainView';
import MainHeader from '../../../core/layout/MainHeader';
import { createQuery } from '../../../utils/firebase';
import { PROMOTIONS, PROMOTION_COMMENTS } from '../../../models/paths';
import { setPaginationListener, unsetPaginatorListener, getStatus } from '../../../core/actions/actions';
import Spinner from '../../../core/layout/Spinner';
import CommentsItem from '../../../core/components/CommentsItem';

class WappiPromoComments extends Component {

    constructor(props) {
        super(props);

        this.query = null;
    }

    componentDidMount() {
        const { navigation, setPaginationListener } = this.props;
        const { promoId } = navigation.state.params;

        const collection = PROMOTIONS + "/" + promoId + "/" + PROMOTION_COMMENTS;
        this.query = createQuery({collection: collection, storeAs: "promoComments"});

        setPaginationListener(this.query);
    }

    componentWillUnmount() {
        if(this.query) {
            const { unsetPaginatorListener } = this.props;
            unsetPaginatorListener(this.query);
        }
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
            const { data, willPaginate } = comments;

            return (
                <FlatList
                    keyExtractor={(item, index) => item.id} 
                    data={data}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if(willPaginate) {
                            const { setPaginationListener } = this.props;
                            setPaginationListener(this.query);
                        }
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
    comments: state.firestoreListener.promoComments
});

export default connect(
    mapStateToProps, 
    { setPaginationListener, unsetPaginatorListener }
)(WappiPromoComments);