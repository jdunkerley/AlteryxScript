export type Token = {
  Type: TokenType
  Value: string
}

export enum TokenType {
  WhiteSpace = "WhiteSpace",
  Operator = "Operator",
  Assignment = "Assignment",
  Comment = "Comment",
  Number = "Number",
  String = "String",
  Error = "Error",
  OpenBracket = "OpenBracket",
  CloseBracket = "CloseBracket",
  Colon = "Colon",
  Dot = "Dot",
  Comma = "Comma",
  Identifier = "Identifier"
}
