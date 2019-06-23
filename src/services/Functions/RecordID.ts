import { FunctionNode } from "../Nodes"
import { Evaluator, AlteryxNode } from "../evaluator"
import { TokenType } from "../TokenType";

// First argument: Connection
// Second argument: Filename

const name = "RecordID"

export default (node:FunctionNode, evaluator: Evaluator) => {
  if (node.Children.length < 1) {
    throw new SyntaxError(`${name} requires a connection`)
  }

  const firstChild = evaluator.evaluateStatement(node.Children[0].Children[0]) as AlteryxNode
  if (!firstChild || !firstChild.defaultConnection) {
    throw new SyntaxError(`${name} first argument must be a connection`)
  }

  const settings: Record<string, string> = {
    FieldType: 'Int32',
    FieldSize: '6',
    StartValue: '1',
    LastColumn: 'False'
  }
  evaluator.evaluateSettings(node, settings)

  // Handle FieldName
  const fieldNameNode = node.ArgumentValue('FieldName')
  settings.FieldName = 'RecordID'
  if (fieldNameNode && fieldNameNode.Children.length === 1) {
    if (fieldNameNode.Children[0].Type === TokenType.Identifier) {
      if (evaluator.variables[fieldNameNode.Children[0].Value]) {
        const value = evaluator.variables[fieldNameNode.Children[0].Value]
        settings.FieldName = String(value)
      } else {
        settings.FieldName = fieldNameNode.Children[0].Value
      }
    } else {
      settings.FieldName = String(evaluator.evaluateStatement(node.Children[0]))
    }
  }

  const newNode = evaluator.addNode(
    'AlteryxBasePluginsGui.RecordID.RecordID',
    'AlteryxBasePluginsEngine.dll' ,'AlteryxRecordID', `
    <FieldName>${settings.FieldName}</FieldName>
    <StartValue>${settings.StartValue}</StartValue>
    <FieldType>${settings.FieldType}</FieldType>
    <FieldSize>${settings.FieldSize}</FieldSize>
    <Position>${settings.LastColumn === 'True' ? 1 : 0}</Position>
`, 'Output', ['Output'])

    evaluator.addConnection(firstChild.nodeId, firstChild.defaultConnection, newNode.nodeId, 'Input')
    return newNode
}