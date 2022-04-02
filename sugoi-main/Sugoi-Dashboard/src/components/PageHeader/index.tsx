import * as React from 'react';
import { Helmet } from 'react-helmet';
import Nav from '../Nav';
import BreadCrumb from '../BreadCrumb';
import './index.scss';

interface Props {
	title?: string;
	callToAction?: any;
	breadcrumb?: any;
}

const PageHeader = (props: Props) => {
	const { title, callToAction, breadcrumb } = props;

	return (
		<>
			<Helmet>
				<title>Carbo by Qubo{title}</title>
			</Helmet>
 
			<div className="page-header">
				<Nav />
				{breadcrumb && breadcrumb.length && (
					<BreadCrumb sections={breadcrumb} />
				)}
				<p> Carbo <span>by Qubo </span></p>
			</div>
		</>
	);
};

export default PageHeader;
