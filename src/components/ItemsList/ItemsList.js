import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, TextField, withStyles } from '@material-ui/core';
import { deleteItem, getItems, updateItem } from '../../actions/itemActions';
import store from '../../store';
import './ItemsList.css';

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

class ItemsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchBarTextField: '',
            sortBy: 'dateAdded',
            items: [],
            editItem: {
                itemId: '',
                nameTextField: '',
                costTextField: '',
                dateAddedTextField: '',
                purchaseByDateTextField: '',
                linkToProductTextField: ''
            },
            editItemErrorMessage: false,
            editItemSuccessMessage: false,
            justSorted: false
        };
    }

    componentDidMount() {
        this.props.getItems();
    }

    componentDidUpdate() {
        const { items, justSorted } = this.state;
        const storeItems = store.getState().itemData.items;
        if ((!_.isEqual(items, storeItems) && !justSorted) || (items.length === 0 && store.getState().itemData.items.length !== 0)) {
            this.setState({
                items: storeItems,
                justSorted: false
            });
        }
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

    deleteItem = (item) => {
        this.props.deleteItem(item);
        this.props.getItems();
        this.setState({
            items: []
        });
    }

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

    searchShoppingList = (item) => {
        const { searchBarTextField } = this.state;
        return item.name.toLowerCase().includes(searchBarTextField.toLowerCase())
               || item.cost.toString().toLowerCase().includes(searchBarTextField.toLowerCase())
               || item.dateAdded.toString().toLowerCase().includes(searchBarTextField.toLowerCase())
               || item.purchaseByDate.toString().toLowerCase().includes(searchBarTextField.toLowerCase())
               || item.linkToProduct.toLowerCase().includes(searchBarTextField.toLowerCase());
    }

    sortData = (param) => {
        const { items, sortBy } = this.state;
        const isReverse = items.length < 2 ? false : (items[0][sortBy] > items[1][sortBy]);
        this.setState({
            items: isReverse ? [...items].sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1)) : [...items].sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1)),
            sortBy: param,
            justSorted: true
        });
    }

    displayTableHeader = () => (
        <TableHead>
            <TableRow>
                <TableCell className='items-list-table-header'>Image</TableCell>
                <TableCell className='items-list-table-header' onClick={() => this.sortData('name')}>Name</TableCell>
                <TableCell className='items-list-table-header' onClick={() => this.sortData('cost')}>Cost</TableCell>
                <TableCell className='items-list-table-header' onClick={() => this.sortData('dateAdded')}>Date Added</TableCell>
                <TableCell className='items-list-table-header' onClick={() => this.sortData('purchaseByDate')}>Purchase By</TableCell>
                <TableCell className='items-list-table-header' onClick={() => this.sortData('linkToProduct')}>Link To Product</TableCell>
                <TableCell className='items-list-table-header'>Actions</TableCell>
            </TableRow>
        </TableHead>
    );

    searchBar = () => {
        const { deleteItemError, deleteItemSuccess } = store.getState().itemData;
        const { searchBarTextField } = this.state;
        return (
            <div className='items-list-search-bar-container'>
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

    displayTableBody = () => {
        const { items } = this.state;
        const { classes } = this.props;
        return (
            <TableBody>
                {items
                ? items.map((item, index) => (
                    this.searchShoppingList(item) ? (
                        <TableRow key={index}>
                            <TableCell>
                                <img className='items-list-image' src={item.itemURL} alt={item.name} />
                            </TableCell>
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
                    : <React.Fragment key={index} />
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

    editItem = () => {
        const { editItem } = this.state;
        const { nameTextField, costTextField, dateAddedTextField, purchaseByDateTextField, linkToProductTextField } = editItem;
        const { classes } = this.props;
        return (
            <div>
                <div className='edit-item-header-wrapper'>
                    <h2>Edit Item</h2>
                    <Button className={classes.updateItemButton} onClick={() => this.updateItem(editItem)}>Update</Button>
                    {this.displayUpdateMessage()}
                </div>
                <div className='edit-item-row'>
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

    render() {
        return (
            <div className='items-list-page'>
                <div className='items-list-container'>
                    {this.searchBar()}
                    <div className='items-list-table-container'>
                        {this.displayTable()}
                    </div>
                    {this.editItem()}
                </div>
            </div>
        );
    }
}

ItemsList.propTypes = {
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    deleteItem: PropTypes.func.isRequired,
    getItems: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    itemData: state.itemData
});

export default connect(mapStateToProps, { deleteItem, getItems, updateItem })(withStyles(styles)(ItemsList));