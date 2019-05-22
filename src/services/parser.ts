import { Token, TokenType } from './TokenType'
import { BaseNode, TermNode, IdentifierNode } from './Nodes'

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

function mergeDots(nodes: BaseNode[]) {
  const result: BaseNode[] = []

  let skipOne = false
  nodes.forEach((n, i) => {
    if (n.Type === TokenType.Dot) {
      if (i === 0 || i === nodes.length - 1) {
        throw new Error('Dot cannot start or end an expression')
      }

      const next = nodes[i+1]
      if (next.Type === TokenType.Function) {
        const prev = result.pop()
        if (prev) {
          next.Children.unshift({
            Type: TokenType.Argument,
            Value: prev.Value,
            Children: [prev],
            Parent: prev as TermNode
          } as TermNode)
          next.Value = next.Value.replace(/^(.*?\().*$/, '$1') + prev.Value + ',' + next.Value.replace(/^(.*?\()(.*)$/, '$2')
        }
      } else if (next.Type === TokenType.Identifier) {
        const prev = result.pop()
        if (prev) {
          result.push({
            Type: TokenType.Property, 
            Value: `${prev.Value}.${next.Value}`, 
            Children: [prev], 
            Identifier: next.Value,
            IdentifierNode: next
          } as IdentifierNode)
        }
        skipOne = true
      } else {
        throw new Error('Dot must proceed either a Function or an Identifier')
      }
    } else {
      if (!skipOne) {
        result.push(n)
      }
      skipOne = false
    }
  })

  return result
}

function handleAssignment(nodes: BaseNode[]) {
  if (!nodes.filter(n => n.Type === TokenType.Assignment).length) {
    return nodes
  }

  if (nodes.length < 2 || nodes[0].Type !== TokenType.Identifier || nodes[1].Type !== TokenType.Assignment) {
    throw new Error('Assignment must be after an identifier')
  }

  const children: BaseNode[] = singleTermParser(nodes.slice(2))

  return [{
    Type: TokenType.Assignment, 
    Value: nodes[0].Value + nodes[1].Value,
    Children: children,
    Identifier: nodes[0].Value,
    IdentifierNode: nodes[0]
  } as IdentifierNode] as BaseNode[]
}

export const singleTermParser = (nodes: BaseNode[]) => {
  // First merge dots
  const merged = mergeDots(nodes)
  return handleAssignment(merged)
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
    }
  }

  const closeLayer = () => {
    if (!currentTerm) {
      throw new Error('Not in a term')
    }

    const parent = currentTerm.Parent
    currentTerm.Parent = null
    currentTerm.Children = singleTermParser(currentTerm.Children)
    currentTerm = parent
  }

  const closeArgument = () => {
    if (!currentTerm || !currentTerm.Parent) {
      throw new Error('Not in an argument of a function')
    }

    currentTerm.Parent.Value += currentTerm.Value
    closeLayer()
  }

  nodes.forEach((t) => {
    if (t.Type === TokenType.OpenBracket) {
      openLayer(t)
    } else if (t.Type === TokenType.Function) {
      openLayer(t)
      openLayer({Type: TokenType.Argument, Value: "", Children: []})
    } else if (t.Type === TokenType.Comma) {
      if (!isFunction()) {
        throw new Error('Comma Used Not In Function')
      }

      closeArgument()
      pushNode(t)
      openLayer({Type: TokenType.Argument, Value: "", Children: []})
    } else if (t.Type === TokenType.Colon) {
      if (!isFunction()) {
        throw new Error('Colon Used Not In Function')
      }

      if (!currentTerm || currentTerm.Children.length !== 1 || currentTerm.Children[0].Type !== TokenType.Identifier) {
        throw new Error('Colon Not Used For Argument Idenifier')
      }

      currentTerm.Identifier = currentTerm.Children[0].Value
      currentTerm.IdentifierNode = currentTerm.Children[0]
      currentTerm.Children.shift()
      pushNode(t)
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
    throw new Error('Unclosed Brackets')
  }

  return singleTermParser(result)
}