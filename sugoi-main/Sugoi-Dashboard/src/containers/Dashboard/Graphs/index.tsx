import React from 'react';

/* Styles */
import styles from './index.module.scss';

/* Components */
import StatBox, { StyledStat } from '../../../components/StatBox';
import SmallGraph from '../../../components/SmallGraph';

interface Props {
	// campaigns: any[];
}
const Graphs = (props: Props) => {
	return (
		<section className={styles.graphsWrapper}>
			<div className={styles.topLeft}>
				<StatBox name="Total Emissions" stat={5000}/>
				<StatBox name="Total Emissions" stat={5000}/>
				<StatBox name="Total Emissions" stat={5000}/>
				<StatBox name="Total Emissions" stat={5000}/>
			</div>
			<SmallGraph size="small" className={styles.bottomLeft}/>
			<SmallGraph size="big" className={styles.middle}/>
			<SmallGraph size="small" type='bar' className={styles.topRight}/>
			<SmallGraph size="small" type='pie' className={styles.bottomRight}/>
		</section>
	);
};

export default Graphs;
