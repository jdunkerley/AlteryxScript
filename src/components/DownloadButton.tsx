import React from 'react'
import { Button, Icon } from '@material-ui/core'

export interface Props {
  label?: string,
  icon?: string,
  filename: string,
  mimetype: string,
  content: string
}

const defaultProps = {
  label: 'Download',
  icon: 'save_alt'
} 

const DownloadButton: React.FC<Props> = (props: Props) => {
  const resolved  = { ...defaultProps, ...props }

  const download = () => {
    const url = URL.createObjectURL(new Blob([resolved.content], {type: resolved.mimetype}))
    const a = document.createElement("a")
    a.href = url
    a.download = resolved.filename
    document.body.appendChild(a)
    a.click()
    setTimeout(function() { 
        document.body.removeChild(a) 
        window.URL.revokeObjectURL(url) 
    }, 0)
  }

  return (
    <Button variant="contained" color="primary" onClick={download} disabled={!resolved.content}>
      <Icon>{ resolved.icon }</Icon>&nbsp;{ resolved.label }
    </Button>
  )
}

export default DownloadButton