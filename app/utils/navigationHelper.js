/***************************/
/**** React navigation ****/
/*************************/

// Get active route name 
export function getActiveRouteName(navigationState) {
    
    if (!navigationState) {
      return null;
    }
    
    const route = navigationState.routes ? 
        navigationState.routes[navigationState.index] : navigationState;
    
    if (route.routes) {
      return getActiveRouteName(route);
    } 
    
    return route.routeName;
}