import { BaseNode } from "../Nodes"
import { Evaluator } from "../evaluator"
import BinaryAdd from "./BinaryAdd"
import BinaryMathOperator from "./BinaryMathOperator"

export default (node:BaseNode, evaluator: Evaluator) => {
  switch (node.Value) {
    case '+':
      return BinaryAdd(node, evaluator)
    case '-':
      return BinaryMathOperator(node, evaluator, '-', 'Minus')
    case '*':
      return BinaryMathOperator(node, evaluator, '*', 'Multiply')
    case '%':
      return BinaryMathOperator(node, evaluator, '%', 'Mod')
    case '/':
      return BinaryMathOperator(node, evaluator, '/', 'Divide')
    case '**':
      return BinaryMathOperator(node, evaluator, '**', 'Exponential')
    default:
      throw new SyntaxError("Invalid Binary Operator")
  }
}

