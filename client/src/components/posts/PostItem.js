import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { deletePost, addLike, removeLike } from '../../actions/postActions';

class PostItem extends Component {

  onDeleteClick = postId => this.props.deletePost(postId);

  onLikeClick = postId => this.props.addLike(postId);

  onUnlikeClick = postId => this.props.removeLike(postId);

  findUserLike = (likes) => {
    const { auth } = this.props;
    return likes.filter(like => like.user === auth.user.id).length > 0;
  }

  render() {
    const { post, auth, showActions } = this.props;
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img className="d-none d-md-block" src={post.avatar} alt={post.name} />
            </a>
            <br />
            <p className="text-center">{post.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text}</p>
            {showActions &&
              <div className="post-actions">
                <button onClick={() => this.onLikeClick(post._id)} type="button" className="btn btn-light mr-1">
                  <i className={classnames('fas fa-thumbs-up', {
                    'text-danger': this.findUserLike(post.likes)
                  })}></i>
                  <span className="badge badge-light">{post.likes.length}</span>
                </button>
                <button onClick={() => this.onUnlikeClick(post._id)} type="button" className="btn btn-light mr-1">
                  <i className="text-secondary fas fa-thumbs-down"></i>
                </button>
                <Link to={`/post/${post._id}`} className="btn btn-info mr-1">Comments</Link>
                {post.user === auth.user.id &&
                  <button
                    type="button"
                    className="btn btn-danger mr-1"
                    onClick={() => this.onDeleteClick(post._id)}
                  >
                    <i className="fas fa-times" />
                  </button>}
              </div>}
          </div>
        </div>
      </div>
    )
  }
}

PostItem.propTypes = {
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  showActions: PropTypes.func,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

PostItem.defaultProps = {
  showActions: true,
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deletePost, addLike, removeLike })(PostItem);
