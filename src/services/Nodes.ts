import { Token, TokenType } from './TokenType'

export const tokensToNodes = (tokens: Token[]) => {
  return tokens.map(t => ({...t, Children: [] as BaseNode[]} as BaseNode))
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
