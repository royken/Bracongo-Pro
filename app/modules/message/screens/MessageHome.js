import React, { Component } from 'react'
import { View, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { listMessages, cancelRequest } from '../../../store/actions';

import MainView from '../../core/layout/MainView';
import MainHeader from '../../core/layout/MainHeader';
import MessageItem from '../components/MessageItem';
import Spinner from '../../core/layout/Spinner';

class MessageHome extends Component {

    componentDidMount() {
        const { listMessages, numero } = this.props;
        listMessages(numero);
    }

    componentWillUnmount() {
        const { cancelRequest } = this.props;

        cancelRequest();
    }

    _renderItem = ({item}) => (
        <MessageItem 
            message={item}
        />
    )

    render() {
        const { navigation, isLoading, messages, numero, page, pageable, listMessages } = this.props;

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_line_bottom.png')}>
                <MainHeader 
                    title="messages"
                    uri={require('../../../assets/images/message.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                />
                {isLoading ?
                    <Spinner containerStyle={{marginTop: 150, alignItems: 'center'}} 
                        color="blue" /> 
                    :
                    isEmpty(messages) ? 
                    <View style={{alignItems: 'center', marginTop: 150}}>
                        <Text style={{color: 'white'}}>Aucun message trouvé.</Text>
                    </View>
                    :
                    <FlatList 
                        contentContainerStyle={{marginTop: 20}}
                        data={messages}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this._renderItem}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            if(pageable) {
                                listMessages(numero, page + 1);
                            }
                        }}
                    />
                }
            </MainView>
        );
    }
}

const mapStateToProps = (state) => ({
    numero: state.profile.numero,
    isLoading: state.uiLoading.isLoading,
    messages: state.messages.messages,
    page: state.messages.page,
    pageable: state.messages.pageable
});

const mapActionsToProps = { listMessages, cancelRequest };

export default connect(mapStateToProps, mapActionsToProps)(MessageHome);