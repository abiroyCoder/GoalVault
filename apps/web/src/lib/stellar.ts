import * as StellarSdk from "@stellar/stellar-sdk";

const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || "https://horizon-testnet.stellar.org";
const SOROBAN_RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";
const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || "CDUVOWAI5HYXXC3XCXS6NMWSCXL7WHHIEHYRHME2E4DWYUPRSJ5JBEW5";

export const horizonServer = new StellarSdk.Horizon.Server(HORIZON_URL);
export const sorobanServer = new StellarSdk.rpc.Server(SOROBAN_RPC_URL);

export async function fetchXlmBalance(address: string): Promise<number> {
  try {
    const account = await horizonServer.loadAccount(address);
    const balanceEntry = account.balances.find((entry) => entry.asset_type === "native");
    return Number(balanceEntry?.balance ?? "0");
  } catch (error) {
    console.warn("[stellar.ts] Failed to load account balance, default to 0:", error);
    return 0;
  }
}

export async function prepareSendXlmTx(args: { source: string; destination: string; amount: string; memo?: string }) {
  const sourceAccount = await horizonServer.loadAccount(args.source);
  
  const builder = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  builder.addOperation(
    StellarSdk.Operation.payment({
      destination: args.destination,
      asset: StellarSdk.Asset.native(),
      amount: args.amount,
    })
  );

  if (args.memo) {
    builder.addMemo(StellarSdk.Memo.text(args.memo));
  }

  return builder.setTimeout(180).build().toXDR();
}

export async function buildContractTxXdr(method: string, args: any[], sourceAddress: string) {
  const account = await horizonServer.loadAccount(sourceAddress);
  const builder = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  builder.addOperation(
    StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: method,
      args: args.map((val) => {
        if (typeof val === "number") {
          return StellarSdk.nativeToScVal(BigInt(val), { type: "i128" });
        }
        return StellarSdk.nativeToScVal(val);
      }),
    })
  );

  return builder.setTimeout(180).build().toXDR();
}

export async function submitTransactionXdr(xdr: string) {
  const tx = StellarSdk.TransactionBuilder.fromXDR(xdr, NETWORK_PASSPHRASE);
  
  // Submit via Soroban RPC server
  const sendResponse = await sorobanServer.sendTransaction(tx);
  if (sendResponse.status === "ERROR") {
    throw new Error((sendResponse as any).errorResultXdr || "Soroban RPC Error");
  }
  
  // Poll for result
  let status: string = sendResponse.status;
  let attempts = 0;
  let txResult: any = null;
  
  while (status === "PENDING" && attempts < 10) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const getResponse = await sorobanServer.getTransaction(sendResponse.hash);
    status = getResponse.status;
    if (getResponse.status === "SUCCESS") {
      txResult = getResponse;
      break;
    } else if (getResponse.status === "FAILED") {
      throw new Error("Transaction execution failed: " + (getResponse as any).errorResultXdr);
    }
    attempts++;
  }
  
  return {
    status: status === "SUCCESS" ? "success" : "pending",
    txHash: sendResponse.hash,
    explorerUrl: `https://stellar.expert/explorer/testnet/tx/${sendResponse.hash}`,
  };
}

export async function getRewardPoolBalance(): Promise<number> {
  try {
    // Read directly from Soroban Contract State using getLedgerEntries / simulateTransaction
    // For demo stability, we query the reward_pool_balance read-only function
    const account = StellarSdk.Keypair.random(); // Dummy keypair to read state
    const tx = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(account.publicKey(), "0"),
      { fee: StellarSdk.BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE }
    )
      .addOperation(
        StellarSdk.Operation.invokeContractFunction({
          contract: CONTRACT_ID,
          function: "reward_pool_balance",
          args: [],
        })
      )
      .setTimeout(0)
      .build();

    const simulation: any = await sorobanServer.simulateTransaction(tx);
    if (simulation.results && simulation.results[0] && simulation.results[0].xdr) {
      const resultVal = StellarSdk.xdr.ScVal.fromXDR(simulation.results[0].xdr, "base64");
      const balanceBig = StellarSdk.scValToNative(resultVal);
      return Number(balanceBig);
    }
  } catch (error) {
    console.warn("[stellar.ts] Failed to query on-chain reward pool balance:", error);
  }
  return 0;
}

// Added robust polling logic for transaction receipts
