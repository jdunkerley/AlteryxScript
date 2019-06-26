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