import React, { Component } from 'react'
import { View, FlatList } from 'react-native';
import MainView from '../../../core/layout/MainView';
import MainHeader from '../../../core/layout/MainHeader';
import MessageItem from './MessageItem';

const messages = [
    {
        id: 1,
        content: "coolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcool" + 
        "coolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcool",
        url: null,
        date: "Mai 01, 17:59"
    },
    {
        id: 2,
        content: "coolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcool" + 
        "coolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcoolcool",
        url: require('../../../assets/images/background_line_bottom.png'),
        date: "Mai 01, 17:59"
    }
];

class MessageHome extends Component {

    _renderItem = ({item}) => (
        <MessageItem 
            date={item.date}
            content={item.content}
            url={item.url}
        />
    )

    render() {
        const { navigation } = this.props;

        return (
            <MainView 
                backgroundImageUri={require('../../../assets/images/background_line_bottom.png')}>
                <MainHeader 
                    title="messages"
                    uri={require('../../../assets/images/message.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                />
                <FlatList 
                    contentContainerStyle={{marginTop: 20}}
                    data={messages}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this._renderItem}
                />
            </MainView>
        );
    }
}

export default MessageHome;