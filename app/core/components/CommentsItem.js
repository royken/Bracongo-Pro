import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, Text } from 'react-native-elements';
import moment from 'moment';
import PropTypes from 'prop-types';
import { onSnapshot, createQuery } from '../../utils/firebase';
import { USERS } from '../../models/paths';
import { isEmpty, isString } from 'lodash';

class CommentsItem extends PureComponent {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            author: "",
            photo: "undefined"
        };

        this.unsubscribe = null;
    }

    componentDidMount() {
        this._isMounted = true;
        const { uid } = this.props;
        
        const query = createQuery({collection: USERS, doc: uid});
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
    }

    componentWillUnmount() {
        this._isMounted = false;
        if(this.unsubscribe) {
            this.unsubscribe();
        }
    }

    render() {
        const { comment, date } = this.props;
        const { author, photo } = this.state;

        return (
            <View style={styles.main_container}>
                <View style={styles.author_container}>
                    <Image containerStyle={styles.image_container} 
                        source={{uri: photo}} 
                        onError={() => {}}
                        style={styles.image_style}
                    />
                    <Text style={{color: "white"}}>{author}</Text>
                </View>
                <View style={styles.note_container}>
                    <Text style={{color: "white"}}>{moment(new Date(date)).format('DD-MM-YYYY')}</Text>
                </View>
                <View style={styles.comment_container}>
                    {comment !== null && 
                        <Text style={{color: "white"}}>{comment}</Text>
                    }
                </View>
            </View>
        );
    }
}

CommentsItem.propTypes = {
    uid: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
    main_container: {
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    author_container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image_container: {
        backgroundColor: "grey",
        marginRight: 10,
        height: 50,
        width: 50,
        borderRadius: 25
    },
    image_style: {
        height: 50,
        width: 50,
        borderRadius: 25
    },
    note_container: {
        marginVertical: 10
    },
    comment_container: {
        marginBottom: 5
    }
});

export default CommentsItem;