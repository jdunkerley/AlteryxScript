export type Token = {
  Type: TokenType
  Value: string
}

export enum TokenType {
  NewLine = "NewLine",
  WhiteSpace = "WhiteSpace",
  Operator = "Operator", // Not Handled in Parser
  Assignment = "Assignment", // Not Handled in Parser
  Comment = "Comment",
  Number = "Number",
  String = "String",
  Boolean = "Boolean",
  OpenBracket = "OpenBracket",
  CloseBracket = "CloseBracket",
  Colon = "Colon",
  Dot = "Dot", // Not Handled in Parser
  Comma = "Comma",
  Identifier = "Identifier",
  UnaryOperator = "UnaryOperator",
  BinaryOperator = "BinaryOperator",
  Function = "Function",
  Argument = "Argument",
  Property = "Property",
  Error = "Error"
}

export const IsTokenType = (s: string) => (Object.values(TokenType).filter(f => f === s).length > 0)