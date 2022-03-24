---
eip: {{ eip }}
title: Wallet Switch Ethereum Chain RPC Method (`wallet_switchNetworkRpcProvider`)
author: Sam Bacha (@sambacha)
discussions-to:
status: Draft
type: Standards Track
category: Interface
created: 2022-03-24
requires: 155, 695
---

## Simple Summary

An RPC method for switching the wallet's active Ethereum chain.

## Abstract

The `wallet_switchNetworkRpcProvider` RPC method allows Ethereum applications ("dapps") to request that the wallet switches its active RPC Provider backend if the wallet has a concept thereof.

The caller must specify a chain ID.
The caller must specify a valid URL for the RPC Endpoint

The wallet application may arbitrarily refuse or accept the request.
A status code of `200` is returned if the active RPC was successfully switched, 
A status code of `[TODO]`  otherwise.

Important cautions for implementers of this method are included in the [Security Considerations](#security-considerations) section.

## Motivation

All dapps require the user to interact with one or more Ethereum chains in order to function.
Some wallets only supports interacting with one chain at a time.
We call this the wallet's "active rpc provider".

`wallet_switchNetworkRpcProvider` enables dapps to request that the wallet switches its active chain to whichever one is required by the dapp.

This enables UX improvements for both dapps and wallets.

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC-2119](https://www.ietf.org/rfc/rfc2119.txt).

### `wallet_switchNetworkRpcProvider`

The method accepts a single object parameter with a `chainId` field.
The method returns `null` if the wallet switched its active chain, and an error otherwise.

The method presupposes that the wallet has a concept of a single "active chain".
The active chain is defined as the chain that the wallet is forwarding RPC requests to.

#### Parameters

`wallet_switchNetworkRpcProvider` accepts a single object parameter, specified by the following TypeScript interface:

```typescript
interface SwitchEthereumChainParameter {
  chainId: string;
}
```

If a field does not meet the requirements of this specification, the wallet **MUST** reject the request.

- `chainId`
  - **MUST** specify the integer ID of the chain as a hexadecimal string, per the [`eth_chainId`](./eip-695.md) Ethereum RPC method.
  - The chain ID **MUST** be known to the wallet.
  - The wallet **MUST** be able to switch to the specified chain and service RPC requests to it.

#### Returns

The method **MUST** return `null` if the request was successful, and an error otherwise.

If the wallet does not have a concept of an active chain, the wallet **MUST** reject the request.

### Examples

These examples use JSON-RPC, but the method could be implemented using other RPC protocols.

To switch to Mainnet:

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "wallet_switchNetworkRpcProvider",
  "params": [
    {
      "chainId": "0x1",
      "rpcUrl": "https://<rpc_provider_>"
    }
  ]
}
```

To switch to the Goerli test chain:

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "wallet_switchNetworkRpcProvider",
  "params": [
    {
      "chainId": "0x5",
      "rpcUrl": "https://<rpc_provider_>"
    }
  ]
}
```

## Rationale

The purpose `wallet_switchNetworkRpcProvider` is to provide dapps with a way of requesting to switch the wallet's active chain, which they would otherwise have to ask the user to do manually.

The method accepts a single object parameter to allow for future extensibility at virtually no cost to implementers and consumers.

For related work, see [EIP-3085: `wallet_addEthereumChain`](./eip-3085.md) and [EIP-2015: `wallet_updateEthereumChain`](./eip-2015.md).

`wallet_switchNetworkRpcProvider` intentionally forgoes the chain metadata parameters included in those EIPs, since it is purely concerned with switching the active RPC endpoints, regardless of any other metadata associated therewith.

## Security Considerations

For wallets with a concept of an active chain, switching the active chain has significant implications for pending RPC requests and the user's experience.
If the active chain switches without the user's awareness, a dapp could induce the user to take actions for unintended chains.

In light of this, the wallet should:

- Display a confirmation whenever a `wallet_switchNetworkRpcProvider` is received, clearly identifying the requester and the chain that will be switched to.
  - The confirmation used in [EIP-1102](./eip-1102.md) may serve as a point of reference.
- When switching the active chain, cancel all pending RPC requests and chain-specific user confirmations.

### Preserving User Privacy

Automatically rejecting requests for chains that aren't supported or have yet to be added by the wallet allows requesters to infer which chains are supported by the wallet.

Wallet implementers should consider whether this communication channel violates any security properties of the wallet, and if so, take appropriate steps to mitigate it.

## Copyright

Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
