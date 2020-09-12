import React from "react";
import Moment from "react-moment";
function ProfileEducation({
  education: { school, degree, fieldOfStudy, to, from, description },
}) {
  return (
    <div>
      <h3 className="text-dark">{school}</h3>
      <p>
        <Moment format="YYYY-MM-DD">{from}</Moment>
        {!to ? " Now" : <Moment format="YYYY-MM-DD">{to}</Moment>}
      </p>
      <p>
        <strong>Degree:</strong> {degree}
      </p>
      <p>
        <strong>Description:</strong> {description}
      </p>
      <p>
        <strong>Field Of Study:</strong> {fieldOfStudy}
      </p>
    </div>
  );
}

export default ProfileEducation;
