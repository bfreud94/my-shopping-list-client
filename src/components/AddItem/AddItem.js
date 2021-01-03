import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { TextField, withStyles } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { addItem, clearAddItem } from '../../actions/itemActions';
import store from '../../store';
import './AddItem.css';

const styles = {
    addItemTextFieldText: {
        border: '0.5px solid #a3A6aa',
        borderRadius: '3px',
        fontSize: '16px',
        margin: '0px 0px 0px 0px',
        padding: '5px 5px 5px 10px'
    },
    addItemButton: {
        backgroundColor: 'green',
        borderRadius: '10px',
        color: 'white',
        height: '40px',
        margin: '0px 20px 0px 0px',
        padding: '0px 45px'
    },
    clearButton: {
        backgroundColor: 'red',
        borderRadius: '10px',
        color: 'white',
        height: '40px',
        margin: '0px 0px 0px 0px',
        padding: '0px 45px'
    },
    addItemDatePicker: {
        height: '15px',
        padding: '0px 0px 0px 5px'
    }
};

class AddItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemNameTextField: '',
            costTextField: '',
            purchaseByDate: new Date(),
            linkToProductTextField: '',
            addedItemSuccessMessage: false
        };
    }

    componentWillUnmount() {
        this.props.clearAddItem();
    }

    changeState = (property, value) => {
        this.setState({
            [property]: value
        });
    }

    clearTextFields = () => {
        this.setState({
            itemNameTextField: '',
            costTextField: '',
            purchaseByDate: new Date(),
            linkToProductTextField: '',
            addedItemSuccessMessage: false
        });
    }

    addItemSuccessMessage = () => {
        const { addedItemSuccessMessage } = this.state;
        return (
            addedItemSuccessMessage
                ? <h3 className='add-item-success-message'>Item successfully created!</h3>
                : <React.Fragment />
        );
    }

    addItem = () => {
        const { itemNameTextField, costTextField, purchaseByDate, linkToProductTextField } = this.state;
        this.props.addItem({
            name: itemNameTextField,
            cost: costTextField,
            purchaseByDate,
            linkToProduct: linkToProductTextField
        });
        this.setState({
            itemNameTextField: '',
            costTextField: '',
            purchaseByDate: new Date(),
            linkToProductTextField: ''
        });
    }

    displayTextField = (title, value, isFirst) => {
        const { classes } = this.props;
        return (
            <div className={`add-item-row-wrapper ${isFirst ? 'add-item-row-second-item' : ''}`}>
                <TextField value={value} onChange={(e) => this.changeState(_.camelCase(title) + 'TextField', e.target.value)} placeholder={title}
                    InputProps={{
                        disableUnderline: true,
                        className: `${classes.addItemTextFieldText} ${title === 'Item Name' || title === 'Link To Product' ? 'add-item-row-item-name' : ''}`
                    }}
                />
            </div>
        );
    }

    displayCalendarSelect = (title) => {
        const { classes } = this.props;
        const { purchaseByDate } = this.state;
        return (
            <span className='add-item-date-picker-wrapper'>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker disableToolbar autoOk variant='inline' format='MM/dd/yyyy' margin='normal' value={purchaseByDate} onChange={(e) => this.changeState(_.camelCase(title), e)}
                        KeyboardButtonProps={{
                            'aria-label': 'change date'
                        }}
                        InputProps={{
                            className: classes.addItemDatePicker,
                            disableUnderline: true
                        }}
                    />
                </MuiPickersUtilsProvider>
            </span>
        );
    }

    addItemSuccessMessage = () => (
        <h2 className='add-item-success-message'>Item successfully added!</h2>
    );

    addItemFailMessage = () => {
        const errors = store.getState().itemData.addItemErrors;
        const errorMessage = errors.length > 1 ? 'Multiple form errors' : `${errors[0].error} - ${_.startCase(errors[0].field)}`;
        return (
            <h2 className='add-item-fail-message'>{`Error: ${errorMessage}`}</h2>
        );
    };

    render() {
        const { itemNameTextField, costTextField, linkToProductTextField } = this.state;
        const { classes } = this.props;
        return (
            <div className='add-item-page'>
                <div className='add-item-container'>
                    {store.getState().itemData.addItemSuccess ? this.addItemSuccessMessage() : ''}
                    {store.getState().itemData.addItemErrors ? this.addItemFailMessage() : ''}
                    <h1 className='add-item-header'>Add an item to your shopping list</h1>
                    <div className='add-item-row'>
                        {this.displayTextField('Item Name', itemNameTextField, false)}
                    </div>
                    <div className='add-item-row'>
                        {this.displayTextField('Cost', costTextField, false)}
                        {this.displayCalendarSelect('Purchase By Date')}
                    </div>
                    <div className='add-item-row'>
                        {this.displayTextField('Link To Product', linkToProductTextField, false)}
                    </div>
                    <div className='add-buttons-row'>
                        <button className={classes.addItemButton} onClick={this.addItem} type='button'>Add Item</button>
                        <button className={classes.clearButton} onClick={this.clearTextFields} type='button'>Clear</button>
                    </div>
                </div>
            </div>
        );
    }
}

AddItem.propTypes = {
    addItem: PropTypes.func.isRequired,
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    clearAddItem: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    itemData: state.itemData
});

export default connect(mapStateToProps, { addItem, clearAddItem })(withStyles(styles)(AddItem));