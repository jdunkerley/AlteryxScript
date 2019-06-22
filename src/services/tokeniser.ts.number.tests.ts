import { TokenType } from './TokenType'
import tokenise, { TokenPatterns } from './tokeniser'

it('Can get a Number pattern', () => {
    const pattern = TokenPatterns[TokenType.Number]
    expect(pattern).toBeDefined()
    expect(pattern).toBeInstanceOf(Function)
})

it('Can Tokeniser Integer', () => {
    const number = '1234567890'
    const tokens = tokenise(number)
    expect(tokens).toBeInstanceOf(Array)
    expect(tokens.length).toBe(1)
    expect(tokens[0]).toBeDefined()
    expect(tokens[0].Type).toBe(TokenType.Number)
    expect(tokens[0].Value).toBe(number)
})

it('Can Tokeniser Decimal', () => {
    const number = '0.123456789'
    const tokens = tokenise(number)
    expect(tokens).toBeInstanceOf(Array)
    expect(tokens.length).toBe(1)
    expect(tokens[0]).toBeDefined()
    expect(tokens[0].Type).toBe(TokenType.Number)
    expect(tokens[0].Value).toBe(number)
})

it('Rejects two decimals', () => {
  const number = '0.2.4'
  const tokens = tokenise(number)
  expect(tokens).toBeInstanceOf(Array)
  expect(tokens.length).toBeGreaterThan(1)
  expect(tokens[0]).toBeDefined()
  expect(tokens[0].Type).toBe(TokenType.Number)
  expect(tokens[0].Value).toBe(number)
})
