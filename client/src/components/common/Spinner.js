import React from 'react';

export default ({ size, color }) => {
	const style = {
		color: color || '#17a2b8',
		fontSize: size || 40,
		display: 'block',
		margin: '100px auto',
	}

	return (
		<div className="spinner">
			<i className="fa fa-cog fa-spin" style={style}></i>
		</div>
	)
}
