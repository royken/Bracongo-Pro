import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import { onSnapshot } from '../../../utils/firebase';
import { USERS } from '../../../models/paths';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

class WappiLoyaltyItem extends PureComponent {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            author: 'inconnu'
        };

        this.unsubscribe = null;
    }

    componentDidMount() {
        this._isMounted = true;
        const { uid } = this.props;
        const query = {collection: USERS, doc: uid};

        this.unsubscribe = onSnapshot(
            (querySnapShot) => {
                const doc = !isEmpty(querySnapShot.data()) ? querySnapShot.data() : null; 
                if(doc && this._isMounted) {
                    this.setState({ 
                        author: !isEmpty(doc.lastName) && !isEmpty(doc.firstName) ? doc.lastName + " " + doc.firstName : "inconnu"
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
        const { author } = this.state;
        const { scanDate, scansCount } = this.props;

        return (
            <View style={styles.mainContainer}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>{author.toUpperCase()}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{color: '#7B7C9E'}}>{scansCount}</Text>
                        <Icon type="font-awesome" name="qrcode" iconStyle={{color: '#7B7C9E'}} 
                            containerStyle={{marginLeft: 5}}
                        />
                    </View>
                    <Text>{moment(new Date(scanDate)).format('DD/MM/YY')}</Text>
                </View>
            </View>
        );
    }
}

WappiLoyaltyItem.propTypes = {
    uid: PropTypes.string.isRequired,
    scanDate: PropTypes.number.isRequired,
    scansCount: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
    mainContainer: {
        height: hp("12%"),
        width: "100%",
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'space-between',
        borderRadius: 10,
        marginTop: 10
    }
});

export default WappiLoyaltyItem;