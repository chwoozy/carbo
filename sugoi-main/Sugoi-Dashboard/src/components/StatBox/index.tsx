import React from 'react';
import { styled } from '@stitches/react';

export const StyledStat = styled('div', {
	background: '$teal1',
	boxShadow: '$small',
	width: 'max-content',
	height: 'max-content',
	minHeight: '100px',
	minWidth: '100px',
	borderRadius: '7px',
	display: 'flex',
	padding: '$small',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
});

export const StatText = styled('span', {
	display: 'flex',
	fontSize: '$subtitle20',
	fontWeight: '$bold',
	color: '$teal12',
	marginBottom: '$minute',
});

export const Name = styled('span', {
	fontSize: '8px',
	fontWeight: '$extrabold',
	color: '$sage11',
	textTransform: 'uppercase',
});

interface Props {
	name: string;
	stat: number;
	prepend?: string;
	append?: string;
	className?: string;
}

const StatBox = (props: Props) => {
	const { name, stat, prepend, append, className } = props;
	return (
		<StyledStat className={className}>
			<StatText>
				{prepend}
				&nbsp;	{stat}&nbsp;
				{append}
			</StatText>
			<Name>{name}</Name>
		</StyledStat>
	);
};

export default StatBox;
