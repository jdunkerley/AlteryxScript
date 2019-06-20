import { BaseNode } from "./Nodes"
import { TokenType } from "./TokenType"
import Assignment from "./Operators/Assignment"
import Unary from "./Operators/Unary"
import Binary from "./Operators/Binary"
import Func from "./Functions/Function"

const XMLHeader = `<?xml version="1.0"?>
<AlteryxDocument yxmdVer="2019.1">
  <Nodes>
`

const XMLMiddle = `
  </Nodes>
  <Connections>
`

const XMLFooter = `
  </Connections>
  <Properties>
    <RuntimeProperties>
      <Actions />
      <Questions />
      <ModuleType>Wizard</ModuleType>
    </RuntimeProperties>
  </Properties>
</AlteryxDocument>
`

export class AlteryxNode {
  readonly nodeId: number
  readonly plugin: string
  readonly engineDll: string
  readonly engineEntryPoint: string
  readonly xmlConfig: string
  readonly defaultConnection: string
  readonly connections: string[]

  constructor(nodeId: number, plugin: string, engineDll: string, engineEntryPoint: string, xmlConfiguration: string, defaultConnection: string, connections: string[] = []) {
    this.nodeId = nodeId
    this.plugin = plugin
    this.engineDll = engineDll
    this.engineEntryPoint = engineEntryPoint
    this.xmlConfig = xmlConfiguration
    this.defaultConnection = defaultConnection
    this.connections = connections
  }

  AlternateConnection(connection: string) {
    if (!this.connections.find(c => c === connection)) {
      throw new SyntaxError(`Connection ${connection} Not Found`)
    }

    return new AlteryxNode(
      this.nodeId,
      this.plugin,
      this.engineDll,
      this.engineEntryPoint,
      this.xmlConfig,
      connection,
      this.connections
    )
  }
}

class AlteryxConnection {
  readonly leftNodeId: number
  readonly leftConnection: string
  readonly rightNodeId: number
  readonly rightConnection: string

  constructor(leftNodeId: number, leftConnection: string, rightNodeId: number, rightConnection: string) {
    this.leftNodeId = leftNodeId
    this.leftConnection = leftConnection
    this.rightNodeId = rightNodeId
    this.rightConnection = rightConnection
  }
}

export type VariableType = string | number | boolean | AlteryxNode 

export class Evaluator {
  nextNodeId: number = 1
  readonly nodes: AlteryxNode[] = []
  readonly connections: AlteryxConnection[] = []
  readonly variables: Record<string, VariableType> = {}

  addNode(plugin: string, engineDll: string, engineEntryPoint: string, xmlConfiguration: string, defaultConnection: string, connections: string[] = []) {
    const node = new AlteryxNode(this.nextNodeId, plugin, engineDll, engineEntryPoint, xmlConfiguration, defaultConnection, connections)
    this.nextNodeId++
    this.nodes.push(node)
    return node
  }

  addConnection(leftNodeId: number, leftConnection: string, rightNodeId: number, rightConnection: string) {
    this.connections.push(new AlteryxConnection(leftNodeId, leftConnection, rightNodeId, rightConnection))
  }

  renderXml() {
    return XMLHeader + 
      this.nodes.reduce((p, n) => p + `    <Node ToolID="${n.nodeId}">
      <GuiSettings Plugin="${n.plugin}">
        <Position x="${25 * n.nodeId}" y="${25 * n.nodeId}" />
      </GuiSettings>
      <Properties>
        <Configuration>
${n.xmlConfig}
        </Configuration>
      </Properties>
      <EngineSettings EngineDll="${n.engineDll}" EngineDllEntryPoint="${n.engineEntryPoint}" />
    </Node>
`, '') + 
      XMLMiddle + 
      this.connections.reduce((p, c) => p + `    <Connection>
      <Origin ToolID="${c.leftNodeId}" Connection="${c.leftConnection}" />
      <Destination ToolID="${c.rightNodeId}" Connection="${c.rightConnection}" />
    </Connection>
`, '') + 
      XMLFooter
  }

  evaluateStatement(node:BaseNode) : VariableType {
    switch (node.Type) {
      case TokenType.Identifier:
        if (this.variables[node.Value]) {
          return this.variables[node.Value]
        }
        throw new SyntaxError(`Unknown variable - ${node.Value}`)
      case TokenType.Number:
        return +node.Value
      case TokenType.String:
        return node.Value.substring(1, node.Value.length - 1)
      case TokenType.Assignment:
        return Assignment(node, this)
      case TokenType.UnaryOperator:
        return Unary(node, this)
      case TokenType.BinaryOperator:
        return Binary(node, this)
      case TokenType.Function:
        return Func(node, this)
      default:
        console.error(node)
        throw new SyntaxError("Failed to evaluate node")
    }
  }
}