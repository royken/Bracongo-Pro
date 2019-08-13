import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { isFinite } from 'lodash';

import { 
    setPaginationListener, 
    unsetPaginatorListener, 
    getStatus 
} from '../../../store/actions';
import { onSnapshot } from '../../../utils/firebase';

import { POSTS, NOTESALEPOINTS } from '../../../models/paths';

import MainView from '../../core/layout/MainView';
import MainHeader from '../../core/layout/MainHeader';
import Spinner from '../../core/layout/Spinner';
import WappiNoteItem from '../components/WappiNoteItem';
import StarsVote from '../../core/layout/StarsVote';

class WappiNote extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            vote: 0,
            voteNumber: 0
        };

        this.query = null;
        this.unsubscribeNotes = null;
    }

    componentDidMount() {
        const { setPaginationListener, numero } = this.props;

        this.query = {
            collection: POSTS,
            orderBy: [['createdAt', 'DESC']],
            where: [["typeId", "==", numero], ['deleted', "==", false]],
            storeAs: 'notes'
        };
        
        setPaginationListener(this.query);

        const queryNotes = {collection: NOTESALEPOINTS, where: [["numero", "==", numero]]};
        this.unsubscribeNotes = onSnapshot(
                                    (querySnapShot) => {
                                        const size = querySnapShot.size;

                                        if(size > 0) {
                                            let totalNote = 0;

                                            querySnapShot.docs.forEach((snap) => {
                                                const value = isFinite(snap.data().value) ?
                                                                snap.data().value : 0;
                                                totalNote = totalNote + value;
                                            });
                                        
                                            this.setState({ 
                                                vote: Math.floor(totalNote / size),
                                                voteNumber: size,
                                            });
                                        }
                                        
                                    },
                                    (error) => {},
                                    queryNotes
                                );
    }

    componentWillUnmount() {
        if(this.query) {
            const { unsetPaginatorListener } = this.props;
            unsetPaginatorListener(this.query);
        }

        if(this.unsubscribeNotes) {
            this.unsubscribeNotes();
        }
    }

    _renderItem = ({item, index}) => {
        const { byId } = this.props.notes;

        return (
            <WappiNoteItem post={byId[item]} index={index} />
        );
    }

    _loadNotes(notes) {
        const { isLoaded, isEmpty } = getStatus(notes);

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
                    <Text style={{color: 'white'}}>Aucun avis trouvé</Text>
                </View>
            );
        } else {
            const { allIds, canPaginate } = notes;
            const { setPaginationListener } = this.props;

            return (
                <FlatList 
                    contentContainerStyle={{marginHorizontal: 10, marginTop: 5, marginBottom: 5}}
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
        const { navigation, notes } = this.props;
        const { vote, voteNumber } = this.state;

        return (
            <MainView containerStyle={{paddingBottom: 10}}
                backgroundImageUri={require('../../../assets/images/background_line_bottom.png')}>
                <MainHeader 
                    title="avis"
                    uri={require('../../../assets/images/wappi.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                />
                <View style={styles.noteContainer}>
                    <StarsVote vote={vote} />
                    <View>
                        <Text style={{color: 'white'}}>
                            ({voteNumber}) {vote}
                        </Text>
                    </View>
                </View>
                {this._loadNotes(notes)}
            </MainView>
        );
    }
}

const mapStateToProps = (state) => ({
    numero: state.profile.numero,
    notes: state.firestorePaginator.notes
});

const styles = StyleSheet.create({
    noteContainer: {
        flexDirection: 'row', 
        marginTop: 20, 
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapActionsToProps = { setPaginationListener, unsetPaginatorListener };

export default connect(mapStateToProps, mapActionsToProps)(WappiNote);