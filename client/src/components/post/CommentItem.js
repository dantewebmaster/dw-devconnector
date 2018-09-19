import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteComment } from '../../actions/postActions';

class CommentItem extends Component {
  onDeleteClick = (postId, commentId) => {
    this.props.deleteComment(postId, commentId);
  };

  render() {
    const { comment, postId, auth } = this.props;

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <Link to={`/profiles/${comment.user}`}>
              <img src={comment.avatar} alt={comment.name} className="d-none d-md-block" />
            </Link>
            <br />
            <p className="text-center">{comment.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{comment.text}</p>
            {comment.user === auth.user.id &&
              <button
                type="button"
                className="btn btn-danger mr-1"
                onClick={() => this.onDeleteClick(postId, comment._id)}
              >
                <i className="fas fa-times" />
              </button>}
          </div>
        </div>
      </div>
    )
  }
}

CommentItem.propTypes = {
  deleteComment: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
