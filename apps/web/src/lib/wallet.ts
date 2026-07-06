import { create } from "zustand";
import type { WalletProvider } from "../types";
import { isConnected, requestAccess, signTransaction as freighterSignTransaction } from "@stellar/freighter-api";
import { api } from "./api";

declare global {
  interface Window {
    freighterApi?: {
      isConnected: () => Promise<boolean>;
      requestAccess: () => Promise<{ publicKey: string } | string>;
      getPublicKey: () => Promise<string>;
      signTransaction: (xdr: string, opts?: { networkPassphrase?: string }) => Promise<string>;
    };
    albedo?: {
      publicKey: (opts?: { network?: string }) => Promise<{ pubkey: string }>;
      tx: (xdr: string, opts?: { network?: string }) => Promise<{ signed_tx_xdr: string }>;
    };
  }
}

interface WalletState {
  provider: WalletProvider | null;
  address: string | null;
  network: "mainnet" | "testnet";
  connected: boolean;
  balance: number;
  connecting: boolean;
  error: string | null;
  connectFreighter: () => Promise<void>;
  connectAlbedo: () => Promise<void>;
  disconnect: () => void;
  setBalance: (balance: number) => void;
  setError: (error: string | null) => void;
  initializeSession: () => Promise<void>;
}

const withTimeout = <T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> => {
  let timeoutId: any;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
};

export const useWalletStore = create<WalletState>((set) => ({
  provider: null,
  address: null,
  network: "testnet",
  connected: false,
  balance: 0,
  connecting: false,
  error: null,
  connectFreighter: async () => {
    set({ connecting: true, error: null });
    try {
      const getPublicKeyPromise = async () => {
        let publicKey = "";
        const hasFreighter = await isConnected();
        if (hasFreighter) {
          const result = await requestAccess();
          if (result && typeof result === "object") {
            const resObj = result as any;
            if (resObj.error) {
              throw new Error(typeof resObj.error === "string" ? resObj.error : resObj.error.message || "Failed to connect");
            }
            if (resObj.address) {
              publicKey = resObj.address;
            }
          } else if (typeof result === "string") {
            publicKey = result;
          }
        }

        if (!publicKey && typeof window !== "undefined") {
          const fApi = window.freighterApi || (window as any).freighter;
          if (fApi) {
            const res = await fApi.requestAccess();
            publicKey = typeof res === "string" ? res : (res && (res.address || res.publicKey)) || (await fApi.getPublicKey());
          }
        }

        if (!publicKey) {
          throw new Error("Freighter wallet is not installed or detected in your browser.");
        }
        return publicKey;
      };

      const publicKey = await withTimeout(
        getPublicKeyPromise(),
        10000,
        "Freighter connection timed out. Please make sure Freighter is unlocked and try again."
      );

      localStorage.setItem("skillstake_wallet_address", publicKey);
      localStorage.setItem("skillstake_preferred_wallet", "freighter");
      
      set({ provider: "freighter", address: publicKey, connected: true, connecting: false });
      
      try {
        const balRes = await api.balance(publicKey);
        set({ balance: balRes.balance });
      } catch (e) {
        console.warn("Failed to fetch balance:", e);
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to connect Freighter", connecting: false });
      throw error;
    }
  },
  connectAlbedo: async () => {
    set({ connecting: true, error: null });
    try {
      if (!window.albedo) {
        throw new Error("Albedo is not available");
      }
      
      const getAlbedoPublicKey = async () => {
        const result = await window.albedo!.publicKey({ network: "public" });
        return result.pubkey;
      };

      const publicKey = await withTimeout(
        getAlbedoPublicKey(),
        10000,
        "Albedo connection timed out. Please unlock your Albedo extension/popup and try again."
      );

      localStorage.setItem("skillstake_wallet_address", publicKey);
      localStorage.setItem("skillstake_preferred_wallet", "albedo");
      
      set({ provider: "albedo", address: publicKey, connected: true, connecting: false });
      
      try {
        const balRes = await api.balance(publicKey);
        set({ balance: balRes.balance });
      } catch (e) {
        console.warn("Failed to fetch balance:", e);
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unable to connect Albedo", connecting: false });
      throw error;
    }
  },
  disconnect: () => {
    localStorage.removeItem("skillstake_wallet_address");
    localStorage.removeItem("skillstake_preferred_wallet");
    set({ provider: null, address: null, connected: false, balance: 0 });
  },
  setBalance: (balance) => set({ balance }),
  setError: (error) => set({ error }),
  initializeSession: async () => {
    const address = localStorage.getItem("skillstake_wallet_address");
    const preferredWallet = localStorage.getItem("skillstake_preferred_wallet") as WalletProvider;
    if (address && preferredWallet) {
      set({ provider: preferredWallet, address, connected: true });
      try {
        const balRes = await api.balance(address);
        set({ balance: balRes.balance });
      } catch (e) {
        console.warn("Failed to fetch balance on session restore:", e);
      }
    }
  },
}));

export function useWallet() {
  return useWalletStore();
}

export async function signTransaction(xdr: string, provider: WalletProvider | null, publicKey?: string) {
  console.log(`[wallet.ts] signTransaction starting: provider=${provider}, publicKey=${publicKey}`);
  console.log(`[wallet.ts] XDR length: ${xdr?.length}`);

  if (provider === "freighter") {
    const passphrase = import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";
    const network = passphrase.includes("Test") ? "TESTNET" : passphrase.includes("Future") ? "FUTURENET" : "PUBLIC";
    const signOpts = {
      networkPassphrase: passphrase,
      network,
      address: publicKey,
      accountToSign: publicKey
    };
    console.log("[wallet.ts] Calling NPM freighterSignTransaction with options:", JSON.stringify(signOpts));

    try {
      const signed = await freighterSignTransaction(xdr, signOpts as any);
      console.log("[wallet.ts] NPM freighterSignTransaction response:", JSON.stringify(signed));

      if (typeof signed === "string") {
        console.log("[wallet.ts] NPM freighterSignTransaction returned XDR string directly");
        return signed;
      }
      if (signed && typeof signed === "object") {
        const signedObj = signed as any;
        if (signedObj.signedTxXdr) {
          console.log("[wallet.ts] NPM freighterSignTransaction returned signedTxXdr in object");
          return signedObj.signedTxXdr;
        }
        if (signedObj.error) {
          const errMsg = typeof signedObj.error === "string" ? signedObj.error : signedObj.error.message || JSON.stringify(signedObj.error);
          console.error("[wallet.ts] NPM freighterSignTransaction returned error in object:", errMsg);
          throw new Error(errMsg);
        }
      }
    } catch (err) {
      console.warn("[wallet.ts] NPM signTransaction failed, trying fallback:", err);
    }

    // Fallback to window.freighterApi or window.freighter
    console.log("[wallet.ts] Attempting fallback to window.freighterApi or window.freighter");
    if (typeof window !== "undefined") {
      const fApi = window.freighterApi || (window as any).freighter;
      if (fApi) {
        console.log("[wallet.ts] Found window.freighter or window.freighterApi");
        try {
          const signed = await fApi.signTransaction(xdr, {
            networkPassphrase: passphrase,
            network,
            address: publicKey,
            accountToSign: publicKey
          });
          console.log("[wallet.ts] Fallback signTransaction response:", JSON.stringify(signed));
          if (typeof signed === "string") {
            return signed;
          }
          const signedObj = signed as any;
          if (signedObj && signedObj.signedTxXdr) {
            return signedObj.signedTxXdr;
          }
          if (signedObj && signedObj.error) {
            const errMsg = typeof signedObj.error === "string" ? signedObj.error : signedObj.error.message || JSON.stringify(signedObj.error);
            console.error("[wallet.ts] Fallback signTransaction returned error in object:", errMsg);
            throw new Error(errMsg);
          }
        } catch (fallbackErr) {
          console.error("[wallet.ts] Fallback signTransaction threw error:", fallbackErr);
          throw fallbackErr;
        }
      } else {
        console.warn("[wallet.ts] window.freighter or window.freighterApi is not defined");
      }
    }
    throw new Error("Freighter is not available to sign the transaction");
  }
  if (provider === "albedo") {
    if (!window.albedo) {
      console.error("[wallet.ts] Albedo not found on window object");
      throw new Error("Albedo is not available");
    }
    console.log("[wallet.ts] Calling Albedo window.albedo.tx");
    try {
      const signed = await window.albedo.tx(xdr, { network: "public" });
      console.log("[wallet.ts] Albedo response:", JSON.stringify(signed));
      return signed.signed_tx_xdr;
    } catch (albedoErr) {
      console.error("[wallet.ts] Albedo transaction signing threw error:", albedoErr);
      throw albedoErr;
    }
  }
  console.error("[wallet.ts] signTransaction failed: provider not supported or wallet not connected");
  throw new Error("Wallet not connected");
}
