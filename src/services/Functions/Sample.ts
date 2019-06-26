import { FunctionNode } from "../Nodes"
import { Evaluator } from "../evaluator"
import { AlteryxNode } from "../AlteryxNode"

// First argument: InputData

// ToDo: GroupBy

export default (node:FunctionNode, evaluator: Evaluator) => {
  if (node.Children.length === 0) {
    throw new SyntaxError("Sample requires a filename")
  }

  const firstChild = evaluator.evaluateStatement(node.Children[0].Children[0]) as AlteryxNode
  if (!firstChild || !firstChild.defaultConnection) {
    throw new SyntaxError("Sample first argument must be a connection")
  }

  const keyNames = ['Skip', 'First', 'Last']
  const settings: Record<string, string> = {}
  keyNames.forEach(k => settings[k] = '')
  evaluator.evaluateSettings(node, settings)

  let output = firstChild
  keyNames.filter(k => settings[k]).forEach(k => {
    const newOutput = evaluator.document.addNode(
      'AlteryxBasePluginsGui.Sample.Sample',
      'AlteryxBasePluginsEngine.dll' ,'AlteryxSample', `
      <Mode>${k}</Mode>
      <N>${settings[k]}</N>
`, 'Output', ['Output'], node.rawText)

      if (!output.defaultConnection) {
        throw new SyntaxError("Error handling Sample")
      }
      evaluator.document.addConnection(output.nodeId, output.defaultConnection, newOutput.nodeId, 'Input')
      output = newOutput
  })
  return output
}