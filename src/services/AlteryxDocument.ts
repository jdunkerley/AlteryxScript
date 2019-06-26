import { AlteryxConnection } from "./AlteryxConnection"
import { AlteryxNode } from "./AlteryxNode"

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

export class AlteryxDocument {
  nextNodeId: number = 2
  readonly nodes: AlteryxNode[] = []
  readonly connections: AlteryxConnection[] = []

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
}