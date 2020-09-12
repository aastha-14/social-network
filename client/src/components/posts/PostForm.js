import React, { useState } from "react";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";

function PostForm({ addPost }) {
  const [text, setText] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    addPost({ text });
    setText("");
  };
  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form className="form my-1" onSubmit={handleSubmit}>
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          required
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
}

export default connect(null, { addPost })(PostForm);
