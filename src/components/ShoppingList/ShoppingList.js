import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, TextField, withStyles } from '@material-ui/core';
import { deleteItem, getItems, updateItem } from '../../actions/itemActions';
import store from '../../store';
import './ShoppingList.css';

const styles = {
    deleteItemButton: {
        backgroundColor: 'red',
        color: 'white'
    },
    editItemButton: {
        backgroundColor: 'blue',
        color: 'white',
        margin: '0px 30px 0px 0px'
    },
    updateItemButton: {
        backgroundColor: 'blue',
        color: 'white',
        margin: '20px 0px 10px 25px'
    }
};

class ShoppingList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchBarTextField: '',
            editItem: {
                itemId: '',
                nameTextField: '',
                costTextField: '',
                dateAddedTextField: '',
                purchaseByDateTextField: '',
                linkToProductTextField: ''
            },
            editItemErrorMessage: false,
            editItemSuccessMessage: false
        };
    }

    componentDidMount() {
        this.props.getItems();
    }

    changeState = (property, value) => {
        if (property === 'searchBarTextField') {
            this.setState({
                [property]: value
            });
        } else {
            const { editItem } = this.state;
            const { itemId, nameTextField, costTextField, dateAddedTextField, purchaseByDateTextField, linkToProductTextField } = editItem;
            this.setState({
                editItem: {
                    itemId,
                    nameTextField: property === 'nameTextField' ? value : nameTextField,
                    costTextField: property === 'costTextField' ? value : costTextField,
                    dateAddedTextField: property === 'dateAddedTextField' ? value : dateAddedTextField,
                    purchaseByDateTextField: property === 'purchaseByDateTextField' ? value : purchaseByDateTextField,
                    linkToProductTextField: property === 'linkToProductTextField' ? value : linkToProductTextField
                }
            });
        }
    }

    populateEditItem = (item) => {
        this.setState({
            editItem: {
                itemId: item._id,
                nameTextField: item.name,
                costTextField: item.cost,
                dateAddedTextField: item.dateAdded,
                purchaseByDateTextField: item.purchaseByDate,
                linkToProductTextField: item.linkToProduct
            }
        });
    }

    updateItem = async (item) => {
        if (item.itemId === '') {
            this.setState({
                editItemErrorMessage: true
            });
        } else {
            this.props.updateItem({
                id: item.itemId,
                name: item.nameTextField,
                cost: item.costTextField,
                dateAdded: item.dateAddedTextField,
                purchaseByDate: item.purchaseByDateTextField,
                linkToProduct: item.linkToProductTextField
            });
            this.setState({
                editItem: {
                    itemId: '',
                    nameTextField: '',
                    costTextField: '',
                    dateAddedTextField: '',
                    purchaseByDateTextField: '',
                    linkToProductTextField: ''
                },
                editItemErrorMessage: false,
                editItemSuccessMessage: true
            });
        }
    }

    deleteItem = (item) => {
        this.props.deleteItem(item);
    }

    searchBar = () => {
        const { deleteItemError, deleteItemSuccess } = store.getState().itemData;
        const { searchBarTextField } = this.state;
        return (
            <div className='search-bar-container'>
                <TextField
                    className='create-item-text-field'
                    value={searchBarTextField}
                    onChange={(e) => this.changeState('searchBarTextField', e.target.value)}
                    InputProps={{
                        disableUnderline: true,
                        className: 'create-item-text-field-text'
                    }}
                />
                {deleteItemSuccess ? <h2 className='delete-item-success-message'>Successfully deleted item!</h2> : ''}
                {!deleteItemSuccess && deleteItemError ? <h2 className='delete-item-fail-message'>Fafiled to delete item</h2> : ''}
            </div>
        );
    }

    searchShoppingList = (item) => {
        const { searchBarTextField } = this.state;
        return item._id.toString().includes(searchBarTextField)
               || item.name.toLowerCase().includes(searchBarTextField.toLowerCase())
               || item.cost.toString().toLowerCase().includes(searchBarTextField.toLowerCase())
               || item.dateAdded.toString().toLowerCase().includes(searchBarTextField.toLowerCase())
               || item.purchaseByDate.toString().toLowerCase().includes(searchBarTextField.toLowerCase())
               || item.linkToProduct.toLowerCase().includes(searchBarTextField.toLowerCase());
    }

    displayTableHeader = () => (
        <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Date Added</TableCell>
                <TableCell>Purchase By</TableCell>
                <TableCell>Link To Product</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
        </TableHead>
    );

    displayTableBody = () => {
        const { items } = store.getState().itemData;
        const { classes } = this.props;
        return (
            <TableBody>
                {items
                ? items.map((item) => (
                    this.searchShoppingList(item) ? (
                        <TableRow key={item._id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.cost}</TableCell>
                            <TableCell>{moment(item.dateAdded).utc().format('MM/DD/YYYY')}</TableCell>
                            <TableCell>{moment(item.purchaseByDate).utc().format('MM/DD/YYYY')}</TableCell>
                            <TableCell>{item.linkToProduct}</TableCell>
                            <TableCell>
                                <Button className={classes.editItemButton} onClick={() => this.populateEditItem(item)}>
                                    Edit
                                </Button>
                                <Button className={classes.deleteItemButton} onClick={() => this.deleteItem(item)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    )
                    : <React.Fragment key={item._id} />
                )) : ''}
            </TableBody>
        );
    }

    displayTable = () => (
        <Table>
            {this.displayTableHeader()}
            {this.displayTableBody()}
        </Table>
    );

    displayUpdateMessage = () => {
        const { editItemErrorMessage, editItemSuccessMessage } = this.state;
        if (editItemErrorMessage) {
            return (
                <h4 className='edit-item-error-message'>Please select an item</h4>
            );
        }
        if (editItemSuccessMessage) {
            return (
                <h4 className='edit-item-success-message'>Item updated!</h4>
            );
        }
        return (
            <React.Fragment />
        );
    }

    editItem = () => {
        const { editItem } = this.state;
        const { itemId, nameTextField, costTextField, dateAddedTextField, purchaseByDateTextField, linkToProductTextField } = editItem;
        const { classes } = this.props;
        return (
            <div>
                <div className='edit-item-header-wrapper'>
                    <h2>Edit Item</h2>
                    <Button className={classes.updateItemButton} onClick={() => this.updateItem(editItem)}>Update</Button>
                    {this.displayUpdateMessage()}
                </div>
                <div className='edit-item-row'>
                    <div className='edit-item-row-id'>
                        <h4>Id</h4>
                        <h5>{itemId}</h5>
                    </div>
                    {this.editItemTextField('Name', nameTextField)}
                    {this.editItemTextField('Cost', costTextField)}
                </div>
                <div className='edit-item-row'>
                    {this.editItemTextField('Date Added', dateAddedTextField)}
                    {this.editItemTextField('Purchase By Date', purchaseByDateTextField)}
                    {this.editItemTextField('Link to Product', linkToProductTextField)}
                </div>
            </div>
        );
    }

    editItemTextField = (title, value) => (
        <div className='edit-item-text-field-wrapper'>
            <h4>{title}</h4>
            <TextField className='edit-item-text-field' value={value} onChange={(e) => this.changeState(_.camelCase(title) + 'TextField', e.target.value)}
                InputProps={{
                    disableUnderline: true,
                    className: 'edit-item-text-field-text'
                }}
            />
        </div>
    );

    render() {
        return (
            <div className='items-page'>
                <div className='items-container'>
                    {this.searchBar()}
                    <div className='items-table-container'>
                        {this.displayTable()}
                    </div>
                    {this.editItem()}
                </div>
            </div>
        );
    }
}

ShoppingList.propTypes = {
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    deleteItem: PropTypes.func.isRequired,
    getItems: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    itemData: state.itemData
});

export default connect(mapStateToProps, { deleteItem, getItems, updateItem })(withStyles(styles)(ShoppingList));