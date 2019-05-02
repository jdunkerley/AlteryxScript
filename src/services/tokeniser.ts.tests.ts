import { TokenType } from './TokenType'
import tokenise from './tokeniser'

it('Can tokenise a number in whitespace', () => {
    const number = '1234567890'
    const tokens = tokenise(`\t${number}\r\n`)
    expect(tokens).toBeInstanceOf(Array)
    expect(tokens.length).toBe(3)
    expect(tokens[0]).toBeDefined()
    expect(tokens[0].Type).toBe(TokenType.WhiteSpace)
    expect(tokens[0].Value).toBe('\t')
    expect(tokens[1]).toBeDefined()
    expect(tokens[1].Type).toBe(TokenType.Number)
    expect(tokens[1].Value).toBe(number)
    expect(tokens[2]).toBeDefined()
    expect(tokens[2].Type).toBe(TokenType.WhiteSpace)
    expect(tokens[2].Value).toBe('\r\n')
})