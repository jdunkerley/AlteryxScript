import { tokenise, TokenType, TokenPatterns } from './tokeniser'

it('Can get a Number pattern', () => {
    const pattern = TokenPatterns[TokenType.Number]
    expect(pattern).toBeDefined()
    expect(pattern).toBeInstanceOf(Function)
    expect(pattern(' ')).toBe(' ')
})

it('Can Tokeniser Integer', () => {
    const number = '1234567890'
    const tokens = tokenise(number)
    expect(tokens).toBeInstanceOf(Array)
    expect(tokens.length).toBe(1)
    expect(tokens[0]).toBe(number)
})

it('Can Tokeniser Decimal', () => {
    const number = '0.123456789'
    const tokens = tokenise(number)
    expect(tokens).toBeInstanceOf(Array)
    expect(tokens.length).toBe(1)
    expect(tokens[0]).toBe(number)
})
