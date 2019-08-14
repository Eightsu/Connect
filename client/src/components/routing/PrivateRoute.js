import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


// Export protected Route based on conditional
const PrivateRoute = ({ component: Component, auth: { isAuthenticated, isLoading }, ...rest }) => 
(<Route {...rest} render={props => !isAuthenticated && !isLoading ? (<Redirect to='/login'/>) : ( <Component {...props}/>)} />)

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired

}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute)
