import React, { Component } from 'react';
import moment from 'moment';

class ProfileCreds extends Component {
	render() {
		const { experience, education } = this.props;

		const parseDate = (date, format = 'DD/MM/YYYY') => date ? moment(date).format(format) : 'Now';

		const expItems = experience.map(exp => (
			<li key={exp._id} className="list-group-item">
				<h4>{exp.company}</h4>
				<p>{parseDate(exp.from)} - {parseDate(exp.to)}</p>
				<p><strong>Position: </strong>{exp.title}</p>
				{exp.location === '' ? null : <p><strong>Location: </strong>{exp.location}</p>}
				{exp.description === '' ? null : <p><strong>Description: </strong>{exp.description}</p>}
			</li>
		));

		const eduItems = education.map(edu => (
			<li key={edu._id} className="list-group-item">
				<h4>{edu.school}</h4>
				<p>{parseDate(edu.from)} - {parseDate(edu.to)}</p>
				<p><strong>Degree: </strong>{edu.degree}</p>
				<p><strong>Field of Study: </strong>{edu.fieldofstudy}</p>
				{edu.description === '' ? null : <p><strong>Description: </strong>{edu.description}</p>}
			</li>
		));

		return (
			<div className="row">
				{expItems.length > 0 &&
					<div className="col-md-6">
						<h3 className="text-center text-info">Experience</h3>
						<ul className="list-group">{expItems}</ul>
					</div>}
				{eduItems.length > 0 &&
					<div className="col-md-6">
						<h3 className="text-center text-info">Education</h3>
						<ul className="list-group">{eduItems}</ul>
					</div>}
			</div>
		)
	}
}

export default ProfileCreds;
