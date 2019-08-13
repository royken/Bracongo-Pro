import React, { PureComponent } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { ListItem, Image, Text, Icon } from 'react-native-elements';
import StarsVote from '../../core/layout/StarsVote';
import { isString, isEmpty, isFinite } from 'lodash';
import moment from 'moment';
import { USERS, NOTESALEPOINTS } from '../../../models/paths';
import { onSnapshot } from '../../../utils/firebase';
import PropTypes from 'prop-types';

const deviceDimWidth = Dimensions.get('window').width;
const cardWidth = Math.floor(deviceDimWidth / 2);

class WappiNoteItem extends PureComponent {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            author: "inconnu", 
            photo: "undefined",
            note: 0
        };

        this.unsubscribe = null;
        this.unsubscribeUserNote = null;
    }

    componentDidMount() {
        this._isMounted = true;
        const { typeId, uid } = this.props.post;
        const query = {collection: USERS, doc: uid};

        this.unsubscribe = onSnapshot(
            (querySnapShot) => {
                const doc = !isEmpty(querySnapShot.data()) ? querySnapShot.data() : null; 
                if(doc && this._isMounted) {
                    this.setState({ 
                        author: !isEmpty(doc.lastName) && !isEmpty(doc.firstName) ? doc.lastName + " " + doc.firstName : "inconnu",
                        photo: isString(doc.photoUrl) && !isEmpty(doc.photoUrl) ? doc.photoUrl : "undefined"
                    });
                }
            },
            (error) => {},
            query
        );
         
        const queryUserNote = {
            collection: NOTESALEPOINTS, 
            where: [["uid", "==", uid], ['numero', "==", typeId]],
            limit: 1
        };
        this.unsubscribeUserNote = onSnapshot(
            (querySnapShot) => {
                querySnapShot.docs.forEach((snap) => {
                    const doc = snap.data();                
                    if(this._isMounted && !isEmpty(doc)) {
                        this.setState({ note: doc.value });
                    }
                });
            },
            (error) => {},
            queryUserNote
        );
    }

    componentWillUnmount() {
        this._isMounted = false;

        if(this.unsubscribe) {
            this.unsubscribe();
        }

        if(this.unsubscribeUserNote) {
            this.unsubscribeUserNote();
        }
    }

    _displaySubItem(post, author, photo) {
        return (
            <View style={{backgroundColor: 'white', width: cardWidth, borderRadius: 10}}>
                <View>
                    <ListItem containerStyle={{borderRadius: 10}}
                        leftElement={
                            <Image 
                                source={{uri: photo}}
                                onError={() => {}}
                                style={{
                                    borderRadius: 15, 
                                    backgroundColor: 'grey', 
                                    height: 50, width: 50
                                }}
                            />
                        }
                        title={
                            <View>
                                <Text numberOfLines={1} 
                                    style={{color: 'black', fontWeight: 'bold'}}>
                                    {author}
                                </Text>
                            </View>
                        }
                        subtitle={
                            <View>
                                <Text>
                                    {moment(new Date(post.createdAt)).format('DD/MM/YYYY')}
                                </Text>
                                <StarsVote vote={isFinite(post.note) ? post.note : 0}  
                                    size={15} 
                                />
                            </View>
                        }
                    />
                    {isString(post.content) && !isEmpty(post.content) &&
                        <View style={{marginHorizontal: 10, marginBottom: 5}}>
                            <Text numberOfLines={6}>{post.content}</Text>
                        </View>
                    }
                    {isString(post.url) && !isEmpty(post.url) &&
                        <View style={{marginHorizontal: 10, marginBottom: 5}}>
                            <Image 
                                source={{uri: post.url}}
                                onError={() => {}}
                                style={{
                                    borderRadius: 5, 
                                    backgroundColor: 'grey', 
                                    height: 130, width: "100%"
                                }}
                            />
                        </View>
                    }
                </View>
                <View style={{marginHorizontal: 10, marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', marginRight: 0}}>
                        <Text style={{marginRight: 5}}>
                            {post.commentsCount ? post.commentsCount : 0}
                        </Text>
                        <Icon name="comment" type="font-awesome" 
                            iconStyle={{color: '#7B7C9E'}}
                        />
                    </View>
                    <View style={{flexDirection: 'row', marginLeft: 0}}>
                        <Text style={{marginRight: 5}}>
                            {post.likesCount ? post.likesCount : 0}
                        </Text>
                        <Icon name="heart" type="font-awesome" 
                            iconStyle={{color: '#7B7C9E'}}
                        />
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const { post, index } = this.props;
        const { author, photo, note } = this.state;
        const toPositionLeft = (index % 2) === 0;
        post.note = note;

        return (
            <View style={styles.main_container}>
                <ListItem 
                    containerStyle={{backgroundColor : null}}
                    rightElement={
                        toPositionLeft ? 
                        null : this._displaySubItem(post, author, photo)
                    }
                    leftElement={
                        toPositionLeft ? 
                        this._displaySubItem(post, author, photo) : null
                    }
                />
            </View>
        );
    }
}

WappiNoteItem.propTypes = {
    index: PropTypes.number,
    post: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    main_container: {
        marginHorizontal: 0
    }
});

export default WappiNoteItem;