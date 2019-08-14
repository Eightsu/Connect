import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';
import { deleteExperience } from '../../actions/profile'


//Experience to be pased in from Parent Component - Dashboard.
const Experience = ({ experience, deleteExperience }) => {

  const experiences = experience.map(exp => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td className='hide-sm'>{exp.title}</td>
      <td>
        <Moment format='DD/MM/YYYY' style={{ fontWeight: 'bold' }}>
          <strong>  {exp.from}</strong>
        </Moment>
        -
        {
          exp.to === null ? (<p style={{ fontWeight: 'bold' }}>Now</p>) : (
            <Moment format='DD/MM/YYYY' style={{ fontWeight: 'bold' }}>
              {exp.to}
            </Moment>
          )

        }
      </td>
      <td>
        <button className='btn btn-danger' onClick={() => deleteExperience(exp._id)}> 
        Delete</button>
      </td>
    </tr>
  ))
  return (
    <Fragment>
      <h2 className='my-2'>Experience Credentials</h2>
      <table className='table'>

        <thead>
          <tr>
            <th className='hide-sm'><>Company</></th>
            <th className='hide-sm'><>Title</></th>
            <th className='hide-sm'><>Years</></th>
            <th />
          </tr>
        </thead>

        <tbody>
          {experiences}
        </tbody>
      </table>
    </Fragment>
  )
}

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired,


}

export default connect(null, { deleteExperience })(Experience)
