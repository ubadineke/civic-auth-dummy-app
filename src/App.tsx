import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  WagmiProvider,
  createConfig,
  useAccount,
  useConnect,
  http,
  useBalance,
} from "wagmi";
import { embeddedWallet, userHasWallet } from "@civic/auth-web3";
import { CivicAuthProvider, UserButton, useUser } from "@civic/auth-web3/react";
import { mainnet, sepolia } from "wagmi/chains";
import Homeview from "./HomeView";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
if (!CLIENT_ID) throw new Error("CLIENT_ID is required");

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [embeddedWallet()],
});

// Wagmi requires react-query
const queryClient = new QueryClient();

// Wrap the content with the necessary providers to give access to hooks: react-query, wagmi & civic auth provider
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <CivicAuthProvider clientId={CLIENT_ID}>
          <AppContent />
        </CivicAuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};

// Separate component for the app content that needs access to hooks
const AppContent = () => {
  const userContext = useUser();
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const balance = useBalance({
    address: userHasWallet(userContext)
      ? (userContext.walletAddress as `0x${string}`)
      : undefined,
  });

  // A function to connect an existing civic embedded wallet
  const connectExistingWallet = () => {
    return connect({
      connector: connectors?.[0],
    });
  };

  // A function that creates the wallet if the user doesn't have one already
  const createWallet = () => {
    if (userContext.user && !userHasWallet(userContext)) {
      // Once the wallet is created, we can connect it straight away
      return userContext.createWallet().then(connectExistingWallet);
    }
  };

  return (
    <>
      {!userContext.user && (
        <div className="w-full h-screen flex items-center justify-center">
          <UserButton className="hover: text-black" />
        </div>
      )}
      {userContext.user && (
        <>
          <Homeview
            isConnected={isConnected}
            balance={balance}
            createWallet={createWallet}
            connectExistingWallet={connectExistingWallet}
          />
          <footer className="w-full min-h-16 bg-black text-white flex flex-col items-center justify-center gap-3 p-4">
            <span className="text-2xl font-bold">Made By Ubadineke</span>
            <div className="flex items-center justify-center gap-3">
              <a
                href="https://twitter.com/ubadinekethedev"
                target="_blank"
                rel="noreferrer"
              >
                <FaXTwitter className="w-7 h-7" />
              </a>
              <a
                href="https://github.com/ubadineke"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub className="w-7 h-7" />
              </a>
            </div>
          </footer>
        </>
      )}
    </>
  );
};

export default App;
