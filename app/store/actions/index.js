import { cancelRequest } from './uiLoading';
import { 
    setListener, 
    setPaginationListener, 
    unsetListener, 
    unsetPaginatorListener,
    getStatus,
    getData 
} from './firestore';
import { 
    setProfileListener, 
    getDiscountAndTurnover, 
    setPlayerId, 
    unsetProfileListener 
} from './profile';
import { signIn, signOut } from './signs';
import { getVanTrucks } from './trucks';
import { listMessages } from './messages';
import { listComplaints, newComplaint } from './complaints';
import { 
    getMonthPurchases, 
    getYearPurchases, 
    getMonthDiscountAndTurnoverByDate 
} from './purchases';
import { postCart, updateCart, initCart } from './orders';

export default {
    cancelRequest,
    setListener, 
    setPaginationListener, 
    unsetListener, 
    unsetPaginatorListener,
    getStatus,
    getData,
    setProfileListener, 
    getDiscountAndTurnover, 
    setPlayerId, 
    unsetProfileListener,
    signIn, 
    signOut,
    getVanTrucks,
    listMessages,
    listComplaints, 
    newComplaint,
    getMonthPurchases, 
    getYearPurchases, 
    getMonthDiscountAndTurnoverByDate, 
    postCart, 
    updateCart, 
    initCart
};
