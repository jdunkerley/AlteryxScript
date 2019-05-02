import { Token, TokenType } from './TokenType'

const TokenPrecedence = [
  TokenType.NewLine,
  TokenType.WhiteSpace,
  TokenType.Comment,
  TokenType.Operator,
  TokenType.Assignment,
  TokenType.OpenBracket,
  TokenType.CloseBracket,
  TokenType.Colon,
  TokenType.Dot,
  TokenType.Comma,
  TokenType.Number,
  TokenType.String,
  TokenType.Identifier
]

interface ITokenPatterns {
  [s: string]: (s: string) => string | null
}

const regExpMatch: (s: string, r: RegExp) => string | null = (s, r) => {
  const match = s.match(r)
  if (match) {
    return match[1]
  }
  return null
}

const letterMatch: (s: string, l: string) => string | null = (s, l) => s[0] === l ? l : null

export const TokenPatterns: ITokenPatterns = {
  [TokenType.NewLine]: (s) => regExpMatch(s, /^(\r?\n(\s+\n)?)/),
  [TokenType.WhiteSpace]: (s) => regExpMatch(s, /^([ \t]+)/),
  [TokenType.Operator]: (s) => regExpMatch(s, /^(\+|\*|\/|%|-|==|<=|>=|<|>)/),
  [TokenType.Assignment]: (s) => letterMatch(s, '='),
  [TokenType.OpenBracket]: (s) => letterMatch(s, '('),
  [TokenType.CloseBracket]: (s) => letterMatch(s, ')'),
  [TokenType.Colon]: (s) => letterMatch(s, ':'),
  [TokenType.Comma]: (s) => letterMatch(s, ','),
  [TokenType.Dot]: (s) => letterMatch(s, '.'),
  [TokenType.Comment]: (s) => regExpMatch(s, /^(\\.*?)\r?\n/),
  [TokenType.Number]: (s) => regExpMatch(s, /^([0-9][0-9.]*)/),
  [TokenType.String]: (s) => regExpMatch(s, /^(('|").*?[^\\](\2))/),
  [TokenType.Identifier]: (s) => regExpMatch(s, /^([A-Za-z_][A-Za-z0-9_]+|\[.*?\])/)
}

const GetNextToken: (input: string) => Token = (input) => {
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

const tokenise = (input: string) => {
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

export default tokenise