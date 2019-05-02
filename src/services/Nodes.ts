import { Token, TokenType } from './TokenType'

export interface Node {
  Type: TokenType,
  Value: string,
  Children: Node[],
  Tokens: Token[]
}

export interface AssignmentNode extends Node {
  Identifier: string
}
