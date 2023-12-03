import React, { Component, useEffect, useState } from "react";
import { ethers } from "ethers";

import { ConnectWallet } from "../components/ConnectWallet";

import auctionAddress from "../contracts/AuctionEngine-contract-address.json";
import auctionArtifact from "../contracts/AuctionEngine.json";
import { AuctionEngine } from "../../typechain-types/AuctionEngine";

const HARDHAT_NETWORK_ID = "31337";
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export default function Home({ props }) {
  "client only";
  const [selectedAccount, setSelectedAccount] = useState<ethers.AddressLike>();
  const [networkError, setNetworkError] = useState<string>();
  const [transactionError, setTransactionError] = useState<string>();
  const [balance, setBalance] = useState<bigint>();
  const [txBeingSent, setTxBeingSent] = useState<string>();

  const [provider, setProvider] = useState<ethers.BrowserProvider>();
  const [auction, setAuction] = useState<ethers.Contract>();

  const ethereum = globalThis.ethereum;

  // useEffect(() => {
  //   console.log("connecting wallet use effect");
  //   connectWallet();
  // });

  const connectWallet = async () => {
    if (ethereum === undefined) {
      setNetworkError("Please install Metamask!");
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
  const resetState = () => {
    setSelectedAccount(undefined);
    setNetworkError(undefined);
    setTransactionError(undefined);
    setBalance(undefined);
    setTxBeingSent(undefined);
    setAuction(undefined);
  };

  // check correct network
  const checkNetwork = (): boolean => {
    if (ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    setNetworkError("Please connect to local hardhat node at localhost:8545");
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

    setAuction(auction);
    setSelectedAccount(selectedAddress);

    await updateBalance();
  };

  const updateBalance = async () => {
    const newBalance = await provider?.getBalance(selectedAccount!);
    setBalance(newBalance);
  };

  if(!selectedAccount ) {
    return <ConnectWallet
      connectWallet={connectWallet}
      networkError={networkError}
      dismiss={() => setNetworkError(undefined)}
    />
  }

  return (
    <>
      {balance && <p>Your balance: {ethers.formatEther(balance!)} ETH</p>}
    </>
  );
}
