Hre's how to request the wallet switch networks:

```typescript
ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{ chainId: '0xA86A' }]
}).then(response => console.log(response))
```
Here's how to request the client wallet add a new network

```typescript
ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x63564C40',
    rpcUrls: ['https://api.harmony.one'],
    chainName: 'Harmony Mainnet',
    nativeCurrency: { name: 'ONE', decimals: 18, symbol: 'ONE' },
    blockExplorerUrls: ['https://explorer.harmony.one'],
    iconUrls: ['https://harmonynews.one/wp-content/uploads/2019/11/slfdjs.png'],
  }],
}).then(response => console.log(response))
```

Many dapps attempt to switch to a network with wallet_switchEthereumChain, determine if the network is supported by the wallet based on the error code, and follow with a wallet_addEthereumChain request if the network is not supported. Here's an example:

```typescript
try {
  // attempt to switch to Harmony One network
  const result = await ethereum.send('wallet_switchEthereumChain', [{ chainId: `0x63564C40` }])
} catch (switchError) {
  // 4902 indicates that the client does not recognize the Harmony One network
  if (switchError.code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x63564C40',
          rpcUrls: ['https://api.harmony.one'],
          chainName: 'Harmony Mainnet',
          nativeCurrency: { name: 'ONE', decimals: 18, symbol: 'ONE' },
          blockExplorerUrls: ['https://explorer.harmony.one'],
          iconUrls: ['https://harmonynews.one/wp-content/uploads/2019/11/slfdjs.png'],
        }],
      })
  }
}
```
