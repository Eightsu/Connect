import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loginUser } from '../../actions/auth';

const Login = ({loginUser, isAuthenticated}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  // This single handler will target the name attribute on each input and proceed to accept the value of said input
  const onSubmit = async e => {
    e.preventDefault();
    loginUser(email, password);
  }

  if(isAuthenticated){
    return <Redirect to="/dashboard" />
  }

  return (
    <Fragment><section className="container">
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into your account</p>
      <form className="form" onSubmit={e => onSubmit(e)} required>

        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password} onChange={e => onChange(e)} required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account <Link to="/register">Sign Up</Link>
      </p>
    </section>    </Fragment>
  )
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { loginUser })(Login);
