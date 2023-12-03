import React, { Component, useState } from "react";
import { ethers } from "ethers";

import { ConnectWallet } from "../components/ConnectWallet";

import auctionAddress from "../contracts/AuctionEngine-contract-address.json";
import auctionArtifact from "../contracts/AuctionEngine.json";

const HARDHAT_NETWORK_ID = "1337";
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

type State = {
  selectedAccount: string | null;
  txBeingSent: string | null;
  networkError: string | null;
  transactionError: string | null;
  balance: number | null;
};

export default function Home({ props }) {
  const [state, setState] = useState({
    selectedAccount: null,
    txBeingSent: null,
    networkError: null,
    transactionError: null,
    balance: null,
  } as State);

  console.log("Initial state ", state);

  const connectWallet = async () => {
    if (window.ethereum === undefined) {
      setState({
        ...state,
        networkError: "Please install Metamask!",
      });
      return;
    }

    // select user address
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts", // metamask asks user to select account
    });


  };

  return <div>Hello</div>;
}
