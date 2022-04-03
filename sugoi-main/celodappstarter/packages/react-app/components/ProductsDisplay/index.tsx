import * as React from "react";
import axios from "axios";
import { Dropdown, Input } from 'semantic-ui-react'
import { useState } from "react";
import Box from "@mui/material/Box";
import styles from './index.module.scss'
import { createNameClaim } from "@celo/contractkit/lib/identity/claims/claim";

interface Props {
  allTransactions?: any[];
  selectedTransactionToSign?: string;
  setSelectedTransactionToSign?: (transactionHash: string) => void;
  products: {name: string, price: number, currency: string, desc: string}[]
  productId: number;
  sign: boolean;
  setProductId: (id: number) => void;
}
export default function ProductsDisplay(props: Props) {
  const { products, productId, setProductId, allTransactions, sign } = props
  const [productsToSign, setProductsToSign] = useState([])

  const getProducts = async () => {
    /* add body to get request */
    const response = await axios.get("http://carbo-backend.herokuapp.com/get_product_id_for_merchant?merchant_id=1");
    const options = response.data?.map(product => {
      return {
        key: product.id,
        value: product.id,
        text: product.name
      }
    })
    setProductsToSign(options)
  }
  const totalPrice = products.reduce((acc, curr) => acc + curr.price, 0).toFixed(2);
  const transactionOptions = (allTransactions && allTransactions.length > 0) ? allTransactions.map(transaction => {
    return {
      key: transaction.id,
      value: transaction.id,
      text: `Transaction ${transaction.id}: ${transaction.productBatch.quantity} ${transaction.product.name}`
    }}) : [];
  React.useEffect(() => {
    getProducts()
  }, [])
  
  return (
      <div className={styles.productsDisplay}>
        <div className={styles.productsDisplayWrapper}>
          <p className={styles.cubo}>Carbo</p>
          <span className={styles.merchantName}>SIGNING FOR</span>
          <span className={styles.totalPrice}>XYZ Merchants</span>
          {sign ?
          <Dropdown
            labeled
            label="Transactions To Sign"
            placeholder='Transactions'
            fluid
            search
            selection
            options={transactionOptions}
            className={styles.dropdown}
            value={productId}
            onChange={
              (event, data) => {
                setProductId(parseInt(data.value) || 0);
              }}
          />
          :
          <Dropdown
            labeled
            label="Products"
            placeholder='Products'
            fluid
            search
            selection
            options={productsToSign}
            className={styles.dropdown}
            value={productId}
            onChange={
              (event, data) => {
                setProductId(parseInt(data.value) || 0);
              }}
          />
        }
        </div>
      </div>
  );
}
