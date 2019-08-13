import Toast from 'react-native-root-toast';

function triggerToast(message, type, duration, position){

    let msgType
    switch(type){
        case 'success':
            msgType = ['#155724', '#d4edda']
            break
        case 'primary':
            msgType = ['#004085', '#cce5ff']
            break
        case 'warning':
            msgType = ['#856404', '#fff3cd']
            break
        case 'info': 
            msgType = ['#0c5460', '#d1ecf1']
            break
        case 'danger': 
            msgType = ['#721c24', '#f8d7da']
            break
        default:
            msgType = ['#1b1e21', '#d6d8d9']                    
    }

    let toastPosition
    switch(position){
        case "bottom":
            toastPosition = Toast.positions.BOTTOM
            break
        case "center":
            toastPosition = Toast.positions.CENTER
            break    
        case "top":
            toastPosition = Toast.positions.TOP
            break    
        default:
            toastPosition = Toast.positions.BOTTOM    
    }

    Toast.show(message, {
        duration: duration,
        position: toastPosition,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: msgType[0],
        textColor: msgType[1]
    });

}

export const toast = {
    success: function(message, duration = 5000, position = "bottom") {
        triggerToast(message, "success", duration, position);
    },
    info: function(message, duration = 5000, position = "bottom") {
        triggerToast(message, "info", duration, position);
    },
    warning: function(message, duration = 5000, position = "bottom") {
        triggerToast(message, "warning", duration, position);
    },
    danger: function(message, duration = 5000, position = "bottom") {
        triggerToast(message, "danger", duration, position);
    },
    primary: function(message, duration = 5000, position = "bottom") {
        triggerToast(message, "primary", duration, position);
    }
};