import { BaseNode, AssignmentNode } from "../Nodes"
import { Evaluator } from "../evaluator"

export default (node:BaseNode, evaluator: Evaluator) => {
  const assignmentNode: AssignmentNode | null = node as AssignmentNode
  if (!assignmentNode) {
    throw new SyntaxError("Assignment not understood")
  }

  if (assignmentNode.Children.length > 1) {
    throw new SyntaxError("Assignment not understood (multi term)")
  }

  if (assignmentNode.Children.length === 0) {
    throw new SyntaxError("Assignment not understood (no children)")
  }

  const childValue = evaluator.evaluateStatement(assignmentNode.Children[0])
  evaluator.variables[assignmentNode.Identifier] = childValue
  return childValue
}
