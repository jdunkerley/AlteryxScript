import { TokenType } from './TokenType'
import tokenise, { TokenPatterns } from './tokeniser'

it('Can get a WhiteSpace pattern', () => {
    const pattern = TokenPatterns[TokenType.WhiteSpace]
    expect(pattern).toBeDefined()
    expect(pattern).toBeInstanceOf(Function)
    expect(pattern(' ')).toBe(' ')
    expect(pattern('\t')).toBe('\t')
    expect(pattern(' \t ')).toBe(' \t ')
})

it('Can get a NewLine pattern', () => {
  const pattern = TokenPatterns[TokenType.NewLine]
  expect(pattern).toBeDefined()
  expect(pattern).toBeInstanceOf(Function)
  expect(pattern('\n')).toBe('\n')
  expect(pattern('\r\n')).toBe('\r\n')
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
    expect(tokens[0].Type).toBe(TokenType.NewLine)
    expect(tokens[0].Value).toBe(whitespace)
})

it('Can Tokeniser Windows new line', () => {
    const whitespace = '\r\n'
    const tokens = tokenise(whitespace)
    expect(tokens).toBeInstanceOf(Array)
    expect(tokens.length).toBe(1)
    expect(tokens[0]).toBeDefined()
    expect(tokens[0].Type).toBe(TokenType.NewLine)
    expect(tokens[0].Value).toBe(whitespace)
})

it('Can Tokeniser WhiteSpace Block', () => {
    const whitespace = '     \n\t   \r\n '
    const tokens = tokenise(whitespace)
    expect(tokens).toBeInstanceOf(Array)
    expect(tokens.length).toBe(3)
    expect(tokens[0]).toBeDefined()
    expect(tokens[0].Type).toBe(TokenType.WhiteSpace)
    expect(tokens[0].Value).toBe('     ')
    expect(tokens[1]).toBeDefined()
    expect(tokens[1].Type).toBe(TokenType.NewLine)
    expect(tokens[1].Value).toBe('\n\t   \r\n')
    expect(tokens[2]).toBeDefined()
    expect(tokens[2].Type).toBe(TokenType.WhiteSpace)
    expect(tokens[2].Value).toBe(' ')
})
