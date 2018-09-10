import React from 'react';

export default ({ size, color }) => {
	const style = {
		color: color,
		fontSize: size,
		display: 'block',
		margin: '100px auto',
	}

	return (
		<div className="spinner">
			<i className="fa fa-cog fa-spin" style={style}></i>
		</div>
	)
}
