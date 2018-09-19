import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextareaFieldGroup from '../common/TextareaFieldGroup';
import { addComment } from '../../actions/postActions';

class CommentForm extends Component {
  state = {
    text: '',
    errors: {},
  }

  componentDidUpdate(prevProps) {
    const { errors } = this.props;
    if (prevProps.errors !== errors && errors) {
      this.setState({ errors });
    }
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const { auth: { user }, addComment, postId } = this.props;

    const newComment = {
      text: this.state.text,
      name: user.name,
      avatar: user.avatar,
    }

    addComment(postId, newComment);
    this.setState({ text: '' });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">Make a comment...</div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextareaFieldGroup
                  placeholder="Reply to post"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={errors.text}
                />
              </div>
              <button type="submit" className="btn btn-dark">Submit</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth,
});

export default connect(mapStateToProps, { addComment })(CommentForm);
