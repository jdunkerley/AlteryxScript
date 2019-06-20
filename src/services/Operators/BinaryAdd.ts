import { BaseNode } from "../Nodes"
import { Evaluator } from "../evaluator"

export default (node:BaseNode, evaluator: Evaluator) => {
  if (node.Children.length !== 2) {
    throw new SyntaxError("Binary Add needs two children")
  }

  const left = evaluator.evaluateStatement(node.Children[0])
  const right = evaluator.evaluateStatement(node.Children[1])

  if (typeof(left) === 'number' && typeof(right) === 'number') {
    return +left + +right
  }

  if (left as string || right as string) {
    return String(left) + String(right)
  }

  throw new SyntaxError("Binary Add not supported children value")
}
