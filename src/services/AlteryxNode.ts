import { EscapeXml } from "./XMLUtils"

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
    return `    <Node ToolID="${this.nodeId}">
    <GuiSettings Plugin="${this.plugin}">
      <Position x="${20}" y="${20 + 75 * this.nodeId}" />
    </GuiSettings>
    <Properties>
      <Configuration>${this.xmlConfig}      </Configuration>
${
  this.annotation ? `      <Annotation DisplayMode="0">
        <AnnotationText>${EscapeXml(this.annotation)}</AnnotationText>
      </Annotation>`
  : ''
}
    </Properties>
    <EngineSettings EngineDll="${this.engineDll}" EngineDllEntryPoint="${this.engineEntryPoint}" />
  </Node>
`
  }
}
