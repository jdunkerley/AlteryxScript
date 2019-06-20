import { BaseNode } from "../Nodes"
import { Evaluator } from "../evaluator"

export default (node:BaseNode, evaluator: Evaluator) => {
  if (node.Children.length > 1) {
    throw new SyntaxError("Unary Plus not understood (multi term)")
  }

  if (node.Children.length === 0) {
    throw new SyntaxError("Unary Plus not understood (no children)")
  }

  const childValue = evaluator.evaluateStatement(node.Children[0])
  if (typeof(childValue) === 'number') {
    return childValue
  }

  if (childValue as string) {
    return +childValue
  }

  throw new SyntaxError("Unary Plus not supported children type")
}
