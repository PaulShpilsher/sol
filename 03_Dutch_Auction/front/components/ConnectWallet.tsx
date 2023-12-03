import { NetworkErrorMessage } from "./NetworkErrorMessage";

export const ConnectWallet = ({ connectWallet, networkError, dismiss }) => {
  return (
    <>
      <div>
        {networkError && (
          <NetworkErrorMessage message={networkError} dismiss={dismiss} />
        )}

        <p>Connect your wallet</p>
        <button type="button" onClick={connectWallet}>
          Connect wallet!
        </button>
      </div>
    </>
  );
};
