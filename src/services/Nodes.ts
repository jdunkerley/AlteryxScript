import { Token, TokenType } from './TokenType'

export const tokensToNodes = (tokens: Token[]) => {
  return tokens.map(t => new BaseNode(t.Type, t.Value))
}

export class BaseNode {
  readonly Type: TokenType
  readonly Value: string
  rawText: string = ''
  Children: BaseNode[]

  constructor(type: TokenType, value: string, children: BaseNode[] | null = null) {
    this.Type = type

    this.rawText = value
    this.Value = (type === TokenType.String || (type === TokenType.Identifier && value[0] === '[' && value.substr(-1) === ']'))
      ? value.substring(1, value.length - 1) 
      : value
    this.Children = children || []
  }

  get NodeValue(): string {
    return this.Children.reduce((p, c, i) => p + ' ' + c.NodeValue, this.Value)
  }
}

export class TermNode extends BaseNode {
  IdentifierNode: BaseNode | null

  constructor(type: TokenType, value: string, children: BaseNode[] | null = null, identifierNode: BaseNode | null = null) {
    super(type, value, children)
    this.IdentifierNode = identifierNode
  }

  get Identifier() {
    return this.IdentifierNode ? this.IdentifierNode.Value : ''
  }

  // ( <Children> )
  // Ident: ( <Children> )
  // ( <Children> ).Ident
  get NodeValue() {
    return (this.Value === '' && this.IdentifierNode ? `${this.IdentifierNode.Value}:` : '')
      + '('
      + this.Children.reduce((p, c, i) => p + (i > 0 ? ' ' : '') + c.NodeValue, '')
      + ')'
      + (this.Value !== '' && this.IdentifierNode ? `.${this.IdentifierNode.Value}` : '')
  }
}

export class FunctionNode extends BaseNode {
  readonly startIndex: number

  constructor(value: string, children: BaseNode[] | null, index: number) {
    super(TokenType.Function, value, children)
    this.startIndex = index
  }

  get NodeValue(): string {
    return this.Value + this.Children.reduce((p, c, i) => p + (i > 0 ? ',' : '') + c.NodeValue, '') + ')'
  }

  ArgumentValue(name: string) {
    const n = this.Children.find(n => (n as TermNode) && (n as TermNode).Identifier.toLowerCase() === name.toLowerCase())
    return n && n.Children.length === 1 && n.Children[0]
  }
}

export class AssignmentNode extends TermNode {
  constructor(children: BaseNode[] | null, identifierNode: BaseNode) {
    super(TokenType.Assignment, `${identifierNode.Value}=`, children, identifierNode)
  }

  get NodeValue() {
    return this.Value + this.Children.reduce((p, c, i) => p + (i > 0 ? ' ' : '') + c.NodeValue, '')
  }
}