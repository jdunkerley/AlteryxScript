import { connect } from "http2";

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

class AlteryxNode {
  readonly nodeId: number
  readonly xmlConfig: string
  readonly defaultConnection: string
  readonly connections: string[]

  constructor(nodeId: number, plugin: string, engineDll: string, engineEntryPoint: string, xmlConfiguration: string, defaultConnection: string, connections: string[] = []) {
    this.nodeId = nodeId
    this.xmlConfig = xmlConfiguration
    this.defaultConnection = defaultConnection
    this.connections = connections
  }

  getConfig() {
    return this.xmlConfig
  }

  AlternateConnection(connection: string) {
    if (!this.connections.find(c => c === connection)) {
      throw new SyntaxError(`Connection ${connection} Not Found`)
    }

    return new AlteryxNode(
      this.nodeId,
      this.xmlConfig,
      connection,
      this.connections
    )
  }
}

export class Evaluator {
  nextNodeId: number = 1
  readonly nodes: AlteryxNode[] = []

  constructor() {
  }

  addNode(plugin: string, engineDll: string, engineEntryPoint: string, xmlConfiguration: string, defaultConnection: string, connections: string[] = []) {
    const node = new AlteryxNode(this.nextNodeId, xmlConfiguration, defaultConnection, connections)
    this.nextNodeId++
    this.nodes.push(node)
    return node
  }

  renderXml() {
    return XMLHeader + 
      this.nodes.reduce((p, n) => p + `    <Node ToolID="${n.nodeId}">
      <GuiSettings Plugin="AlteryxBasePluginsGui.DbFileInput.DbFileInput">
        <Position x="100" y="100" />
      </GuiSettings>
      <Properties>
        <Configuration>
${n.xmlConfig}
        </Configuration>
      </Properties>
      <EngineSettings EngineDll="AlteryxBasePluginsEngine.dll" EngineDllEntryPoint="AlteryxDbFileInput" />
    </Node>
`, '') + 
      XMLMiddle + '' + XMLFooter
  }
}