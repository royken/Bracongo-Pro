import React, { Component } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Overlay, Icon, Text } from 'react-native-elements';
import PropTypes from 'prop-types';

const currentYear = (new Date()).getFullYear();
const months = [
    {short: 'Jan', full: 'Janvier', num: 1},
    {short: 'Fev', full: 'Février', num: 2},
    {short: 'Mars', full: 'Mars', num: 3},
    {short: 'Avr', full: 'Avril', num: 4},
    {short: 'Mai', full: 'Mai', num: 5},
    {short: 'Juin', full: 'Juin', num: 6},
    {short: 'Juil', full: 'Juillet', num: 7},
    {short: 'Août', full: 'Août', num: 8},
    {short: 'Sept', full: 'Septembre', num: 9},
    {short: 'Oct', full: 'Octobre', num: 10},
    {short: 'Nov', full: 'Novembre', num: 11},
    {short: 'Dec', full: 'Décembre', num: 12},
];



class MYCalendar extends Component {

    constructor(props) {
        super(props);

        this.currentState = {
            selectedMonth: months[0].num,
            selectedYear: props.minYear,
            isReachedMaxYear: false,
            isReachedMinYear: true
        };

        this.state = {...this.currentState};
    }

    _increaseYear() {
        const { selectedYear, isReachedMaxYear } = this.state;
        const { maxYear, minYear } = this.props;

        if(!isReachedMaxYear) {
            this.setState({ 
                selectedYear: selectedYear + 1,
                isReachedMaxYear: (selectedYear + 1) === maxYear,
                isReachedMinYear: (selectedYear + 1) === minYear
            });
        }
    }

    _decreaseYear() {
        const { selectedYear, isReachedMinYear } = this.state;
        const { maxYear, minYear } = this.props;
        
        if(!isReachedMinYear) {
            this.setState({ 
                selectedYear: selectedYear - 1,
                isReachedMaxYear: (selectedYear - 1) === maxYear,
                isReachedMinYear: (selectedYear - 1) === minYear
            });
        }
    }

    _handleSelectedMonth(num) {
        this.setState({ selectedMonth: num });
    }

    _renderMonthYear = ({item}) => {
        return (
            <TouchableOpacity style={{ 
                flex: 1, 
                marginBottom: 40
            }} 
                onPress={() => this._handleSelectedMonth(item.num)}
            >
                <View style={{
                    backgroundColor: (this.state.selectedMonth === item.num) ? this.props.selectedBackgroundColor : 'white',
                    height: 40, width: 40,
                    borderRadius: 20,
                    alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <Text style={{
                            fontWeight: 'bold',
                            color: (this.state.selectedMonth === item.num) ? this.props.selectedColor : 'black'
                        }}
                    >
                    {item.short}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const { 
            headerTextColor, 
            headerBackgroundColor, 
            btnTextConfirm,
            btnTextCancel,
            btnTextConfirmColor,
            btnTextCancelColor,
            confirm,
            isVisible,
            hide
        } = this.props;
        
        const { selectedMonth, selectedYear, isReachedMinYear, isReachedMaxYear } = this.state;

        const selectedMonthYear = months[selectedMonth - 1].full + ', ' + selectedYear

        return (
            <Overlay isVisible={isVisible} 
                onBackdropPress={() => { this.setState({...this.currentState}); hide();}} 
                overlayBackgroundColor="white" height="77%"
            >
                <View>
                    <View style={{ 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: 50, 
                        backgroundColor: headerBackgroundColor 
                        }}
                    >
                        <Text style={{fontWeight: 'bold', color: headerTextColor}}>
                            {selectedMonthYear}
                        </Text>
                    </View>
                    <View style={styles.selectedYearContainer}>
                        <Icon 
                            type="font-awesome" 
                            name="chevron-left"
                            iconStyle={{color: isReachedMinYear ? 'grey' : headerBackgroundColor}}
                            onPress={() => this._decreaseYear()} 
                        />
                        <Text style={{color: 'black'}}>{selectedYear}</Text>
                        <Icon 
                            type="font-awesome" 
                            name="chevron-right" 
                            iconStyle={{color: isReachedMaxYear ? 'grey' : headerBackgroundColor}} 
                            onPress={() => this._increaseYear()}
                        />
                    </View>
                    <View style={styles.monthsContainerStyle}>
                        <FlatList 
                            extraData={selectedMonth}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={3}
                            renderItem={this._renderMonthYear}
                            data={months}
                        />
                    </View>
                    <View style={styles.btnContainerStyle}>
                        <TouchableOpacity style={{marginRight: 20}}
                            onPress={() => { this.setState({...this.currentState}); hide();}}
                        >
                            <Text style={{fontWeight: 'bold', color: btnTextCancelColor}}>
                                {btnTextCancel}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => {  
                                confirm(months[selectedMonth - 1].num, selectedYear);
                                this.setState({...this.currentState});
                                hide();
                            }}>
                            <Text style={{fontWeight: 'bold', color: btnTextConfirmColor}}>
                                {btnTextConfirm}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        );
    }
}

MYCalendar.defaultProps = {
    minYear: 2017,
    maxYear: currentYear,
    headerTextColor: 'white',
    headerBackgroundColor: 'blue',
    selectedColor: 'white',
    selectedBackgroundColor: 'blue',
    btnTextConfirm: 'VALIDER',
    btnTextCancel: 'ANNULER',
    btnTextConfirmColor: 'blue',
    btnTextCancelColor: 'blue',
    isVisible: false
};

MYCalendar.propTypes = {
    minYear: PropTypes.number,
    maxYear: PropTypes.number,
    headerTextColor: PropTypes.string,
    headerBackgroundColor: PropTypes.string,
    selectedColor: PropTypes.string,
    selectedBackgroundColor: PropTypes.string,
    btnTextCancel: PropTypes.string,
    btnTextConfirm: PropTypes.string,
    btnTextConfirmColor: PropTypes.string,
    btnTextCancelColor: PropTypes.string,
    confirm: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    isVisible: PropTypes.bool
};

const styles = StyleSheet.create({
    selectedYearContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40
    },
    btnContainerStyle: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'flex-end',
        marginVertical: 10
    },
    monthsContainerStyle: {
        marginLeft: "12%",
        marginVertical: 10
    }
});

export default MYCalendar;