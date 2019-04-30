export enum TokenType {
    WhiteSpace = "WhiteSpace",
    Operator = "Operator",
    Assignment = "Assignment",
    Comment = "Comment",
    Number = "Number",
    String = "String",
    Error = "Error"
}

const TokenPrecedence = [
    TokenType.WhiteSpace,
    TokenType.Comment,
    TokenType.Operator,
    TokenType.Assignment,
    TokenType.Number,
    TokenType.String
]

export type Token = {
    Type: TokenType
    Value: string
}

interface ITokenPatterns  {
    [s: string]: (s:string) => string | null
}

const regExpMatch : (s:string, r:RegExp) => string | null = (s:string, r:RegExp) => {
    const match = s.match(r)
    if (match) {
        return match[1]
    }
    return null
}

export const TokenPatterns : ITokenPatterns  = {
    [TokenType.WhiteSpace]: (s:string) => regExpMatch(s, /^(\s+)/m),
    [TokenType.Operator]: (s:string) => regExpMatch(s, /^(\+|\*|\/|%|-|==|<=|>=|<|>)/),
    [TokenType.Assignment]: (s:string) => s[0] === '=' ? '=' : null,
    [TokenType.Comment]: (s:string) => regExpMatch(s, /^(\\.*?)\r/),
    [TokenType.Number]: (s:string) => regExpMatch(s, /^([0-9][0-9.]*)/),
    [TokenType.String]: (s:string) => regExpMatch(s, /^(('|").*?[^\\](\2))/)
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
        if (nextToken && nextToken.Value) {
            idx += nextToken.Value.length
            tokens.push(nextToken)
        } else {
            throw new SyntaxError('Invalid Token or Syntax Error.')
        }
    }

    return tokens
}