---
eip: 0000
title: Wallet Switch Ethereum Chain RPC Method (`wallet_switchNetworkRpcProvider`)
description: An RPC method for switching the wallet's active RPC Provider
author: Sam Bacha (@sambacha) <Additional Contributors HERE>
discussions-to:
status: draft, v0.3.0
type: Standards Track
category: Interface
created: 2022-04-25
requires: 86, 155, 695, 1193
---

# Abstract

The `wallet_switchNetworkRpcProvider` RPC method allows Ethereum applications ("dapps") to request
that the wallet switches its active RPC Provider backend if the wallet has a concept thereof.

The caller MUST specify a chain ID. The caller MUST specify a valid URL for the RPC Endpoint

The wallet application **may not** arbitrarily refuse or accept the request. A status code of `200`
is returned if the active RPC was successfully switched, A status code of `[TODO]` otherwise.


> Important cautions for implementers of this method are included in the
> [Security Considerations](#security-considerations) section.

## Motivation

The purpose `wallet_switchNetworkRpcProvider` is to provide dapps with a way of requesting to switch
the wallet's active chain's RPC Provider, which they would otherwise have to ask the user to do manually.

- Account Abstraction via private mempool (EIP4339)
- Fallback provider for RPC Connectivity issues (at the Server side) (Example: Infura Service
  Outage)
- Failover provider for RPC Connectivity issues (as the Client side) (Example: Smartphone
  connectivity issues)
- Providing Transaction Privacy via RPC Provider endpoint (e.g. Flashbots, OpenMEV, EdenNetwork,
  etc)
- Accessing custom RPC Methods supported by the custom RPC Endpoint's Provider

### Existing EIP Specifications do not service this end

`updatedEthereumChain` specifies that the "...Wallet should default the `rpcUrl` to **any existing
endpoints matching a chainId known previously to the wallet**, otherwise it will use the provided
rpcUrl as a fallback."

`wallet_switchNetworkRpcProvider` intentionally and explicitly is purely concerned with switching
the active RPC endpoints, regardless of any other metadata associated therewith.

## Rationale

All dapps require the user to interact with one or more Ethereum chains in order to function. Some
wallets only supports interacting with one chain at a time. We call this the wallet's "active
chain".

The Wallet's "active chain" has an "active RPC Provider"

`wallet_switchNetworkRpcProvider` enables dapps to request that the wallet switches its active RPC
connection provider to whichever one is required by the dapp.

This enables UX improvements for both dapps and wallets as discussed in the motivation section.

The method accepts am object parameter to allow for future extensibility at virtually no cost to
implementers and consumers.[^4]

## Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT",
"RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in
[RFC-2119](https://www.ietf.org/rfc/rfc2119.txt).

Since JSON-RPC utilizes JSON, it has the same type system (described in
[RFC 4627](http://www.ietf.org/rfc/rfc4627.txt)). JSON can represent four primitive types (Strings,
Numbers, Booleans, and Null) and two structured types (Objects and Arrays). The term "Primitive" in
this specification references any of those four primitive JSON types. The term "Structured"
references either of the structured JSON types. Whenever this document refers to any JSON type, the
first letter is always capitalized: Object, Array, String, Number, Boolean, Null. True and False are
also capitalized.

All member names exchanged between the Client and the Server that are considered for matching of any
kind should be considered to be case-sensitive. The terms function, method, and procedure can be
assumed to be interchangeable.

The Client is defined as the origin of Request objects and the handler of Response objects. The
Server is defined as the origin of Response objects and the handler of Request objects.

### `wallet_switchNetworkRpcProvider`

The method accepts an object parameter with defined fields [^parameters](##Parameters) The method
returns `null` if the wallet switched its active chain, and an error otherwise.

The method presupposes that the wallet has a concept of a single "active chain". The active chain is
defined as the chain that the wallet is forwarding RPC requests to.

0. Terminology: Wallets are defined as 'Clients' as defined in the Specification section Dapps are
   defined as 'Servers' as defined in the Specification section

1. Wallets **MUST** switch to the requested RPC URL if the existing ChainID is known to the wallet.

- A dialog box requesting a user to add this to their 'address book'/etc is _recommended_ to be
  shown.

2. Wallets **MUST NOT** reject the switch to the new RPC Provider URL if the ChainID is known to the
   wallet for no non-error reasoning.

3. If a field does not meet the requirements of this specification, the wallet **MUST** reject the
   request.

4. The wallet application **MUST NOT** arbitrarily refuse the request.

### Connectivity
  
The Provider is said to be "connected" when it can service RPC requests to at least one chain.

The Provider is said to be "disconnected" when it cannot service RPC requests to any chain at all.

To service an RPC request, the Provider must successfully submit the request to the remote location, and receive a response. In other words, if the Provider is unable to communicate with its Client, for example due to network issues, the Provider is disconnected.


  
#### Parameters

> .NOTE - WORK IN PROGRESS SECTION

| Parameter                | Description                                                                                         | Required | Values                              | Error Code | Error Message                                                            |             |
| ------------------------ | --------------------------------------------------------------------------------------------------- | -------- | ----------------------------------- | ---------- | ------------------------------------------------------------------------ | ----------- |
| chainId                  | specify the integer ID of the chain as a hexadecimal string, per EIP 695                            | TRUE     | 1-4503599627370476                  | -32701     | Result: eth_ChainId Result: Transport Connection Result: Malformed Input | eth_chainId |
| rpcUrl                   | The RPC endpoint URL to target.                                                                     | TRUE     | ^$\|^[a-zA-Z_\\$][a-zA-Z_\\$0-9]\*$ | -32300     | `rpcUrl` URL ADDRESS format is invalid.                                  |             |
| rpcMethod                | The RPC method to request.                                                                          | FALSE    |                                     |            |                                                                          |             |
| setDefault               | OPTIONAL                                                                                            | FALSE    |                                     |            |                                                                          |             |
| setConfig                | OPTIONAL                                                                                            | FALSE    |                                     |            |                                                                          |             |
| flushPendingTransactions | Rebroadcast all non-confirmed transactions, in order of oldest to newest, to the new rpc connection | TRUE     |                                     |            |                                                                          |             |
| version                  |                                                                                                     | FALSE    | [0-9]+\\.[0-9]+\\.[0-9]+            |            |                                                                          |             |

- `chainId`

  - REQUIRED

  * **MUST** specify the integer ID of the chain as a hexadecimal string, per the
    [`eth_chainId`](./eip-695.md) Ethereum RPC method.
  * The chain ID **MUST** be known to the wallet.
  * The wallet is **REQUIRED** be able to switch to the specified chain and service RPC requests to
    it. It can not reject the request based on exclusivity of pairing providers with networks.
  * This exclusivity means wallets **MUST** allow users to be able to configure **ANY** ChainID with
    an RPC Provider of their choice.

- `rpcUrl`

  - REQUIRED
  - can't have user@password in RPC url

- `flushPending`:

  - REQUIRED

- `setDefault`:
  - OPTIONAL
  - optional field for dapp's to automatically switch when logged into

#### Parameters

`wallet_switchNetworkRpcProvider` accepts an object parameter, specified by the following TypeScript
interface:

```typescript
interface SwitchEthereumChainParameter {
  rpcUrl: <URL WITHOUT user@password> // required
  chainId: string; // required
  flushPending: boolean // required
  setDefault: boolean; // optional
}
```

#### Returns

The method **MUST** return `null` if the request was successful, and an error otherwise.

If the wallet does not have a concept of an active RPC Provider, the wallet **MUST** reject the
request.

If an RPC method defined in a finalized EIP is not supported, it **SHOULD** be rejected with a 4200 error per the Provider Errors section below, or an appropriate error per the RPC method's specification.
  
  
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

## Backwards Compatibility

Does not introduce backwards incompatibilities with existing `wallet_` methods or EIP specifications

## Security Considerations

For wallets with a concept of an active chain, switching the active chain has significant
implications for pending RPC requests and the user's experience. If the active chain switches
without the user's awareness, a dapp could induce the user to take actions for unintended chains.

In light of this, the wallet should:

- Display a confirmation whenever a `wallet_switchNetworkRpcProvider` is received, clearly
  identifying the requester and the chain that will be switched to.

- The confirmation used in [EIP-1102](./eip-1102.md) may serve as a point of reference.

- When switching the active RPC Provider, **MUST NOT** cancel any pending RPC requests and
  chain-specific user confirmations unless `flushPendingTransactions` is **TRUE**.

## Copyright

Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
