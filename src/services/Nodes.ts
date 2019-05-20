import { Token, TokenType } from './TokenType'

export const tokensToNodes = (tokens: Token[]) => {
  return tokens.map(t => ({...t, Children: [] as BaseNode[], Tokens: [t]} as BaseNode))
}

export interface BaseNode extends Token {
  Children: BaseNode[],
  Tokens: Token[]
}

export interface TermNode extends BaseNode {
  Parent: TermNode | null
  Identifier?: string
  IdentifierNode?: BaseNode
}

export interface AssignmentNode extends BaseNode {
  Type: TokenType.Assignment,
  Identifier: string
  IdentifierNode: BaseNode
}
