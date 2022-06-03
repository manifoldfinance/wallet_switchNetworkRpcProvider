#!/usr/bin/env bash

set -e

[[ "$ETH_RPC_URL" ]] || { echo "Please set a ETH_RPC_URL"; exit 1; }

MULTICALL3='0xcA11bde05977b3631167028862bE2a173976CA11'
cast call "$MULTICALL3" 'getChainId()'
