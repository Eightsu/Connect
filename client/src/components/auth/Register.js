import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux'; // This connect thing will allow us to access the alert as an object
import { Link, Redirect} from 'react-router-dom';
import { setAlert } from '../../actions/alert'; // action must be passed into connect.
import { register} from '../../actions/auth';
import PropTypes from 'prop-types';


const Register = ({ setAlert, register, isAuthenticated }) => { // Desctructured from props
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  // This single handler will target the name attribute on each input and proceed to accept the value of said input
  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match','danger'); // 2nd Arg is alertType
    } else {
      register({
        name,
        email,
        password
      })
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />
  }


  return (
    <Fragment><section className="container">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)} required>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" value={name} onChange={e => onChange(e)} required />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required />
          <small className="form-text"
          >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2} onChange={e => onChange(e)} required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </section>    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);