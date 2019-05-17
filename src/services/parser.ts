import { Token, TokenType } from './TokenType'
import { BaseNode, TermNode } from './Nodes'

export const tokensToNodes = (tokens: Token[]) => {
  return tokens.map(t => ({...t, Children: [] as BaseNode[], Tokens: [t]} as BaseNode))
}

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

export const breakToStatements = (tokens: Token[]) => {
  const continuationTypes = [
    TokenType.OpenBracket,
    TokenType.Comma,
    TokenType.Operator,
    TokenType.Dot,
    TokenType.Assignment
  ]
  
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

export const mergeFunctions = (tokens: Token[]) => {
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

export const makeTerms = (nodes: BaseNode[]) => {
  const result: BaseNode[] = []

  let currentTerm: TermNode | null = null
  nodes.forEach((t, i, a) => {
    if (t.Type === TokenType.OpenBracket) {
      const newTerm = {...t, Parent: currentTerm} as TermNode
      (currentTerm ? currentTerm.Children : result).push(newTerm)
      currentTerm = newTerm
    } else if (t.Type === TokenType.Function) {
      const fnTerm = {...t, Parent: currentTerm} as TermNode
      (currentTerm ? currentTerm.Children : result).push(fnTerm)
      const newTerm = {Type: TokenType.Argument, Value: "", Parent: fnTerm, Children: [], Tokens: []} as TermNode
      fnTerm.Children.push(newTerm)
      currentTerm = newTerm
    } else if (t.Type === TokenType.Comma) {
      if (!currentTerm || !currentTerm.Parent || currentTerm.Parent.Type !== TokenType.Function) {
        throw new Error('Comma Not In Function')
      }
      currentTerm.Parent.Value += currentTerm.Value + t.Value
      currentTerm.Parent.Tokens.push(...currentTerm.Tokens)
      currentTerm.Parent.Tokens.push(...t.Tokens)
      const newTerm = {Type: TokenType.Argument, Value: "", Parent: currentTerm.Parent, Children: [], Tokens: []} as TermNode
      currentTerm.Parent.Children.push(newTerm)
      currentTerm.Parent = null
      currentTerm = newTerm
    } else if (t.Type === TokenType.CloseBracket) {
      if (!currentTerm) {
        throw new Error('Mismatched Brackets')
      }

      let parent : TermNode | null
      if (currentTerm.Parent && currentTerm.Parent.Type === TokenType.Function) {
        parent = currentTerm.Parent.Parent
        currentTerm.Parent.Value += currentTerm.Value + t.Value
        currentTerm.Parent.Tokens.push(...currentTerm.Tokens)
        currentTerm.Parent.Tokens.push(...t.Tokens)
        currentTerm.Parent.Parent = null
        currentTerm.Parent = null
      } else {
        parent = currentTerm.Parent
        currentTerm.Value += t.Value
        currentTerm.Tokens.push(...t.Tokens)
        currentTerm.Parent = null
      }

      currentTerm = parent
    } else {
      if (currentTerm) {
        currentTerm.Value += t.Value
        currentTerm.Tokens.push(...t.Tokens)
      }
      (currentTerm ? currentTerm.Children : result).push(t)
    }
  })

  if (currentTerm) {
    console.log(result)
    throw new Error('Unclosed Brackets')
  }

  return result
}

const parser : (tokens: Token[]) => BaseNode[] = (tokens) => {
  // Let's Join Functions

  return []
}

export default parser