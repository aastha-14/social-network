import React, { useState } from "react";
import { connect } from "react-redux";
import { addComment } from "../../actions/post";

function CommentForm({ postId, addComment }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addComment(postId, { text });
    setText("");
  };
  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Leave a comment</h3>
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

export default connect(null, { addComment })(CommentForm);
