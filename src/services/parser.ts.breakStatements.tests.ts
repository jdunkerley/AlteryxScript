import { Token, TokenType } from './TokenType'
import { breakToStatements } from './parser'

it('Can Keeps A Single Statement as One', () => {
    const tokens: Token[] = [
      { Type: TokenType.Identifier, Value: "ID" },
      { Type: TokenType.Assignment, Value: "=" },
      { Type: TokenType.String, Value: "'ABCDE'" }
    ]

    const statements = breakToStatements(tokens)
    expect(statements).toBeInstanceOf(Array)
    expect(statements.length).toBe(1)
    expect(statements[0]).toBeDefined()
    expect(statements[0]).toBeInstanceOf(Array)
    expect(statements[0].length).toBe(3)
})

it('Can Joins A Single Statement Split Over Lines', () => {
  const tokens: Token[] = [
    { Type: TokenType.Identifier, Value: "ID" },
    { Type: TokenType.Assignment, Value: "=" },
    { Type: TokenType.NewLine, Value: "\r\n" },
    { Type: TokenType.String, Value: "'ABCDE'" }
  ]

  const statements = breakToStatements(tokens)
  expect(statements).toBeInstanceOf(Array)
  expect(statements.length).toBe(1)
  expect(statements[0]).toBeDefined()
  expect(statements[0]).toBeInstanceOf(Array)
  expect(statements[0].length).toBe(3)
})