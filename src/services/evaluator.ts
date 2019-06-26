import { BaseNode, FunctionNode } from "./Nodes"
import { TokenType } from "./TokenType"
import Assignment from "./Operators/Assignment"
import Unary from "./Operators/Unary"
import Binary from "./Operators/Binary"
import Func from "./Functions/Function"
import { AlteryxDocument } from "./AlteryxDocument"
import { AlteryxNode } from "./AlteryxNode"

export type VariableType = string | number | boolean | AlteryxNode 

export class Evaluator {
  readonly variables: Record<string, VariableType> = {}
  readonly document: AlteryxDocument = new AlteryxDocument()

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