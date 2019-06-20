import { BaseNode } from "../Nodes"
import { Evaluator } from "../evaluator"

export default (node:BaseNode, evaluator: Evaluator) => {
  if (node.Children.length !== 2) {
    throw new SyntaxError("Binary Multiply needs two children")
  }

  const left = evaluator.evaluateStatement(node.Children[0])
  const right = evaluator.evaluateStatement(node.Children[1])

  if (left as number && right as number) {
    return +left * +right
  }

  throw new SyntaxError("Binary Multiply not supported children values")
}
