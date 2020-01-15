import { BaseNode, FunctionNode } from "../Nodes"
import { Evaluator, VariableType } from "../evaluator"
import Input from "./Input"
import Sample from "./Sample"
import Count from "./Count"
import Output from "./Output"
import RecordID from "./RecordID"
import ConsoleLog from "./ConsoleLog"

const functions: Record<string, (node:FunctionNode, evaluator: Evaluator) => VariableType> = {
  "input": Input,
  "sample": Sample,
  "count": Count,
  "output": Output,
  "recordid": RecordID,
  "consolelog": ConsoleLog
}

export default (node:BaseNode, evaluator: Evaluator) => {
  if (node as FunctionNode) {
    const fnNode = node as FunctionNode
    const fnName = node.Value.substr(0, node.Value.length - 1).toLowerCase()
    const handler = functions[fnName]
    if (!handler) {
      throw new SyntaxError(`Unknown Function ${fnName}`)
    }

    return handler(fnNode, evaluator)
  }

  throw new SyntaxError("Invalid Function Node")
}
