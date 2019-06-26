export class AlteryxConnection {
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
