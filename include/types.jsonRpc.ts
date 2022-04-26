// Reference file for enhanced JSON RPC Status Codes
const jsonrpc = '2.0'
type ID = string | number | null | undefined
class Request {
    readonly jsonrpc = '2.0'
    constructor(public id: ID, public method: string, public params: any[] | object) {
        return { id, method, params, jsonrpc }
    }
}


/* It's a class that returns an object with the properties `id`, `jsonrpc`, and `result`, where
`result` is either the value passed to the constructor or `null` if the value is `undefined` */
class SuccessResponse {
    readonly jsonrpc = '2.0'
   
    resultIsUndefined?: boolean
    constructor(public id: ID, public result: any, noUndefinedKeeping: boolean) {
        const obj = { id, jsonrpc, result: result || null } as this
        if (!noUndefinedKeeping && result === undefined) obj.resultIsUndefined = true
        return obj
    }
}
class ErrorResponse {
    readonly jsonrpc = '2.0'
    error: { code: number; message: string; data?: { stack?: string; type?: string } }
    constructor(public id: ID, code: number, message: string, stack: string, type: string = 'Error') {
        if (id === undefined) id = null
        code = Math.floor(code)
        const error = (this.error = { code, message, data: { stack, type } })
        return { error, id, jsonrpc }
    }
    // Pre defined error in section 5.1
    static readonly ParseError = (stack = '') => new ErrorResponse(null, -32700, 'Parse error', stack)
    static readonly InvalidRequest = (id: ID) => new ErrorResponse(id, -32600, 'Invalid Request', '')
    static readonly MethodNotFound = (id: ID) => new ErrorResponse(id, -32601, 'Method not found', '')
    static readonly InvalidParams = (id: ID) => new ErrorResponse(id, -32602, 'Invalid params', '')
    static readonly InternalError = (id: ID, message: string = '') =>
        new ErrorResponse(id, -32603, 'Internal error' + message, '')
}
type Response = SuccessResponse | ErrorResponse
function isJSONRPCObject(data: any): data is Response | Request {
    if (!isObject(data)) return false
    if (!hasKey(data, 'jsonrpc')) return false
    if (data.jsonrpc !== '2.0') return false
    if (hasKey(data, 'params')) {
        const params = (data as Request).params
        if (!Array.isArray(params) && !isObject(params)) return false
    }
    return true
}
function isObject(params: any) {
    return typeof params === 'object' && params !== null
}
function hasKey<T, Q extends string>(obj: T, key: Q): obj is T & { [key in Q]: unknown } {
    return key in obj
}
class CustomError extends Error {
    constructor(public name: string, message: string, public code: number, public stack: string) {
        super(message)
    }
}
/** These Error is defined in ECMAScript spec */
const errors: Record<string, typeof EvalError> = {
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
}

/**
 * AsyncCall support somehow transfer ECMAScript Error
 */
 function RecoverError(type: string, message: string, code: number, stack: string) {
    try {
        if (type.startsWith('DOMException:')) {
            const [_, name] = type.split('DOMException:')
            return new DOMException(message, name)
        } else if (type in errors) {
            const e = new errors[type](message)
            e.stack = stack
            Object.assign(e, { code })
            return e
        } else {
            return new CustomError(type, message, code, stack)
        }
    } catch {
        return new Error(`E${code} ${type}: ${message}\n${stack}`)
    }
}
function removeStackHeader(stack: string = '') {
    return stack.replace(/^.+\n.+\n/, '')
}