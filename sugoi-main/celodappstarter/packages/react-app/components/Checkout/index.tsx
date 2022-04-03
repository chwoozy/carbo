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
import { Storage } from "../../../hardhat/types/CarboToken";
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

const SUPPLY_CHAIN_PARTY_ID = [
  {
    key: 'Production',
    value: 2,
    text: 'Production'
  },
  {
    key: 'Manufacturer',
    value: 3,
    text: 'Manufacturer'
  },
  {
    key: 'Retailer',
    value: 4,
    text: 'Retailer'
  }
]

export default function Checkout({ sign, contractData, products, productId, setProductId }) {
  const { kit, address, network, performActions } = useContractKit();
  const totalPrice = products.reduce((acc, product) => acc + product.price, 0);
  const [contractLink, setContractLink] = useState<string | null>(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [energyType, setEnergyType] = useState<string | null>(null);
  const [fuelUsed, setFuelUsed] = useState<number | null>(null);
  const [transportationType, setTransportationType] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [materialType, setMaterialType] = useState<string | null>(null);
  const [materialAmount, setMaterialAmount] = useState<number | null>(null);
  const [supplyChainPartyId, setSupplyChainPartyId] = useState<number | null>(null);
  
  const client = create('https://ipfs.infura.io:5001/api/v0');
  
  const handleUploadToIpfs = async (payload: any) => {
    const created = await client.add(JSON.stringify(payload));
    const url = `https://ipfs.infura.io/ipfs/${created.path}`;
    return url;
  }

  const ADDRESSES = {
    2: '0x24C8Cd92C9F2025a6d293D7706307Bfed6d4d426',
    3: '0x999950166b7a12236420287701c37DA9a9aA22A9',
    4: '0xF65A8cf5414CF5A1Ba86267cdff66Ed8376e5329',
  }

  const storeTransaction = async (payload: any) => {
    const response = await axios.post("http://carbo-backend.herokuapp.com/store_transaction", payload);
  }
  
  const createTransaction = async (ipfsUrl: string) => {
    const nextStepAddress = ADDRESSES[supplyChainPartyId];
    try {
      await performActions(async (kit) => {
        const gasLimit = await contract.methods
          .createTransaction(nextStepAddress, ipfsUrl).estimateGas({
            from: address,
            value: 0
          });
        const result = await contract.methods
          .createTransaction(nextStepAddress, ipfsUrl).send({
            from: address,
            gas: gasLimit,
            gasPrice: await kit.web3.eth.getGasPrice(),
            value: 0
          });
        const hash = result.transactionHash;
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
      const data = e.data?.message
      enqueueSnackbar(data, { variant: 'error' });
      console.log(e);
    }
  }

  const calculateTransaction = async () => {
    const payload = {
      energy_type: energyType,
      fuel_used: fuelUsed,
      transporation_type: transportationType,
      material_amount: materialAmount,
      supply_chain_parties_id: supplyChainPartyId,
      product_id: productId,
      quantity: quantity
    }
    const calculatedResponse = await axios.post("http://carbo-backend.herokuapp.com/calculate_transaction", payload);
    const calculatedPayload = calculatedResponse.data;
    const url = await handleUploadToIpfs(calculatedPayload);
    createTransaction(url);
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

  return (
    <div className={styles.checkoutWrapper}>
        <h2>
          Connect Wallet
        </h2>
        <ConnectWalletButton/>
        <Input
          className={styles.input}
          label='Quantity'
          placeholder="Quantity"
          number
          onChange={(event, data) => {
            setQuantity(parseInt(data.value) || 0);
          }}
        />
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
            setMaterialAmount(parseInt(data.value) || 0);
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
        <div className={styles.dropdownWrapper}>
          <p> Next Supply Chain Party</p>
          <Dropdown
            placeholder='Supply Chain Party'
            fluid
            search
            selection
            options={SUPPLY_CHAIN_PARTY_ID}
            className={styles.dropdown}
            onChange={
              (event, data) => {
                setSupplyChainPartyId(parseInt(data.value) || 0);
              }}
          />
        </div>
        <Divider component="div" sx={{ m: 1 }} />
        <Button 
          sx={{ m: 1, marginLeft: 0 }}
          variant="contained" 
          onClick={calculateTransaction}
          className={styles.checkoutButton}
        >
          Sign
        </Button>
    </div>
  );
}
