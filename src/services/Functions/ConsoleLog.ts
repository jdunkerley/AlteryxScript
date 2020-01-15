import { FunctionNode } from "../Nodes"
import { Evaluator, AlteryxNode } from "../evaluator"

export default (node:FunctionNode, evaluator: Evaluator) => {
  if (node.Children.length === 0) {
    throw new SyntaxError("ConsoleLog requires an incoming commection")
  }

  const firstChild = evaluator.evaluateStatement(node.Children[0].Children[0]) as AlteryxNode
  if (!firstChild || !firstChild.defaultConnection) {
    throw new SyntaxError("ConsoleLog first argument must be a connection")
  }

  const newOutput = evaluator.addNode('AlteryxGuiToolkit.GenericTool.GenericTool','AlteryxBasePluginsEngine.dll' ,'AlteryxSrctOutput', '', '', [], node.rawText)
  evaluator.addConnection(firstChild.nodeId, firstChild.defaultConnection, newOutput.nodeId, 'Input')
  
  return firstChild
}