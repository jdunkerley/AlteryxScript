import { BaseNode } from "../Nodes"
import { Evaluator } from "../evaluator"

export default (node:BaseNode, evaluator: Evaluator, operator: string, name: string) => {
  if (node.Children.length !== 2) {
    throw new SyntaxError(`Binary ${name} needs two children`)
  }

  const left = evaluator.evaluateStatement(node.Children[0])
  const right = evaluator.evaluateStatement(node.Children[1])

  if (typeof(left) === 'number' && typeof(right) === 'number') {
    switch (operator) {
      case '*':
        return +left * +right
      case '/':
        return +left / +right
      case '%':
        return +left % +right
      case '-':
        return +left - +right
      case '**':
        return (+left) ** +right
      default:
        throw new SyntaxError(`Binary ${name} not supported operator`)
    }
  }

  throw new SyntaxError(`Binary ${name} not supported children values`)
}
