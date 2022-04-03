import * as React from "react";
import styles from './index.module.scss';
import { Tabs, Tab, Typography, Box, Link, alertTitleClasses } from "@mui/material";
import deployedContracts from "../../hardhat/deployments/hardhat_contracts.json";
import { useContractKit } from "@celo-tools/use-contractkit";
import ConnectWalletButton from '../components/ConnectWalletButton'
import ProductsDisplay from "../components/ProductsDisplay";
import Checkout from "../components/Checkout";
import 'semantic-ui-css/semantic.min.css'
import axios from "axios";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const PRODUCTS = [
  {
    name: "Monkey #1000",
    price: 0.10,
    currency: "CELO",
    desc: 'Amazing monkey JPEG'
  },
]

export default function App() {
  const { network } = useContractKit();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [productId, setProductId] = React.useState(0);

  const contracts =
    deployedContracts[network?.chainId?.toString()]?.[
      network?.name?.toLocaleLowerCase()
    ]?.contracts;
  return (
    <div className={styles.checkoutWrapper}>
				<div className={styles.backgroundWrapper}>
					<div className={styles.background}>
						<div className={styles.background__middle1}/>
						<div className={styles.background__teal2Wrapper}>
							<div className={styles.background__teal2}/>
						</div>
						<div className={styles.background__middle3}/>
						<div className={styles.background__teal4Wrapper}>
							<div className={styles.background__teal4}/>
						</div>
					</div>
				</div>
      <ProductsDisplay products={PRODUCTS} productId={productId} setProductId={setProductId}/>
      <Checkout products={PRODUCTS} contractData={contracts?.CarboToken} productId={productId} setProductId={setProductId}/>
    </div>
  );
}