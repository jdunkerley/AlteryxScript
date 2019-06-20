import { BaseNode } from "../Nodes"
import { Evaluator } from "../evaluator"
import UnaryMinus from "./UnaryMinus"
import UnaryPlus from "./UnaryPlus"
import UnaryNot from "./UnaryNot"

export default (node:BaseNode, evaluator: Evaluator) => {
  if (node.Value === '-') {
    return UnaryMinus(node, evaluator)
  } else if (node.Value === '+') {
    return UnaryPlus(node, evaluator)
  } else if (node.Value === '!') {
    return UnaryNot(node, evaluator)
  }

  throw new SyntaxError("Invalid Unary Operator")
}

