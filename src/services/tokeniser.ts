export enum TokenType {
    WhiteSpace = "WhiteSpace",
    Operator = "Operator",
    Assignment = "Assignment",
    Comment = "Comment",
    Number = "Number"
}

export type Token = {
    Type: TokenType
    Value: string
}

interface ITokenPatterns  {
    [s: string]: (s:string) => string | null
}

const regexpToken : (s: string, r: RegExp) => string | null = (s: string, r: RegExp) => {
    const match = s.match(r)
    if (match) {
        return match[1]
    }
    return null
}

const TokenPrecedence = [
    TokenType.WhiteSpace,
    TokenType.Comment,
    TokenType.Operator,
    TokenType.Assignment,
    TokenType.Number
]

export const TokenPatterns : ITokenPatterns  = {
    [TokenType.WhiteSpace]: (s:string) => regexpToken(s, /^(\s+)/m),
    [TokenType.Operator]: (s:string) => regexpToken(s, /^(\+|*|\/|%|-|==|<=|>=|<|>)/),
    [TokenType.Assignment]: (s:string) => s[0] === '=' ? '=' : null,
    [TokenType.Comment]: (s:string) => regexpToken(s, /^(\\.*?)\r/),
    [TokenType.Number]: (s:string) => regexpToken(s, /^([0-9][0-9.]*)/)
}

const GetNextToken : (input:string) => Token = (input:string) => {
    for (let i = 0; i < TokenPrecedence.length; i++) {
        const tType = TokenPrecedence[i]
        const pattern = TokenPatterns[tType]
        const match = pattern(input)
        if (match) {
            return {
                Type: tType,
                Value: match
            } as Token
        }
    }

    throw new SyntaxError('Unable to parse string.')
}

export const tokenise = (input:string) => {
    const tokens: Token[] = []

    let idx = 0
    while (idx < input.length) {
        const nextToken = GetNextToken(input.substr(idx))
        console.log(nextToken)
        if (nextToken && nextToken.Value) {
            idx += nextToken.Value.length
            tokens.push(nextToken)
        } else {
            throw new SyntaxError('Invalid Token or Syntax Error.')
        }
    }

    return tokens
}