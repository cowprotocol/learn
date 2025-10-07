---
title: Quoting
---

OK, so you're wanting to trade some tokens on CoW Protocol. Great! But before we do that, let's get a quote first so we know what we're getting into. We get quotes using the [TradingSdk](https://github.com/cowprotocol/cow-sdk/tree/main/packages/trading/README.md) from `@cowprotocol/cow-sdk`.

## Quote

As an example, let's get a quote for trading 1 `wxDAI` for `COW` on [Gnosis chain](https://gnosis.io/). This is a simple swap (market order).

### Which environment?

CoW Protocol supports multiple environments (e.g. mainnet, gnosis chain, sepolia, etc). We need to know which environment we want to trade on. For this tutorial, we'll use the Gnosis chain. Let's get the `chainId` for the connected wallet and compare it to the `SupportedChainId` enum from the `@cowprotocol/cow-sdk` library:

```typescript
/// file: run.ts
import type { PublicClient, WalletClient } from 'viem';
+++import { SupportedChainId } from '@cowprotocol/cow-sdk';+++

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
    const chainId = await publicClient.getChainId();
    if (chainId !== SupportedChainId.GNOSIS_CHAIN) {
        throw new Error(`Please connect to the Gnosis chain. ChainId: ${chainId}`);
    }
}
```

### Setup the adapter

To use the `TradingSdk` with `viem`, we need to create a `ViemAdapter`:

```typescript
/// file: run.ts
import type { PublicClient, WalletClient } from 'viem';
+++import { SupportedChainId, TradingSdk } from '@cowprotocol/cow-sdk';+++
+++import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';+++

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
    // ...
    const adapter = new ViemAdapter({
        provider: publicClient,
        walletClient,
    });
    // ...
}
```

### Instantiate the SDK

Next, we instantiate the `TradingSdk` with the adapter:

```typescript
/// file: run.ts
import type { PublicClient, WalletClient } from 'viem';
import { SupportedChainId, TradingSdk } from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
    // ...
    const sdk = new TradingSdk({
        chainId: SupportedChainId.GNOSIS_CHAIN,
        appCode: 'CoW Swap',
    }, {}, adapter);
    // ...
}
```

We now have an instantiated `TradingSdk` that we can use to get quotes and trade on CoW Protocol.

### Trade parameters

Now that we have an instantiated `TradingSdk`, we can get a quote. To do this, we need to specify trade parameters:

- the token we want to sell (the `sellToken`), in this case [`wxDAI`](https://gnosisscan.io/token/0xe91d153e0b41518a2ce8dd3d7944fa863463a97d)
- the token we want to buy (the `buyToken`), in this case [`COW`](https://gnosisscan.io/token/0x177127622c4A00F3d409B75571e12cB3c8973d3c)
- the amount of tokens we want to sell (the `amount`), in this case `1 wxDAI` in atomic units (i.e. wei), which is `1000000000000000000`
- the decimals for both tokens
- the order kind (SELL or BUY)

```typescript
/// file: run.ts
import type { PublicClient, WalletClient } from 'viem';
import { SupportedChainId, TradingSdk, OrderKind, TradeParameters } from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
    // ...
    const sellToken = '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d'; // wxDAI
    const buyToken = '0x177127622c4A00F3d409B75571e12cB3c8973d3c'; // COW

    const parameters: TradeParameters = {
        kind: OrderKind.SELL,
        sellToken,
        sellTokenDecimals: 18,
        buyToken,
        buyTokenDecimals: 18,
        amount: '1000000000000000000', // 1 wxDAI
    };
    // ...
}
```

### Get the quote

Now that we have the trade parameters, we can get the quote using the TradingSdk:

```typescript
/// file: run.ts
import type { PublicClient, WalletClient } from 'viem';
import { SupportedChainId, TradingSdk, OrderKind, TradeParameters } from '@cowprotocol/cow-sdk';
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter';

export async function run(publicClient: PublicClient, walletClient: WalletClient): Promise<unknown> {
    // ...
    const { quoteResults } = await sdk.getQuote(parameters);

    return quoteResults;
}
```

## Run the code

To run the code, we can press the "Run" button in the bottom right panel (the web container).

When running the script, we may be asked to connect a wallet. We can use Rabby for this.

1. Accept the connection request in Rabby
2. Press the "Run" button again
3. The output panel will display only `QuoteResults.amountsAndCosts`
4. Check browser console to see the whole `QuoteResults`

The `QuoteResults` object contains:

- `quoteResponse`: The raw quote response from the API containing order parameters
- `tradeParameters`: The trade parameters used for the quote
- `amountsAndCosts`: Calculated amounts including slippage and fees
- `appDataInfo`: Application-specific metadata
- `orderToSign`: The order data ready to be signed. Important! You don't have to sign exactly that object, `sdk.getQuote()` also returns `postSwapOrderFromQuote` function which will sing and send the order

The quote results provide all the information needed to proceed with signing and posting the order in subsequent tutorials.
