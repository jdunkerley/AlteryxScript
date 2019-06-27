import React from 'react'
import { ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force'
import { AlteryxDocument } from '../services/AlteryxDocument'

export interface Props {
  document: AlteryxDocument
}

const Graph: React.FC<Props> = (props: Props) => {
  const doc:AlteryxDocument = props.document
  console.log(doc)

  return (
    <ForceGraph zoom simulationOptions={{ height: 300, width: 300 }} labelAttr="label">
    { doc.nodes.map(n => (
      <ForceGraphNode node={{ id: String(n.nodeId), label: n.annotation }} fill="blue" />
    ))}
    { doc.connections.map(c => (
      <ForceGraphLink link={{ source: String(c.leftNodeId), target: String(c.rightNodeId) }} />
    ))}
    </ForceGraph>
  )
}

export default Graph