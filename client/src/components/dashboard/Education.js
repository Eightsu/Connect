import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';
import { deleteEducation } from '../../actions/profile';


//Education to be pased in from Parent Component - Dashboard.
const Education = ({ education, deleteEducation }) => {

  const educationArray = education.map(edu => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className='hide-sm'>{edu.degree}</td>
      <td>
        <Moment format='DD/MM/YYYY' style={{ fontWeight: 'bold' }}>
          <strong>  {edu.from}</strong>
        </Moment>
        -
        {
          edu.to === null ? (<p style={{ fontWeight: 'bold' }}>Now</p>) : (
            <Moment format='DD/MM/YYYY' style={{ fontWeight: 'bold' }}>
              {edu.to}
            </Moment>
          )

        }
      </td>
      <td>
        <button className='btn btn-danger' onClick={() => deleteEducation(edu._id)}>
          Delete</button>
      </td>
    </tr>
  ))
  return (
    <Fragment>
      <h2 className='my-2'>Education Credentials</h2>
      <table className='table'>

        <thead>
          <tr>
            <th className='hide-sm'>School</th>
            <th className='hide-sm'>Degree</th>
            <th className='hide-sm'>Years</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {educationArray}
        </tbody>
      </table>
    </Fragment>
  )
}

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired,


}

export default connect(null, { deleteEducation })(Education)
