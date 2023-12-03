import React, { Component, useEffect, useState } from "react";
import { ethers } from "ethers";

import { ConnectWallet } from "../components/ConnectWallet";

import auctionAddress from "../contracts/AuctionEngine-contract-address.json";
import auctionArtifact from "../contracts/AuctionEngine.json";
import { AuctionEngine } from "../../typechain-types/AuctionEngine";

const HARDHAT_NETWORK_ID = "1337";
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

type State = {
  selectedAccount: ethers.AddressLike | null;
  txBeingSent: string | null;
  networkError: string | null;
  transactionError: string | null;
  balance: bigint | undefined;
};

const defaultState = (): State => ({
  selectedAccount: null,
  txBeingSent: null,
  networkError: null,
  transactionError: null,
  balance: undefined,
});

export default function Home({ props }) {
  const [state, setState] = useState(defaultState());
  const [provider, setProvider] = useState(
    null as ethers.BrowserProvider | null
  );
  const [auction, setAuction] = useState(null as null);

  const ethereum = window.ethereum;

  useEffect(() => {
    console.log("connecting wallet use effect");
    connectWallet();
  });

  const connectWallet = async () => {
    if (ethereum === undefined) {
      setState({
        ...state,
        networkError: "Please install Metamask!",
      });
      return;
    }

    // select user address
    const [selectedAddress] = await ethereum.request({
      method: "eth_requestAccounts", // metamask asks user to select account
    });

    if (!checkNetwork()) {
      // incorrect network
      return;
    }

    initializeAddress(selectedAddress);

    // subscribe when user changes account
    ethereum.on("accountChanged", ([newAddress]) => {
      if (!newAddress) {
        resetState();
      }

      initializeAddress(newAddress);
    });

    // subscribe when user changes account
    ethereum.on("chainChanged", ([networkId]) => {
      resetState();
    });
  };

  // reset to iniital state
  const resetState = () => setState(defaultState());

  // check correct network
  const checkNetwork = (): boolean => {
    if (ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    setState({
      ...state,
      networkError: "Please connect to local hardhat node at localhost:8545",
    });
    return false;
  };

  // initialize address
  const initializeAddress = async (selectedAddress) => {
    // connect to ethereum provider
    const provider = new ethers.BrowserProvider(ethereum);
    setProvider(provider);

    // get contract
    const auction = new ethers.Contract(
      auctionAddress.AuctionEngine,
      auctionArtifact.abi,
      await provider.getSigner(0)
    );

    setState({
      ...state,
      selectedAccount: selectedAddress,
    });

    await updateBalance();
  };

  const updateBalance = async () => {
    const newBalance = await provider?.getBalance(state.selectedAccount!);
    setState({
      ...state,
      balance: newBalance
    });
  };

  return <div>Hello</div>;
}
