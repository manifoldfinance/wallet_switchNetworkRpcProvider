export class SwitchRpcError extends ProviderRpcError {
  name = 'SwitchRpcError'

  constructor(error: unknown) {
    super(4902, 'Error switching Rpc', error)
  }
}

export class SwitchRpcNotSupportedError extends Error {
  name = 'SwitchRpcNotSupportedError'

  constructor({ connector }: { connector: Connector }) {
    super(`"${connector.name}" does not support programmatic Rpc switching.`)
  }
}
