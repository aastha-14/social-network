import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
  GET_REPOS,
  NO_REPOS,
} from "../actions/types";

// Get current user profile

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/myProfile");
    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (e) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status },
    });
  }
};

// Get all profiles

export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get("/api/profile");
    dispatch({ type: GET_PROFILES, payload: res.data });
  } catch (e) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status },
    });
  }
};

// Get profile by id

export const getUserProfile = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);
    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (e) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status },
    });
  }
};

//  Get user repos from github

export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NO_REPOS,
    });
  }
};

// Create or update profile

export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };
  try {
    const res = axios.post("/api/profile", formData, config);
    dispatch({ type: GET_PROFILE, payload: res.data });

    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));
    history.push("/dashboard");

    if (!edit) {
      history.push("/dashboard");
    }
  } catch (e) {
    const errors = e.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status },
    });
  }
};

// Add experience

export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const res = await axios.put("/api/profile/experience", formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Experience Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// Add education

export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const res = await axios.put("/api/profile/education", formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Education Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete expereience

export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert("Expereience Removed", "success"));
  } catch (e) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status },
    });
  }
};

// Delete education

export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert("Education Removed", "success"));
  } catch (e) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status },
    });
  }
};

// Delete Account

export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure?")) {
    try {
      await axios.delete("/api/profile");
      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });
      dispatch(setAlert("You account has been deleted", "success"));
    } catch (e) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: e.response.statusText, status: e.response.status },
      });
    }
  }
};
