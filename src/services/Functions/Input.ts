import { FunctionNode } from "../Nodes"
import { Evaluator } from "../evaluator"

// First argument: Filename

const fileFormats : Record<string, number> = {
  csv: 0,
  yxdb: 19,
  json: 54
}

export default (node:FunctionNode, evaluator: Evaluator) => {
  if (node.Children.length === 0) {
    throw new SyntaxError("Input requires at least a filename")
  }

  const firstChild = evaluator.evaluateStatement(node.Children[0].Children[0])
  if (typeof(firstChild) !== "string") {
    throw new SyntaxError("Input first argument must be a filename")
  }

  const settings: Record<string, string> = {
    FileType: firstChild.replace(/^.*?([^.]+)$/,"$1").toLowerCase(),
    RecordLimit: '',
    HeaderRow: 'True',
    SearchSubDirs: 'False',
    ImportLine: '1',
    FieldLength: '65532',
    Delimeter: ','
  }
  evaluator.evaluateSettings(node, settings)

  return evaluator.addNode(
    'AlteryxBasePluginsGui.DbFileInput.DbFileInput',
    'AlteryxBasePluginsEngine.dll' ,'AlteryxDbFileInput', `
    <Passwords />
    <File OutputFileName="" RecordLimit="${settings.RecordLimit}" SearchSubDirs="${settings.SearchSubDirs}" FileFormat="${fileFormats[settings.FileType]}">${firstChild}</File>
    <FormatSpecificOptions>
      <CodePage>28591</CodePage>
      <Delimeter>${settings.Delimeter}</Delimeter>
      <FieldLen>${settings.FieldLength}</FieldLen>
      <HeaderRow>${settings.HeaderRow}</HeaderRow>
      <IgnoreQuotes>DoubleQuotes</IgnoreQuotes>
      <ImportLine>${settings.ImportLine}</ImportLine>
    </FormatSpecificOptions>
`, 'Output', ['Output'], node.rawText)
}