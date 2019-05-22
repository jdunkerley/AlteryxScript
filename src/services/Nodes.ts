import { Token, TokenType } from './TokenType'

export const tokensToNodes = (tokens: Token[]) => {
  return tokens.map(t => ({...t, Children: [] as BaseNode[]} as BaseNode))
}

export const nodeValue : (n:BaseNode) => string = (node) => {
  return node.Children.reduce(
      (p, c, i) => p + (i > 0 ? (node.Type === TokenType.Function ? ',' : ' ') : '') + nodeValue(c),
      node.Value
    ) + (node.Type === TokenType.Function || node.Type === TokenType.OpenBracket ? ')' : '')
}

export interface BaseNode {
  Type: TokenType,
  Value: string,
  Children: BaseNode[]
}

export interface TermNode extends BaseNode {
  Parent: TermNode | null
  Identifier?: string
  IdentifierNode?: BaseNode
}

export interface IdentifierNode extends BaseNode {
  Type: TokenType.Assignment | TokenType.Property
  Identifier: string
  IdentifierNode: BaseNode
}
