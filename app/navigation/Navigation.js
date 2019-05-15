import React from 'react';
import { 
    createStackNavigator, 
    createSwitchNavigator,
    createAppContainer
} from 'react-navigation';
import SignIn from '../modules/sign/components/SignIn';
import Home from '../core/components/Home';
import PurchaseHome from '../modules/purchase/components/PurchaseHome';
import PurchaseMonth from '../modules/purchase/components/PurchaseMonth';
import PurchaseYear from '../modules/purchase/components/PurchaseYear';
import PurchaseDiscount from '../modules/purchase/components/PurchaseDiscount';
import MessageHome from '../modules/message/components/MessageHome';
import VanHome from '../modules/van/components/VanHome';
import WappiHome from '../modules/wappi/components/WappiHome';

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
        }
    },
    {
        initialRouteName: 'WappiHome',
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
        VanStack: {
            screen: VanStack
        },
        WappiStack: {
            screen: WappiStack
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

    render() {
        const Layout = createAppContainer(createMainNavigator());

        return (
            <Layout />
        );
    }
}

export default Navigation;