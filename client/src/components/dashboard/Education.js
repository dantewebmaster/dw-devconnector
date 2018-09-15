import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { deleteEducation } from '../../actions/profileActions';

class Education extends Component {

	onDeleteClick = eduId => this.props.deleteEducation(eduId);

	render() {

		const parseDate = (date, format = 'DD/MM/YYYY') => date ? moment(date).format(format) : 'Now';

		const education = this.props.education.map(edu => (
			<tr key={edu._id}>
				<td className="align-middle">{edu.school}</td>
				<td className="align-middle">{edu.degree}</td>
				<td className="align-middle">{parseDate(edu.from)} - {parseDate(edu.to)}</td>
				<td className="align-middle"><button onClick={() => this.onDeleteClick(edu._id)} className="btn btn-sm btn-outline-danger">Delete</button></td>
			</tr>
		));

		return (
			<div>
				<h4 className="mb-4">Education Credentials</h4>
				<div className="table-responsive">
					<table className="table">
						<thead className="thead-dark">
							<tr>
								<th>School</th>
								<th>Degree</th>
								<th>Years</th>
								<th></th>
							</tr>
						</thead>
						<tbody>{education}</tbody>
					</table>
				</div>
			</div>
		)
	}
}

Education.propTypes = {
	education: PropTypes.array.isRequired,
	deleteEducation: PropTypes.func.isRequired,
}

export default connect(null, { deleteEducation })(Education);
