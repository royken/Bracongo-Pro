import React, {Component} from 'react';
import { Provider } from 'react-redux';
import Navigation from './app/navigation/Navigation';
import store from './app/store/store';

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Navigation />
            </Provider>
        );
    }
}