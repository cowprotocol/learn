---
title: Connect to RPC
---

In this tutorial we are going to add the MEV Blocker RPC into your browsers Web3 provider (Metamask, Rabby, etc.) and switch to it.

Connecting to MEV Blocker is as as simple as setting the right URL to connect to the RPC.

Different endpoints with different protections are available:

|                 | Frontrunning      | Backrunning | Revert           |
| --------------- | ----------------- | ----------- | ---------------- |
| /fast (default) | ✅ Protected      | 💰 Refund   | ❌ Not Protected |
| /noreverts      | ✅ Protected      | 💰 Refund   | ✅ Protected     |
| /fullprivacy    | ✅ Max protection | ⦰ No refund | ✅ Protected     |

Additionally, there are a few request parameters you can set to fine-tune the behavior of the RPC:

- `refundRecipient`: Which address should receive searcher rebates (defaults to target `tx.origin`)
- `softcancel`: Whether 0 value transactions to self should be broadcasted or interpreted as cancellation of other pending transactions at that nonce. Not available in `fast` endpoint.
- `referrer`: Allows for order-flow attribution

Depending on your choice you may end up with a URL like:

```
https://rpc.mevblocker.io?refundRecipient=0x76bA9825A5F707F133124E4608F1F2Dd1EF4006a&softcancel=1&referrer=learn.cow.fi
```
