/* eslint-disable react/state-in-constructor */
// Basic Imports
import React, { useEffect } from 'react';
// import { connect } from 'react-redux';
import { TabPanel } from 'react-tabs';


/* Styles */
import styles from './index.module.scss';

/* Components */
import PageHeader from '../../components/PageHeader';
import OrdersTable from '../../containers/Dashboard/OrdersTable';
import CTAButton from '../../components/CTAButton';
import TabsWrapper from '../../components/TabsWrapper';
import SmallGraph from '../../components/SmallGraph';
import Graphs from '../../containers/Dashboard/Graphs';

/* Data */
import { campaigns } from '../../consts/brandCampaigns';
import axios from 'axios';
import StatBox from '../../components/StatBox';

const OrdersPage = () => {
	const [selectedTabList, setSelectedTabList] = React.useState<number>(0);
	const [userData, setUserData] = React.useState<any>();
	useEffect(() => {
		axios.get('/merchants/3/orders').then((res) => {setUserData(res); console.log(userData)}).catch((err)=> {console.log(err)})
		console.log(userData)
	  }, []);
	const handleTabChange = (index: number) => {
		setSelectedTabList(index);
	};
	return (
		<>
			<main className="page-container">
				<PageHeader
					title="Orders"
					breadcrumb={[
						{ content: 'Home', to: '/orders' },
						{ content: 'Orders' }
					]}
					callToAction=""
				/>
				<Graphs/>
			</main>
		</>
	);
};

export default OrdersPage;
