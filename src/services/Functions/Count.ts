import { FunctionNode } from "../Nodes"
import { Evaluator, AlteryxNode } from "../evaluator"

export default (node:FunctionNode, evaluator: Evaluator) => {
  if (node.Children.length === 0) {
    throw new SyntaxError("Count requires an incoming commection")
  }

  const firstChild = evaluator.evaluateStatement(node.Children[0].Children[0]) as AlteryxNode
  if (!firstChild || !firstChild.defaultConnection) {
    throw new SyntaxError("Sample first argument must be a connection")
  }

  const newOutput = evaluator.addNode('AlteryxBasePluginsGui.Sample.Sample','Macro' ,'CountRecords.yxmc', '', 'Output9', ['Output9'], node.rawText)
  evaluator.addConnection(firstChild.nodeId, firstChild.defaultConnection, newOutput.nodeId, 'Input8')
  return newOutput
}