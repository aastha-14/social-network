import React, { useState } from "react";
import { connect } from "react-redux";
import { addEducation } from "../../actions/profile";
import { Link, withRouter } from "react-router-dom";

function AddEducation({ addEducation, history }) {
  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    from: "",
    to: "",
    current: "",
    description: "",
  });
  const [toDateDisabled, toggleDisabled] = useState(false);

  const {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description,
  } = formData;
  const handleSubmit = (e) => {
    e.preventDefault();
    addEducation(formData, history);
  };

  return (
    <div>
      <h1 className="large text-primary">Add An Education</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any school/bootcamp you have
        attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* School or bootcamp"
            name="school"
            required
            value={school}
            onChange={(e) => {
              setFormData({ ...formData, school: e.target.value });
            }}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree or certificate"
            name="degree"
            required
            value={degree}
            onChange={(e) => {
              setFormData({ ...formData, degree: e.target.value });
            }}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Field Of Study"
            name="fieldOfStudy"
            value={fieldOfStudy}
            onChange={(e) => {
              setFormData({ ...formData, fieldOfStudy: e.target.value });
            }}
          />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            name="from"
            value={from}
            onChange={(e) => {
              setFormData({ ...formData, from: e.target.value });
            }}
          />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              value={current}
              checked={current}
              onChange={(e) => {
                setFormData({ ...formData, current: !current });
                toggleDisabled(!toDateDisabled);
              }}
            />{" "}
            Currently Pursuing
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            disabled={toDateDisabled ? "disabled" : ""}
            value={to}
            onChange={(e) => {
              setFormData({ ...formData, to: e.target.value });
            }}
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
            value={description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
            }}
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </div>
  );
}

export default connect(null, { addEducation })(withRouter(AddEducation));
