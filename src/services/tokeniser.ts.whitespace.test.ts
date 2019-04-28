import { tokenise, TokenType, TokenPatterns, Token } from './tokeniser'

it('Can get a WhiteSpace pattern', () => {
    const pattern = TokenPatterns[TokenType.WhiteSpace]
    expect(pattern).toBeDefined()
    expect(pattern).toBeInstanceOf(Function)
})

it('Can Tokeniser Space', () => {
    const whitespace = ' '
    const tokens = tokenise(whitespace)
    expect(tokens).toBeInstanceOf(Array)
    expect(tokens.length).toBe(1)
    expect(tokens[0]).toBeDefined()
    expect(tokens[0].Type).toBe(TokenType.WhiteSpace)
    expect(tokens[0].Value).toBe(whitespace)
})

it('Can Tokeniser Tab', () => {
    const whitespace = '\t'
    const tokens = tokenise(whitespace)
    expect(tokens).toBeInstanceOf(Array)
    expect(tokens.length).toBe(1)
    expect(tokens[0]).toBeDefined()
    expect(tokens[0].Type).toBe(TokenType.WhiteSpace)
    expect(tokens[0].Value).toBe(whitespace)
})

it('Can Tokeniser UNIX new line', () => {
    const whitespace = '\n'
    const tokens = tokenise(whitespace)
    expect(tokens).toBeInstanceOf(Array)
    expect(tokens.length).toBe(1)
    expect(tokens[0]).toBeDefined()
    expect(tokens[0].Type).toBe(TokenType.WhiteSpace)
    expect(tokens[0].Value).toBe(whitespace)
})

it('Can Tokeniser Windows new line', () => {
    const whitespace = '\r\n'
    const tokens = tokenise(whitespace)
    expect(tokens).toBeInstanceOf(Array)
    expect(tokens.length).toBe(1)
    expect(tokens[0]).toBeDefined()
    expect(tokens[0].Type).toBe(TokenType.WhiteSpace)
    expect(tokens[0].Value).toBe(whitespace)
})



it('Can Tokeniser WhiteSpace Block', () => {
    const whitespace = '     \n\t   \r\n '
    const tokens = tokenise(whitespace)
    expect(tokens).toBeInstanceOf(Array)
    expect(tokens.length).toBe(1)
    expect(tokens[0]).toBeDefined()
    expect(tokens[0].Type).toBe(TokenType.WhiteSpace)
    expect(tokens[0].Value).toBe(whitespace)
})
