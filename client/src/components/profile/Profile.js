import React, { useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import { getUserProfile } from "../../actions/profile";
import { Link } from "react-router-dom";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";

function Profile({
  getUserProfile,
  profile: { profile, loading },
  auth,
  match,
}) {
  useEffect(() => {
    getUserProfile(match.params.id);
  }, [getUserProfile, match.params.id]);
  return (
    <div>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <>
          <Link to="/profiles" className="btn btn-white">
            Back to Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}
          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className=" profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.experience.length > 0 ? (
                <>
                  {profile.experience.map((experience) => (
                    <ProfileExperience
                      experience={experience}
                      key={experience._id}
                    />
                  ))}
                </>
              ) : (
                <h4>No Experience Credentials</h4>
              )}
            </div>
            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profile.education.length > 0 ? (
                <>
                  {profile.education.map((education) => (
                    <ProfileEducation
                      education={education}
                      key={education._id}
                    />
                  ))}
                </>
              ) : (
                <h4>No Education Credentials</h4>
              )}
            </div>
            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getUserProfile })(Profile);
