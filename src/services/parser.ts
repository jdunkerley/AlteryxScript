import { Token, TokenType } from './TokenType'
import { BaseNode, TermNode } from './Nodes'

function findLastNonComment(t: Token[], i: number, d = 1) {
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

export const makeTerms = (nodes: BaseNode[]) => {
  const result: BaseNode[] = []
  let currentTerm: TermNode | null = null

  const openLayer = (node: BaseNode) => {
    const newTerm = {...node, Parent: currentTerm} as TermNode
    (currentTerm ? currentTerm.Children : result).push(newTerm)
    currentTerm = newTerm
  }

  const isFunction = () => (currentTerm && currentTerm.Parent && currentTerm.Parent.Type === TokenType.Function)

  const pushNode = (t: BaseNode) => {
    if (currentTerm) {
      currentTerm.Value += t.Value
      currentTerm.Tokens.push(...t.Tokens)
    }
  }

  const closeLayer = () => {
    if (!currentTerm) {
      throw new Error('Not in a term')
    }

    const parent = currentTerm.Parent
    currentTerm.Parent = null
    currentTerm = parent
  }

  const closeArgument = () => {
    if (!currentTerm || !currentTerm.Parent) {
      throw new Error('Not in an argument of a function')
    }

    if (currentTerm.Children.length >= 2 && currentTerm.Children[0].Type === TokenType.Identifier && currentTerm.Children[1].Type === TokenType.Colon) {
      currentTerm.Identifier = currentTerm.Children[0].Value
      currentTerm.IdentifierNode = currentTerm.Children[0]
      currentTerm.Children.shift()
      currentTerm.Children.shift()
    }

    currentTerm.Parent.Value += currentTerm.Value
    currentTerm.Parent.Tokens.push(...currentTerm.Tokens)
    closeLayer()
  }

  nodes.forEach((t) => {
    if (t.Type === TokenType.OpenBracket) {
      openLayer(t)
    } else if (t.Type === TokenType.Function) {
      openLayer(t)
      openLayer({Type: TokenType.Argument, Value: "", Children: [], Tokens: []})
    } else if (t.Type === TokenType.Comma) {
      if (!isFunction()) {
        throw new Error('Comma Used Not In Function')
      }

      closeArgument()
      pushNode(t)
      openLayer({Type: TokenType.Argument, Value: "", Children: [], Tokens: []})
    } else if (t.Type === TokenType.CloseBracket) {
      if (!currentTerm) {
        throw new Error('Mismatched Brackets')
      }

      if (isFunction()) {
        closeArgument()
      }
      pushNode(t)
      closeLayer()
    } else {
      (currentTerm ? currentTerm.Children : result).push(t)
      pushNode(t)
    }
  })

  if (currentTerm) {
    console.log(result)
    throw new Error('Unclosed Brackets')
  }

  return result
}