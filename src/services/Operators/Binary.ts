import { BaseNode } from "../Nodes"
import { Evaluator } from "../evaluator"
import BinaryAdd from "./BinaryAdd"
import BinaryMathOperator from "./BinaryMathOperator"
import BinaryComparison from "./BinaryComparison"

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
    case '==':
      return BinaryComparison(node, evaluator, node.Value, 'Equality')
    case '!=':
      return BinaryComparison(node, evaluator, node.Value, 'Inequality')
    case '<':
      return BinaryComparison(node, evaluator, node.Value, 'LessThan')
    case '>':
      return BinaryComparison(node, evaluator, node.Value, 'GreaterThan')
    case '<=':
      return BinaryComparison(node, evaluator, node.Value, 'LessThanOrEqual')
    case '>=':
      return BinaryComparison(node, evaluator, node.Value, 'GreaterThanOrEqual')
    default:
      throw new SyntaxError("Invalid Binary Operator")
  }
}

