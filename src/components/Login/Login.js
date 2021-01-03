import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login, register } from '../../actions/userActions';
import store from '../../store';
import './Login.css';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            signIn: {
                email: '',
                password: ''
            },
            signUp: {
                name: '',
                email: '',
                password: ''
            }
        };
    }

    componentDidUpdate() {
        if (localStorage.getItem('token')) {
            this.props.history.push('/addItem');
        }
    }

    onChange(e, isSignIn) {
        const { signIn, signUp } = this.state;
        this.setState({
            signIn: isSignIn ? { ...signIn, [e.target.name]: e.target.value } : signIn,
            signUp: !isSignIn ? { ...signUp, [e.target.name]: e.target.value } : signUp
        });
    }

    onSignIn = (e) => {
        const { signIn } = this.state;
        const { email, password } = signIn;
        e.preventDefault();
        const user = {
            email,
            password
        };
        this.props.login(user);
    }

    onSignUp = (e) => {
        const { signUp } = this.state;
        const { email, name, password } = signUp;
        e.preventDefault();
        const nameArr = name.split(' ');
        const user = {
            firstName: nameArr.length > 1 ? nameArr[0] : name,
            lastName: nameArr.length > 1 ? nameArr.splice(1).join(' ') : '',
            email,
            password
        };
        this.props.register(user);
    }

    loginFailErrorMessage = () => (
        <h3 className='login-fail-error-message'>{`Error: ${store.getState().userData.error}`}</h3>
    );

    registrationFailErrorMessage = () => (
        <h3 className='login-registration-fail-error-message'>{`Error: ${store.getState().userData.error}`}</h3>
    );

    slidePanel = (isSignUp) => {
        const container = document.getElementById('login-container');
        if (isSignUp) {
            container.classList.add('login-right-panel-active');
        } else {
            container.classList.remove('login-right-panel-active');
        }
    }

    displaySignUp = () => {
        const { signUp } = this.state;
        const { name, email, password } = signUp;
        return (
            <div className='login-form-container login-sign-up-container'>
                {store.getState().userData.error ? this.registrationFailErrorMessage() : ''}
                <form action='#'>
                    <h1>Create Account</h1>
                    <div className='login-social-container'>
                        <a href='/#'><i aria-label='facebook' className='fab fa-facebook-f' /></a>
                        <a href='/#'><i aria-label='google' className='fab fa-google-plus-g' /></a>
                        <a href='/#'><i aria-label='linkedin' className='fab fa-linkedin-in' /></a>
                    </div>
                    <span>or use your email for registration</span>
                    <input type='email' value={name} name='name' onChange={(e) => this.onChange(e, false)} placeholder='Name' />
                    <input type='email' value={email} name='email' onChange={(e) => this.onChange(e, false)} placeholder='Email' />
                    <input type='password' value={password} name='password' onChange={(e) => this.onChange(e, false)} placeholder='Password' />
                    <button onClick={this.onSignUp} type='button'>Sign Up</button>
                </form>
            </div>
        );
    }

    displaySignIn = () => {
        const { signIn } = this.state;
        const { email, password } = signIn;
        return (
            <div className='login-form-container login-sign-in-container'>
                {store.getState().userData.error ? this.loginFailErrorMessage() : ''}
                <form action='#'>
                    <h1>Sign in</h1>
                    <div className='login-social-container'>
                        <a href='/#'><i aria-label='facebook' className='fab fa-facebook-f' /></a>
                        <a href='/#'><i aria-label='google' className='fab fa-google-plus-g' /></a>
                        <a href='/#'><i aria-label='linkedin' className='fab fa-linkedin-in' /></a>
                    </div>
                    <span>or use your account</span>
                    <input type='email' value={email} name='email' onChange={(e) => this.onChange(e, true)} placeholder='Email' />
                    <input type='password' value={password} name='password' onChange={(e) => this.onChange(e, true)} placeholder='Password' />
                    <a href='/#'>Forgot your password?</a>
                    <button onClick={this.onSignIn} type='button'>Sign In</button>
                </form>
            </div>
        );
    }

    displayOverlayContainer = () => (
        <div className='login-overlay-container'>
            <div className='login-overlay'>
                <div className='login-overlay-panel login-overlay-left'>
                    <h1>Welcome Back!</h1>
                    <p>To keep connected with us please login with your personal info</p>
                    <button className='login-ghost' id='signIn' onClick={() => this.slidePanel(false)} type='button'>Sign In</button>
                </div>
                <div className='login-overlay-panel login-overlay-right'>
                    <h1>Hello, Friend!</h1>
                    <p>Enter your personal details and start journey with us</p>
                    <button className='login-ghost' id='signUp' onClick={() => this.slidePanel(true)} type='button'>Sign Up</button>
                </div>
            </div>
        </div>
    );

    render() {
        return (
            <div className='login-page'>
                <div className='login-container' id='login-container'>
                    {this.displaySignUp()}
                    {this.displaySignIn()}
                    {this.displayOverlayContainer()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    userData: state.userData
});

Login.propTypes = {
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    login: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { login, register })(Login);