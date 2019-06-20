import { BaseNode } from "../Nodes"
import { Evaluator } from "../evaluator"
import BinaryMinus from "./BinaryMinus"
import BinaryMultiply from "./BinaryMultiply"
import BinaryDivide from "./BinaryDivide"

export default (node:BaseNode, evaluator: Evaluator) => {
  switch (node.Value) {
    case '-':
      return BinaryMinus(node, evaluator)
    case '*':
      return BinaryMultiply(node, evaluator)
    case '/':
      return BinaryDivide(node, evaluator)
    default:
      throw new SyntaxError("Invalid Binary Operator")
  }
}

