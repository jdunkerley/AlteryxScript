import { Token, TokenType } from './TokenType'

export interface BaseNode extends Token {
  Children: BaseNode[],
  Tokens: Token[]
}

export interface TermNode extends BaseNode {
  Parent: TermNode | null
}

export interface AssignmentNode extends BaseNode {
  Type: TokenType.Assignment,
  Identifier: string
}
