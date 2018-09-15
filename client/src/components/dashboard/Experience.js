import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { deleteExperience } from '../../actions/profileActions';

class Experience extends Component {

	onDeleteClick = expId => this.props.deleteExperience(expId);

	render() {

		const parseDate = (date, format = 'DD/MM/YYYY') => date ? moment(date).format(format) : 'Now';

		const experience = this.props.experience.map(exp => (
			<tr key={exp._id}>
				<td className="align-middle">{exp.company}</td>
				<td className="align-middle">{exp.title}</td>
				<td className="align-middle">{parseDate(exp.from)} - {parseDate(exp.to)}</td>
				<td className="align-middle"><button onClick={() => this.onDeleteClick(exp._id)} className="btn btn-sm btn-outline-danger">Delete</button></td>
			</tr>
		));

		return (
			<div>
				<h4 className="mb-4">Experience Credentials</h4>
				<div className="table-responsive">
					<table className="table">
						<thead className="thead-dark">
							<tr>
								<th>Company</th>
								<th>Title</th>
								<th>Years</th>
								<th></th>
							</tr>
						</thead>
						<tbody>{experience}</tbody>
					</table>
				</div>
			</div>
		)
	}
}

Experience.propTypes = {
	experience: PropTypes.array.isRequired,
	deleteExperience: PropTypes.func.isRequired,
}

export default connect(null, { deleteExperience })(Experience);
