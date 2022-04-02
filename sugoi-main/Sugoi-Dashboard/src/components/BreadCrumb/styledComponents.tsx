import { styled } from '@stitches/react';

export const StyledBreadCrumbs = styled('div', {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-end',
	justifyContent: 'flex-end',
	height: '25px',
	fontWeight: '$bold',

	div: {
		display: 'flex'
	}
});

export const RightArrow = styled('div', {
	margin: '0 10px'
});
