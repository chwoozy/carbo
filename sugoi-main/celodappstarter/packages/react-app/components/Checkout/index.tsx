import * as React from "react";
import { Dropdown, Input } from 'semantic-ui-react'

import { Box, Button, Divider, Grid, Typography, Link } from "@mui/material";
import { create } from "ipfs-http-client";
import { useInput } from "@/hooks";
import axios from "axios";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState } from "react";
import { SnackbarAction, useSnackbar } from "notistack";
import { hexNumberToInteger, truncateAddress } from "@/utils";
import { Storage } from "../../../hardhat/types/Storage";
import { useQuery, gql } from "@apollo/client";
import styles from "./index.module.scss";
import ConnectWalletButton from '../ConnectWalletButton';
import { integerToHexNumber } from "../../utils";
// The Graph query endpoint is defined in ../apollo-client.js

const ENERGY_TYPES = [
  {
    key: 'Renewable',
    text: 'Renewable',
    value: 'Renewable'
  },
  {
    key: 'Non-renewable',
    text: 'Non-renewable',
    value: 'Non-renewable'
  }
]

const TRANSPORTATION_TYPE = [
  {
    key: 'Flight',
    text: 'Flight',
    value: 'FLIGHT'
  },
  {
    key: 'Ship',
    text: 'Ship',
    value: 'SHIP'
  },
  {
    key: 'Road',
    text: 'Road',
    value: 'ROAD'
  }
]

const MATERIAL_TYPE = [
  {
    key: 'Glass',
    text: 'Glass',
    value: 'GLASS'
  },
  {
    key: 'Wool',
    text: 'Wool',
    value: 'WOOL'
  },
  {
    key: 'Copper Wire',
    text: 'Copper Wire',
    value: 'COPPER_WIRE'
  },
  {
    key: 'Aluminium',
    text: 'Aluminium',
    value: 'ALUMINIUM'
  }
]

// Fuel used: Number in KWH
// Transportation_type: FLIGHT, SHIP, ROAD
// Material_type: Glass Wool, 3148 CO2eg/kg, copper wire, 788 CO2eg/kg, Alumuminum Sheet, 2980CO2eg/kg
// Material_amount: in KG
// Supply chain party id: Integer
// Product id: Integer
export default function Checkout({ contractData, products }) {
  const { kit, address, network, performActions } = useContractKit();
  const totalPrice = products.reduce((acc, product) => acc + product.price, 0);
  const [contractLink, setContractLink] = useState<string | null>(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [energyType, setEnergyType] = useState<string | null>(null);
  const [fuelUsed, setFuelUsed] = useState<number | null>(null);
  const [transportationType, setTransportationType] = useState<string | null>(null);
  const [materialType, setMaterialType] = useState<string | null>(null);
  const [materialAmount, setMaterialAmount] = useState<number | null>(null);
  const [supplyChainPartyId, setSupplyChainPartyId] = useState<number | null>(null);
  const [productId, setProductId] = useState<number | null>(null);
  
  const client = create('https://ipfs.infura.io:5001/api/v0');
  const handleUploadToIpfs = async () => {
    const testObj = {
      test: 'hello'
    }
    console.log(testObj);
    const created = await client.add(JSON.stringify(testObj));
    const url = `https://ipfs.infura.io/ipfs/${created.path}`;
    console.log(url);
    
    // const result = await ipfs.add(testObj);
    // console.log(result);
  }

  const contract = contractData
    ? (new kit.web3.eth.Contract(
        contractData.abi,
        contractData.address
      ) as any as Storage)
    : null;

  useEffect(() => {
    if (contractData) {
      setContractLink(`${network.explorer}/address/${contractData.address}`);
    }
  }, [network, contractData]);

  const setStorage = async () => {
    const productId = 7;
    try {
      await performActions(async (kit) => {
        contract.once("purchaseRegistered", function(error, event) {
          const arrayReturnData = event.returnValues[0];
          let payload: any = {}
          payload['id'] = arrayReturnData['orderID'];
          payload['customer_addr'] = arrayReturnData['customerAddress'];
          payload['merchant_addr'] = arrayReturnData['merchantAddress'];
          payload['amount'] = hexNumberToInteger(arrayReturnData['orderAmount']);
          payload['status'] = 'Active';
          const expireDate = new Date(arrayReturnData['expiryDate'] * 1000);
          const expireDateString = expireDate.toISOString().split('T')[0] + ' ' + expireDate.toTimeString().split(' ')[0];
          payload['expiry'] = expireDateString;
          payload['product_id'] = arrayReturnData['productID'];
          payload['currency_name'] = 'CELO'
          const url = 'https://cuboid-backend.herokuapp.com/customers/purchase';
          axios.post(url, payload);
        });

        const gasLimit = await contract.methods
          .addPurchase(integerToHexNumber(totalPrice), productId).estimateGas({
            from: address,
            value: integerToHexNumber(totalPrice)
          });
        const result = await contract.methods
          .addPurchase(integerToHexNumber(totalPrice), productId).send({
            from: address,
            gas: gasLimit,
            gasPrice: await kit.web3.eth.getGasPrice(),
            value: integerToHexNumber(totalPrice)
          });
        const variant = result.status == true ? "success" : "error";
        const url = `${network.explorer}/tx/${result.transactionHash}`;
        const action: SnackbarAction = (key) => (
          <>
            <Link href={url} target="_blank">
              View in Explorer
            </Link>
            <Button
              onClick={() => {
                closeSnackbar(key);
              }}
            >
              X
            </Button>
          </>
        );
        enqueueSnackbar("Transaction sent", {
          variant,
          action,
        });
      });
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
      console.log(e);
    }
  };

  return (
    <div className={styles.checkoutWrapper}>
        <h2>
          Connect Wallet
        </h2>
        <ConnectWalletButton/>
        <div className={styles.dropdownWrapper}>
          <p>Energy Type</p>
          <Dropdown
            labeled
            label="Energy Type"
            placeholder='Energy Type'
            fluid
            search
            selection
            options={ENERGY_TYPES}
            className={styles.dropdown}
            onChange={
              (event, data) => {
                setEnergyType(data.value?.toString() || '');
              }}
          />
        </div>
        <Input
          className={styles.input}
          label='Fuel Used'
          placeholder="Fuel Used (in KWH)"
          number
          onChange={(event, data) => {
            setFuelUsed(parseInt(data.value) || 0);
          }}
        />
        <Input
          className={styles.input}
          label="Material Amount"
          placeholder="Material Amount (in KG)"
          number
          onChange={(event, data) => {
            setFuelUsed(parseInt(data.value) || 0);
          }}
        />
        <div className={styles.dropdownWrapper}>
          <p>Energy Type</p>
          <Dropdown
            label="Transportation Type"
            placeholder='Transportation Type'
            fluid
            search
            selection
            options={TRANSPORTATION_TYPE}
            className={styles.dropdown}
            onChange={
              (event, data) => {
                setTransportationType(data.value?.toString() || '');
              }}

          />
        </div>
        <div className={styles.dropdownWrapper}>
          <p> Material Type </p>
          <Dropdown
            placeholder='Material Type'
            fluid
            search
            selection
            options={MATERIAL_TYPE}
            className={styles.dropdown}
            onChange={
              (event, data) => {
                setMaterialType(data.value?.toString() || '');
              }}
          />
        </div>
        <Divider component="div" sx={{ m: 1 }} />
        <Button 
          sx={{ m: 1, marginLeft: 0 }}
          variant="contained" 
          onClick={setStorage}
          className={styles.checkoutButton}
        >
          Sign
        </Button>
    </div>
  );
}
