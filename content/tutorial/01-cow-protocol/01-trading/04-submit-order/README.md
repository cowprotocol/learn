---
title: Submitting
---

Further building on the previous tutorial, we will now submit an order to CoW Protocol using the TradingSdk.

## Submitting the order

The TradingSdk simplifies order submission by providing the `postSwapOrderFromQuote` function. This function handles signing and posting the order in one step:

```typescript
/// file: run.ts
import type { PublicClient, WalletClient } from 'viem';
import { SupportedChainId, OrderKind, TradingSdk, TradeParameters } from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

export async function run(
  setup: (chainId: SupportedChainId) => Promise<{ publicClient: PublicClient; walletClient: WalletClient }>
): Promise<unknown> {
  const { publicClient, walletClient } = await setup(SupportedChainId.GNOSIS_CHAIN)
  // ...

  const { postSwapOrderFromQuote } = await sdk.getQuote(parameters);

  const postingResult = await postSwapOrderFromQuote({
    // Optional: you can specify advanced settings before posting an order
    quoteRequest: {
      validTo: Math.ceil((Date.now() + (120 * 1000)) / 1000) // 2 min
    }
  });

  return {
    explorerLink: `https://explorer.cow.fi/search/${postingResult.orderId}`,
    postingResult
  };
}
```

The `postSwapOrderFromQuote` function:

- Signs the order using the wallet
- Posts the order to the CoW Protocol API
- Returns the posting result including the `orderId`

You can optionally pass advanced settings such as `validTo` to customize the order expiration time.

## Run the code

To run the code, we can press the "Run" button in the bottom right panel (the web container).

When running the script, we may be asked to connect a wallet. We can use Rabby for this.

1. Accept the connection request in Rabby
2. Press the "Run" button again
3. Sign the order when prompted by your wallet
4. Observe the posting result returned to the output panel

An example result should look like:

```json
/// file: output.json
{
  "explorerLink": "https://explorer.cow.fi/search/0xae842840f65743bc84190a68da1e4adf1771b242fa903b6c2e87bc5050e07c1329104bb91ada737a89393c78335e48ff4708727e65952d5e",
  "postingResult": {
    // ...
  }
}
```

> The [`orderId`](https://docs.cow.fi/cow-protocol/reference/contracts/core/settlement#orderuid) is the unique identifier for the order we have just submitted. We can use this `orderId` (also known as `orderUid`) to check the status of the order on [CoW Explorer](https://docs.cow.fi/cow-protocol/tutorials/cow-explorer/order). You can click the `explorerLink` to view your order directly.

### Errors

A couple of errors may easily result when running this code:

- **`InsufficientBalance`**: The wallet you have signed with does not have enough balance for the `sellToken`. A reminder in this example, the `sellToken` is `wxDai` on Gnosis chain.
- **`InsufficientAllowance`**: In this case, the wallet has enough balance, however you have missed out a step in the [approve tutorial](/tutorial/approve-cow-protocol) and have not approved the `relayerAddress` to spend the `sellToken` on your behalf.
