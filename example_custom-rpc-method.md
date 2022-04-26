#### Example: Providing Enhanced RPC Methods for Wallet usage

```go
// Call implements eth_call. Executes a new message call immediately without creating a transaction on the block chain.
func (api *APIImpl) Multicall(ctx context.Context, commonCallArgs ethapi.CallArgs, contractsWithPayloads MulticallRunlist, blockNrOrHash *rpc.BlockNumberOrHash, overrides *map[common.Address]ethapi.Account) (MulticallResult, error) {

{ ... } // Code Truncated 

		new web3._extend.Method({
			name: 'multicall',
			call: 'eth_multicall',
			params: 3,
			inputFormatter: [web3._extend.formatters.inputCallFormatter, null, web3._extend.formatters.inputDefaultBlockNumberFormatter]
		}),
```