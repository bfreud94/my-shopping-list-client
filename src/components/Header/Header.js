import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout } from '../../actions/userActions';
import { clearItems } from '../../actions/itemActions';
import './Header.css';

class Header extends Component {

    logout = () => {
        this.props.clearItems();
        this.props.logout();
    }

    render() {
        return (
            localStorage.getItem('token')
                ? (
                    <header className='header'>
                        My Shopping List
                        <br />
                        <React.Fragment>
                            <Link style={linkStyle} to="/addItem">Create Item | </Link>
                            <Link style={linkStyle} to="/itemsList">See All Items | </Link>
                            <Link style={linkStyle} to="/login" onClick={this.logout}>Logout</Link>
                        </React.Fragment>
                    </header>
                )
            : <React.Fragment />
        );
    }
}

Header.propTypes = {
    clearItems: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
};

const linkStyle = {
    color: '#ffffff',
    fontSize: '16px',
    textDecoration: 'none'
};

const mapStateToProps = (state) => ({
    userData: state.userData
});

export default connect(mapStateToProps, { clearItems, logout })(Header);