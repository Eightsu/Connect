import React, { Fragment } from 'react'
import PropTypes from 'prop-types';


const ProfileTop = ({ profile:
  {
    status, company, location, website, social,
    user: { name, avatar }
  }
}) => {
  return (
    <div className="profile-top bg-primary p-2">
      <img
        className="round-img my-1"
        src={avatar}
        alt=""
      />
      <h1 className="large">{name} </h1>
      <p className="lead">{status} {company && <span> at {company}</span>}</p>
      <p>{location && <span>{location}</span>}</p>
      <div className="icons my-1">
        {
          website && (
            <Fragment>
              <a href={'https://' + website} target="_blank" rel="noopener noreferrer">
                <i className="fas fa-globe fa-2x"></i>
              </a>
            </Fragment>
          )
        }
        {
          social && social.twitter && (
            <Fragment>
              <a href={'https://' + social.twitter} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter fa-2x"></i>
              </a>
            </Fragment>
          )
        }
        {social && social.facebook && (
          <Fragment>
            <a href={'https://' + social.facebook} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook fa-2x"></i>
            </a>
          </Fragment>
        )}
        {social && social.linkedin && (
          <Fragment>
            <a href={'https://' + social.linkedin} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin fa-2x"></i>
            </a>
          </Fragment>
        )}
        {social && social.youtube && (
          <Fragment>
            <a href={'https://' + social.youtube} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube fa-2x"></i>
            </a>
          </Fragment>
        )}
        {social && social.instagram && (
          <Fragment>
            <a href={'https://' + social.instagram} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram fa-2x"></i>
            </a>
          </Fragment>
        )}
        


        {/* <a href="#" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook fa-2x"></i>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin fa-2x"></i>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-youtube fa-2x"></i>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram fa-2x"></i>
        </a> */}
      </div>
    </div>
  )
}

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired,

}

export default ProfileTop
