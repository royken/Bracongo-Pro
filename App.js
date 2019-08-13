import React, {Component} from 'react';
import { Provider } from 'react-redux';
import Navigation from './app/navigation/Navigation';
import store from './app/store/store';
import OneSignal from 'react-native-onesignal';
import SplashScreen from 'react-native-splash-screen'
import { 
    ONESIGNAL_APPID_PRO, COMMENTSALEPOINTTYPE, 
    QRCODETYPE, COMMENTPROMOTYPE 
} from './app/modules/core/constants';
import { toast } from './app/utils/toast';

export default class App extends Component {

    constructor(props) {
        super(props);

        OneSignal.init(ONESIGNAL_APPID_PRO, {kOSSettingsKeyAutoPrompt : true});
        OneSignal.addEventListener('opened', this.onOpened);
    }

    componentDidMount() {
        SplashScreen.hide();
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('opened', this.onOpened);
    }

    onOpened = (openResult) => {
        const data = openResult.notification.payload.additionalData;

        if(openResult.notification.isAppInFocus) {
            switch (data.type) {
                case COMMENTSALEPOINTTYPE:
                    toast.info("Nouveau commentaire : @" + data.author + " a donné un avis sur votre point de vente.");
                    break;

                case COMMENTPROMOTYPE:
                    toast.info("Nouveau commentaire : @" + data.author + " a commenté votre promotion.");
                    break;

                case QRCODETYPE:
                    toast.info("Nouvelle fidélité : @" + data.author + " était chez vous.");
                    break;    
            }
        }
    }

    render() {
        return (
            <Provider store={store}>
                <Navigation />
            </Provider>
        );
    }
}