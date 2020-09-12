import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../layouts/Spinner";
import { getPost } from "../../actions/post";
import PostItem from "../posts/PostItem";
import CommentForm from "../post/CommentForm";
import CommentItem from "../post/CommentItem";

function Post({ getPost, post: { post, loading }, match }) {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost]);
  return (
    <div>
      {loading || post === null ? (
        <Spinner />
      ) : (
        <>
          <Link to="/posts" className="btn">
            Back To Posts{" "}
          </Link>
          <PostItem post={post} showActions={false} />
          <CommentForm postId={post._id} />
          <div className="comments">
            {post.comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={post._id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({ post: state.post });
export default connect(mapStateToProps, { getPost })(Post);
