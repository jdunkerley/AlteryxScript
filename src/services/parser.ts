import { Token, TokenType } from './TokenType'
import './Nodes'

const continuationTypes = [
  TokenType.OpenBracket,
  TokenType.Comma,
  TokenType.Operator,
  TokenType.Dot,
  TokenType.Assignment
]

const findLastNonComment = (t: Token[], i: number, d = 1) => {
  i = i + d
  while (i < t.length && i >= 0) {
    if (t[i].Type !== TokenType.Comment && t[i].Type !== TokenType.NewLine) {
      return t[i]
    }
    i = i + d
  }
  return null
}

export const breakToStatements : (tokens: Token[]) => Token[][] = (tokens) => {
  const result: Token[][] = []
  let current : Token[] = []

  tokens.filter(t => t.Type !== TokenType.WhiteSpace)
  .forEach((t, i) => {
    if (t.Type === TokenType.NewLine) {
      const prev = findLastNonComment(tokens, i, -1)
      const next = findLastNonComment(tokens, i)
      if (!prev || !next || !(continuationTypes.indexOf(prev.Type) !== -1 || continuationTypes.indexOf(next.Type) !== -1)) {
        result.push(current)
        current = []
      }
    } else {
      current.push(t)
    }
  })
  if (current.length) {
    result.push(current)
  }

  return result
}

export const mergeFunctions : (tokens: Token[]) => Token[] = (tokens) => {
  const result: Token[] = []
  tokens.filter(t => t.Type !== TokenType.WhiteSpace && t.Type !== TokenType.NewLine && t.Type !== TokenType.Comment)
    .forEach((t, i, a) => {
      if (t.Type === TokenType.Identifier && i + 1 < a.length && a[i + 1].Type === TokenType.OpenBracket) {
        result.push({Type: TokenType.Function, Value: t.Value + a[i + 1].Value})
      } else if (t.Type === TokenType.OpenBracket && i > 0 && a[i - 1].Type === TokenType.Identifier) {
        // Do Nothing
      } else {
        result.push(t)
      }
    })

  return result
}

const parser : (tokens: Token[]) => Node[] = (tokens) => {
  // Let's Join Functions

  return []
}

export default parser