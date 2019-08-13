import React from 'react';
import { 
    createStackNavigator, 
    createSwitchNavigator,
    createAppContainer
} from 'react-navigation';
import OneSignal from 'react-native-onesignal';
import { connect } from 'react-redux';

import { setPlayerId } from '../store/actions';
import { getActiveRouteName } from '../utils/navigation';
import { getCurrentUserId, get } from '../utils/firebase';
import { logAnalytic } from '../api/bracongoApi';
import { SALEPOINTS } from '../models/paths';

import SignIn from '../modules/sign/screens/SignIn';
import Home from '../modules/core/screens/Home';
import PurchaseHome from '../modules/purchase/screens/PurchaseHome';
import PurchaseMonth from '../modules/purchase/screens/PurchaseMonth';
import PurchaseYear from '../modules/purchase/screens/PurchaseYear';
import PurchaseDiscount from '../modules/purchase/screens/PurchaseDiscount';
import MessageHome from '../modules/message/screens/MessageHome';
import ComplaintHome from '../modules/complaint/screens/ComplaintHome';
import VanHome from '../modules/van/screens/VanHome';
import WappiHome from '../modules/wappi/screens/WappiHome';
import WappiPromo from '../modules/wappi/screens/WappiPromo';
import WappiPromoDetails from '../modules/wappi/screens/WappiPromoDetails';
import WappiPromoComments from '../modules/wappi/screens/WappiPromoComments';
import WappiPhoto from '../modules/wappi/screens/WappiPhoto';
import WappiLoyalty from '../modules/wappi/screens/WappiLoyalty';
import WappiNote from '../modules/wappi/screens/WappiNote';
import OrderHome from '../modules/order/screens/OrderHome';

const PurchaseStack = createStackNavigator(
    {
        PurchaseHome: {
            screen: PurchaseHome
        },
        PurchaseMonth: {
            screen: PurchaseMonth
        },
        PurchaseYear: {
            screen: PurchaseYear
        },
        PurchaseDiscount: {
            screen: PurchaseDiscount
        }
    },
    {
        initialRouteName: 'PurchaseHome',
        defaultNavigationOptions: {
            header: null
        }
    }
);

const MessageStack = createStackNavigator(
    {
        MessageHome: {
            screen: MessageHome
        }
    },
    {
        initialRouteName: 'MessageHome',
        defaultNavigationOptions: {
            header: null
        }
    }
);

const ComplaintStack = createStackNavigator(
    {
        ComplaintHome: {
            screen: ComplaintHome
        }
    },
    {
        initialRouteName: 'ComplaintHome',
        defaultNavigationOptions: {
            header: null
        }
    }
);

const VanStack = createStackNavigator(
    {
        VanHome: {
            screen: VanHome
        }
    },
    {
        initialRouteName: 'VanHome',
        defaultNavigationOptions: {
            header: null
        }
    }
);

const WappiStack = createStackNavigator(
    {
        WappiHome: {
            screen: WappiHome
        },
        WappiPromo: {
            screen: WappiPromo
        },
        WappiPromoDetails: {
            screen: WappiPromoDetails
        },
        WappiPromoComments: {
            screen: WappiPromoComments
        },
        WappiPhoto: {
            screen: WappiPhoto
        },
        WappiLoyalty: {
            screen: WappiLoyalty
        },
        WappiNote: {
            screen: WappiNote
        }
    },
    {
        initialRouteName: 'WappiHome',
        defaultNavigationOptions: {
            header: null
        }
    }
);

const OrderStack = createStackNavigator(
    {
        OrderHome: {
            screen: OrderHome
        }
    },
    {
        initialRouteName: 'OrderHome',
        defaultNavigationOptions: {
            header: null
        }
    }
);

const MainStackNavigator = createStackNavigator(
    {
        Home: {
            screen: Home
        },
        PurchaseStack: {
            screen: PurchaseStack
        },
        MessageStack: {
            screen: MessageStack
        },
        ComplaintStack: {
            screen: ComplaintStack
        },
        VanStack: {
            screen: VanStack
        },
        WappiStack: {
            screen: WappiStack
        },
        OrderStack: {
            screen: OrderStack
        }
    },
    {
        initialRouteName: 'Home',
        defaultNavigationOptions: {
            header: null
        }
    }
);

const createMainNavigator = () => {
    return createSwitchNavigator(
        {  
            SignIn: SignIn,
            MainStack: MainStackNavigator
        },
        {
            initialRouteName: "SignIn"
        }
    );
}

class Navigation extends React.Component {

    constructor(props) {
        super(props);

        OneSignal.addEventListener('ids', this.onIds);
    }

    componentDidMount() {
        OneSignal.configure();
    }

    onIds = (device) => { 
        const { setPlayerId } = this.props;

        setPlayerId(device.userId);
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('ids', this.onIds);
    }

    render() {
        const Layout = createAppContainer(createMainNavigator());

        return (
            <Layout 
                onNavigationStateChange={(prevState, currentState, action) => {
                    const currentScreen = getActiveRouteName(currentState);
                    const prevScreen = getActiveRouteName(prevState);
                    const currentUserUid = getCurrentUserId();
                    const query = {collection: SALEPOINTS, doc: currentUserUid};

                    if(currentUserUid && prevScreen !== currentScreen) {
                        get(query)
                        .then((doc) => {
                            const data = doc.data();
                            if(data) {
                                logAnalytic(data.numero, currentScreen).catch((error) => {});
                            }
                        })
                        .catch((error) => {});
                    }
                }}
            />
        );
    }
}

export default connect(null, { setPlayerId })(Navigation);