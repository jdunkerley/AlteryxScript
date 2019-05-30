import { Token, TokenType } from './TokenType'
import { BaseNode, TermNode, FunctionNode, AssignmentNode } from './Nodes'

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
          next.Children.unshift(new TermNode(TokenType.Argument, prev.Value, [prev]))
        }
      } else if (next.Type === TokenType.Identifier) {
        const prev = result.pop()
        if (prev) {
          result.push(new TermNode(TokenType.Property, '.', [prev], next))
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

  return [new AssignmentNode(children, nodes[0])]
}

function identifyUnaryOperators(nodes: BaseNode[]) {
  if (!nodes.filter(n => n.Type === TokenType.Operator).length) {
    return nodes
  }

  // If First token or and operator before hand
  const result: BaseNode[] = []
  nodes.forEach((n, i) => {
    if (n.Type === TokenType.Operator) {
      result.push(
        new BaseNode(
          (i === 0 || nodes[i-1].Type === TokenType.Operator) ? TokenType.UnaryOperator : TokenType.BinaryOperator,
          n.Value,
          n.Children
        )
      )
    } else {
      result.push(n)
    }
  })
  return result
}

function handleUnaryOperators(nodes: BaseNode[]) {
  const first = nodes.findIndex(n => n.Type === TokenType.UnaryOperator)
  if (first === -1) {
    return nodes
  }

  const newNode : BaseNode = new BaseNode(nodes[first].Type, nodes[first].Value, singleTermParser(nodes.slice(first + 1)))
  const result = [...nodes.slice(0, first), newNode]
  console.log(nodes.map(n=>n.Type), result.map(n=>n.Type), newNode)
  return result
}

function handleBinaryOperators(nodes: BaseNode[], operators: string[]) {
  const first = nodes.findIndex(n => n.Type === TokenType.BinaryOperator && operators.indexOf(n.Value) !== -1)
  if (first === -1) {
    return nodes
  }

  const left = singleTermParser(nodes.slice(0, first))
  const right = singleTermParser(nodes.slice(first + 1))
  return [new BaseNode(nodes[first].Type, nodes[first].Value, [
    left.length === 1 ? left[0] : new TermNode(TokenType.Argument, '', left), 
    right.length === 1 ? right[0] : new TermNode(TokenType.Argument, '', right)
  ])]
}

export const singleTermParser = (nodes: BaseNode[]) => {
  // First merge dots
  let result = mergeDots(nodes)
  result = handleAssignment(result)

  // Binary Operators in Order ...
  result = handleBinaryOperators(result, ['*', '/', '%'])
  result = handleBinaryOperators(result, ['+', '-'])
  result = handleBinaryOperators(result, ['<', '>', '<=', '>='])
  result = handleBinaryOperators(result, ['==', '!='])

  result = handleUnaryOperators(identifyUnaryOperators(result))

  if (result.length > 1) {
    console.log("Non Singular", nodes, result)
  }
  return result
}

export const makeTerms = (nodes: BaseNode[]) => {
  const result: BaseNode[] = []
  let currentNodes: (TermNode | FunctionNode)[] = []

  const openLayer = (node: TermNode | FunctionNode) => {
    (currentNodes.length ? currentNodes[0].Children : result).push(node)
    currentNodes.unshift(node)
  }

  const isFunction = () => (currentNodes.length > 1 && currentNodes[1].Type === TokenType.Function)

  const closeLayer = () => {
    if (!currentNodes.length) {
      throw new Error('Not in a term')
    }

    if (currentNodes[0].Type !== TokenType.Function) {
      currentNodes[0].Children = singleTermParser(currentNodes[0].Children)
    }
    currentNodes.shift()
  }

  const closeArgument = () => {
    if (!isFunction) {
      throw new Error('Not in an argument of a function')
    }

    closeLayer()
  }

  nodes.forEach((t) => {
    if (t.Type === TokenType.OpenBracket) {
      openLayer(new TermNode(TokenType.OpenBracket, '', []))
    } else if (t.Type === TokenType.Function) {
      openLayer(new FunctionNode(t.Value, []))
      openLayer(new TermNode(TokenType.Argument, '', []))
    } else if (t.Type === TokenType.Comma) {
      if (!isFunction()) {
        console.log(nodes, currentNodes)
        throw new Error('Comma Used Not In Function')
      }

      closeArgument()
      openLayer(new TermNode(TokenType.Argument, '', []))
    } else if (t.Type === TokenType.Colon) {
      if (!isFunction()) {
        throw new Error('Colon Used Not In Function')
      }

      if (!currentNodes.length || currentNodes[0].Children.length !== 1 || currentNodes[0].Children[0].Type !== TokenType.Identifier) {
        throw new Error('Colon Not Used For Argument Idenifier')
      }

      currentNodes[0] = new TermNode(currentNodes[0].Type, currentNodes[0].Value, [], currentNodes[0].Children[0])
    } else if (t.Type === TokenType.CloseBracket) {
      if (!currentNodes) {
        throw new Error('Mismatched Brackets')
      }

      if (isFunction()) {
        closeArgument()
      }

      closeLayer()
    } else {
      (currentNodes.length ? currentNodes[0].Children : result).push(t)
    }
  })

  if (currentNodes.length) {
    throw new Error('Unclosed Brackets')
  }

  return singleTermParser(result)
}