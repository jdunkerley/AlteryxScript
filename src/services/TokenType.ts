export type Token = {
  Type: TokenType
  Value: string
}

export enum TokenType {
  NewLine = "NewLine",
  WhiteSpace = "WhiteSpace",
  Operator = "Operator",
  Assignment = "Assignment",
  Comment = "Comment",
  Number = "Number",
  String = "String",
  OpenBracket = "OpenBracket",
  CloseBracket = "CloseBracket",
  Colon = "Colon",
  Dot = "Dot",
  Comma = "Comma",
  Identifier = "Identifier",
  UnaryOperator = "UnaryOperator",
  Function = "Function",
  Argument = "Argument",
  Error = "Error"
}

export const IsTokenType = (s: string) => (Object.values(TokenType).filter(f => f === s).length > 0)