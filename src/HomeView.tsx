import { useState } from "react";
import { CreateCampaignModal } from "./CreateCampaignModal";
import { Footer } from "./Footer";
import styles from "./Test.module.css";
import { UserButton } from "@civic/auth-web3/react";
import { UseBalanceReturnType } from "wagmi";
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";

export default function Homeview({
  isConnected,
  balance,
  createWallet,
  connectExistingWallet,
}: {
  isConnected: boolean;
  balance: UseBalanceReturnType<{
    decimals: number;
    formatted: string;
    symbol: string;
    value: bigint;
  }>;
  createWallet: () => Promise<void> | undefined;
  connectExistingWallet: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const userContext = useUser();

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col min-h-[80vh]">
        <div className="flex items-end justify-end w-full py-2 px-3 rounded-lg gap-3">
          {userContext.user && (
            <div>
              {!userHasWallet(userContext) && (
                <p>
                  <button onClick={createWallet}>Create Wallet</button>
                </p>
              )}
              {userHasWallet(userContext) && (
                <>
                  <p>Wallet address: {userContext.walletAddress}</p>
                  <p>
                    Balance:{" "}
                    {balance?.data
                      ? `${(BigInt(balance.data.value) / BigInt(1e18)).toString()} ${balance.data.symbol}`
                      : "Loading..."}
                  </p>
                  {isConnected ? (
                    <p>Wallet is connected</p>
                  ) : (
                    <button onClick={connectExistingWallet}>
                      Connect Wallet
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          <UserButton className="hover: text-black" />
          <button
            className="bg-gradient-to-tr from-purple-600 to-fuchsia-700 text-white rounded-2xl hover:from-purple-600 hover:to-indigo-800 py-3 px-6"
            onClick={openModal}
          >
            + CREATE CAMPAIGN
          </button>
        </div>
        <div className="mt-6">
          <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
            Crowdfunding Dapp
          </h1>
        </div>
        <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
          <p className="text-slate-500 text-2x1 leading-relaxed">
            Simple app for creating and donating to campaigns.
          </p>
          {/* <p className="text-slate-500 text-2x1 leading-relaxed">Full-stack Solana applications made easy.</p> */}
        </h4>
        <h2 className="text-red-500 text-xl">
          Advised: Donate/withdraw in small amounts (e.g 0.1, 0.5)!!!
        </h2>
        {/* Modal Component */}
        <CreateCampaignModal isOpen={isModalOpen} onClose={closeModal} />
        <div className="w-full h-3"></div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
