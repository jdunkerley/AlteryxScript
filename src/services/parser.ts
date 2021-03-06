import { Token, TokenType } from './TokenType'
import { BaseNode, TermNode, FunctionNode, AssignmentNode, tokensToNodes } from '../services/Nodes'
import tokenise, { mergeFunctions } from '../services/tokeniser'

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

  const filtered = tokens.filter(t => t.Type !== TokenType.WhiteSpace)
  filtered.forEach((t, i, a) => {
    if (t.Type === TokenType.NewLine) {
      const prev = findLastNonComment(a, i, -1)
      const next = findLastNonComment(a, i)
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

  // Identify Operators
  result = identifyUnaryOperators(result)

  // Binary Operators in Order ...
  result = handleBinaryOperators(result, ['||'])
  result = handleBinaryOperators(result, ['&&'])
  result = handleBinaryOperators(result, ['^'])
  result = handleBinaryOperators(result, ['|'])
  result = handleBinaryOperators(result, ['&'])
  result = handleBinaryOperators(result, ['==', '!='])
  result = handleBinaryOperators(result, ['<', '>', '<=', '>='])
  result = handleBinaryOperators(result, ['+', '-'])
  result = handleBinaryOperators(result, ['*', '/', '%'])
  result = handleBinaryOperators(result, ['**']) // ToDo: Should be right to left

  // Unary Operators - ! + -
  result = handleUnaryOperators(result) // ToDo: Should be right to left

  if (result.length > 1) {
    console.error("Non Singular", nodes, result)
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

  nodes.forEach((t, i, a) => {
    if (t.Type === TokenType.OpenBracket) {
      openLayer(new TermNode(TokenType.OpenBracket, '', []))
    } else if (t.Type === TokenType.Function) {
      openLayer(new FunctionNode(t.Value, [], i))
      openLayer(new TermNode(TokenType.Argument, '', []))
    } else if (t.Type === TokenType.Comma) {
      if (!isFunction()) {
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
      currentNodes[1].Children.pop()
      currentNodes[1].Children.push(currentNodes[0])
    } else if (t.Type === TokenType.CloseBracket) {
      if (!currentNodes) {
        throw new Error('Mismatched Brackets')
      }

      if (isFunction()) {
        closeArgument()
      }

      const fnNode = currentNodes[0] as FunctionNode
      if (fnNode) {
        fnNode.rawText = a.slice(fnNode.startIndex, i).reduce((p, c) => p + c.rawText, '')
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

export default (value: string) => {
  const parsed:Token[] = []
  parsed.push(...tokenise(value))
  const statements = breakToStatements(parsed).map(mergeFunctions)
  return statements.map(tokensToNodes).map(makeTerms)
}