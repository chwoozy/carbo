import React from 'react';
import { Table } from 'rsuite';
import { SMALL_WIDTH } from '../../../consts/table';

/* Components */
import StatusCell from '../../../components/TableCells/StatusCell';
import history from '../../../utils/History';

/* Styles */
import styles from './index.module.scss';
import './tableReset.scss';
import 'rsuite/dist/styles/rsuite-default.css';

interface Props {
	campaigns: any[];
}
const CampaignList = (props: Props) => {
	const { campaigns } = props;
	return (
		<section className={styles.campaignTableWrapper}>
			<Table
				height={400}
				id="campaignTable"
				data={campaigns}
				hover={false}
				onRowClick={(data: any) => {
					console.log(data);
				}}
			>
				<Table.Column
					width={SMALL_WIDTH}
					fixed
					verticalAlign="middle"
					align="left"
				>
					<Table.HeaderCell>Name</Table.HeaderCell>
					<Table.Cell dataKey="campaignName" />
				</Table.Column>

				<Table.Column width={SMALL_WIDTH} verticalAlign="middle" align="left">
					<Table.HeaderCell>Status</Table.HeaderCell>
					<StatusCell dataKey="status" />
				</Table.Column>
				<Table.Column width={SMALL_WIDTH} verticalAlign="middle" align="left">
					<Table.HeaderCell>Start Date</Table.HeaderCell>
					<Table.Cell dataKey="startDate" />
				</Table.Column>
				<Table.Column width={SMALL_WIDTH} verticalAlign="middle" align="left">
					<Table.HeaderCell>End Date</Table.HeaderCell>
					<Table.Cell dataKey="endDate" />
				</Table.Column>
			</Table>
		</section>
	);
};

export default CampaignList;
