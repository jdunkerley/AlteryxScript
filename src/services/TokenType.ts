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
  Error = "Error",
  OpenBracket = "OpenBracket",
  CloseBracket = "CloseBracket",
  Colon = "Colon",
  Dot = "Dot",
  Comma = "Comma",
  Identifier = "Identifier",
  Function = "Function",
  Argument = "Arguement"
}

export const IsTokenType = (s: string) => (Object.values(TokenType).filter(f => f === s).length > 0)