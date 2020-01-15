import { BaseNode, FunctionNode } from "./Nodes"
import { TokenType } from "./TokenType"
import Assignment from "./Operators/Assignment"
import Unary from "./Operators/Unary"
import Binary from "./Operators/Binary"
import Func from "./Functions/Function"

const XMLHeader = `<?xml version="1.0"?>
<AlteryxDocument yxmdVer="2019.1">
  <Nodes>
    <Node ToolID="1">
      <GuiSettings Plugin="AlteryxGuiToolkit.Questions.Tab.Tab">
        <Position x="0" y="0" width="59" height="59" />
      </GuiSettings>
      <Properties>
        <Configuration />
        <Annotation DisplayMode="0">
          <Name />
          <DefaultAnnotationText />
          <Left value="False" />
        </Annotation>
      </Properties>
    </Node>
`

const XMLMiddle = `
  </Nodes>
  <Connections>
`

const XMLFooter = `  </Connections>
  <Properties>
    <RuntimeProperties>
      <Actions />
      <Questions>
        <Question>
          <Type>Tab</Type>
          <Description>Alter Script</Description>
          <Name>AlterScript</Name>
          <ToolId value="1" />
          <Questions />
        </Question>
      </Questions>
      <ModuleType>Wizard</ModuleType>
    </RuntimeProperties>
  </Properties>
</AlteryxDocument>
`

const xmlChar: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '\'': '&apos;',
  '"': '&quot;'
}

export function EscapeXml(unsafe:string) {
  return unsafe.replace(/[<>&'"]/g, c => xmlChar[c] || c)
}


export class AlteryxNode {
  readonly nodeId: number
  readonly plugin: string
  readonly engineDll: string
  readonly engineEntryPoint: string
  readonly xmlConfig: string
  readonly defaultConnection: string | null
  readonly connections: string[]
  annotation: string = ''
  nodeX: number
  nodeY: number

  constructor(nodeId: number, plugin: string, engineDll: string, engineEntryPoint: string, xmlConfiguration: string, defaultConnection: string | null = null, connections: string[] = []) {
    this.nodeId = nodeId
    this.nodeX = 20
    this.nodeY = 20 + 75 * this.nodeId
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

  RenderXml() {
    const pluginAttribute = this.plugin === 'Macro' ? '' : `Plugin="${this.plugin}"`

    const engineSettings = this.engineDll === 'Macro'
      ? `<EngineSettings Macro="${this.engineEntryPoint}" />`
      : `<EngineSettings EngineDll="${this.engineDll}" EngineDllEntryPoint="${this.engineEntryPoint}" />`

    return `    <Node ToolID="${this.nodeId}">
    <GuiSettings ${pluginAttribute}>
      <Position x="${20}" y="${20 + 75 * this.nodeId}" />
    </GuiSettings>
    <Properties>
      <Configuration>${this.xmlConfig}      </Configuration>
${
  this.annotation 
    ? `      <Annotation DisplayMode="0">
        <AnnotationText>${EscapeXml(this.annotation)}</AnnotationText>
      </Annotation>`
    : ''
}
    </Properties>
    ${engineSettings}
  </Node>
`
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
  nextNodeId: number = 2
  readonly nodes: AlteryxNode[] = []
  readonly connections: AlteryxConnection[] = []
  readonly variables: Record<string, VariableType> = {}

  addNode(plugin: string, engineDll: string, engineEntryPoint: string, xmlConfiguration: string, defaultConnection: string | null = null, connections: string[] = [], annotation: string | null = null) {
    const node = new AlteryxNode(this.nextNodeId, plugin, engineDll, engineEntryPoint, xmlConfiguration, defaultConnection, connections)
    if (annotation) {
      node.annotation = annotation
    }
    this.nextNodeId++
    this.nodes.push(node)
    return node
  }

  addConnection(leftNodeId: number, leftConnection: string, rightNodeId: number, rightConnection: string) {
    this.connections.push(new AlteryxConnection(leftNodeId, leftConnection, rightNodeId, rightConnection))
  }

  renderXml() {
    return XMLHeader + 
      this.nodes.reduce((p, n) => p + n.RenderXml(), '') + 
      XMLMiddle + 
      this.connections.reduce((p, c) => p + `    <Connection>
      <Origin ToolID="${c.leftNodeId}" Connection="${c.leftConnection}" />
      <Destination ToolID="${c.rightNodeId}" Connection="${c.rightConnection}" />
    </Connection>
`, '') + 
      XMLFooter
  }

  evaluateSettings(node:FunctionNode, settings: Record<string, string>) {
    Object.keys(settings).forEach(k => {
      const child = node.ArgumentValue(k)
      if (child) {
        let newValue = this.evaluateStatement(child)
        if (typeof(newValue) === "boolean") {
          newValue = newValue ? 'True' : 'False'
        }
        settings[k] = String(newValue)
      }
    })
  }

  evaluateStatement(node:BaseNode) : VariableType {
    switch (node.Type) {
      case TokenType.Identifier:
        if (this.variables[node.Value]) {
          return this.variables[node.Value]
        }
        throw new SyntaxError(`Unknown variable - ${node.Value}`)
      case TokenType.Property:
        if (node.Children.length !== -1) {
          throw new SyntaxError("Property not understood invalid number of Children")
        }
        const parent = this.evaluateStatement(node.Children[0]) as AlteryxNode
        if (!parent) {
          throw new SyntaxError("Property can only be on a Node function")
        }
        return parent.AlternateConnection(node.Value)
      case TokenType.Number:
        return +node.Value
      case TokenType.String:
        return node.Value
      case TokenType.Boolean:
        return node.Value.toLowerCase() !== 'false'
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