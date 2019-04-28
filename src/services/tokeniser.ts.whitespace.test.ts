import { tokenise, TokenType, TokenPatterns } from './tokeniser'

it('Can get a WhiteSpace pattern', () => {
    const pattern = TokenPatterns[TokenType.WhiteSpace]
    expect(pattern).toBeDefined()
    expect(pattern).toBeInstanceOf(Function)
    expect(pattern(' ')).toBe(' ')
})

it('Can Tokeniser WhiteSpace', () => {
    const whitespace = '     \n\t   \r\n '
    const tokens = tokenise(whitespace)
    expect(tokens).toBeInstanceOf(Array)
    expect(tokens.length).toBe(1)
    expect(tokens[0]).toBe(whitespace)
})
