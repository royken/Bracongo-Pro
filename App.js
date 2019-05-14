import React, {Component} from 'react';
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import Navigation from './app/navigation/Navigation';
import store from './app/store/store';

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated'
]);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Navigation />
            </Provider>
        );
    }
}