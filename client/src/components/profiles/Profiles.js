import React, { useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import { getProfiles } from "../../actions/profile";
import ProfileItem from "./ProfileItem";

function Profiles({ getProfiles, profile: { profiles, loading } }) {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);
  return (
    <div>
      {profiles === null || loading ? (
        <Spinner />
      ) : (
        <>
          <h1 className="large text-primary"></h1>
          <p className="lead">
            <i className="fab fa-connectdevelop "></i> Browse and connect with
            developers
          </p>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found!</h4>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  profile: state.profile,
});
export default connect(mapStateToProps, { getProfiles })(Profiles);
