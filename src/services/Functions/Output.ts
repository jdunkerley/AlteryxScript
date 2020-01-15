import { FunctionNode } from "../Nodes"
import { Evaluator, AlteryxNode } from "../evaluator"

// First argument: Connection
// Second argument: Filename
const name = "RecordID"

export default (node:FunctionNode, evaluator: Evaluator) => {
  if (node.Children.length < 2) {
    throw new SyntaxError(`${name} requires a connection and a filename`)
  }

  const firstChild = evaluator.evaluateStatement(node.Children[0].Children[0]) as AlteryxNode
  if (!firstChild || !firstChild.defaultConnection) {
    throw new SyntaxError(`${name} first argument must be a connection`)
  }

  const secondChild = evaluator.evaluateStatement(node.Children[1].Children[0])
  if (typeof(secondChild) !== "string") {
    throw new SyntaxError("Output second argument must be a filename")
  }

  const newNode = evaluator.addNode(
    'AlteryxBasePluginsGui.DbFileOutput.DbFileOutput',
    'AlteryxBasePluginsEngine.dll' ,'AlteryxDbFileOutput', `
    <File FileFormat="54" MaxRecords="">${secondChild}</File>
    <Passwords />
    <FormatSpecificOptions>
      <CodePage>28591</CodePage>
    </FormatSpecificOptions>
    <MultiFile value="False" />
`, null, [], node.rawText)

    evaluator.addConnection(firstChild.nodeId, firstChild.defaultConnection, newNode.nodeId, 'Input')

    return firstChild
}