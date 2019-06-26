import React, { useState } from 'react'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import parser from '../services/parser'
import { Evaluator } from '../services/evaluator'
import { Toolbar, Button, Icon } from '@material-ui/core'

const styles = createStyles({
  root: {
    flexGrow: 1
  },
  textField: {
    marginLeft: '2px',
    marginRight: '2px'
  },
  button: {
    margin: '2px'
  }
})

export interface Props extends WithStyles<typeof styles> {
}

const Home: React.FC<Props> = (props: Props) => {
  const { classes } = props

  const [ code, setCode ] = useState<string>(window.localStorage.getItem('parserRaw') || '')
  const [ xml, setXml ] = useState<string>('')
  const [ tabValue, setTabValue ] = useState<number>(0)

  const handleOnChange = (event: any) => {
    window.localStorage.setItem('parserRaw', event.target.value)
    setCode(event.target.value)
  }

  const evaluateCode = (event: any) => {
    try {
      const parsed = parser(code)

      const evaluator = new Evaluator()
      parsed.filter(p => p.length).forEach(s => {
        if (s.length > 1) {
          throw new SyntaxError("Cannot Parse")
        }

        evaluator.evaluateStatement(s[0])
        console.log(evaluator.variables, evaluator.nodes, evaluator.connections)

        setXml(evaluator.renderXml())
      })
    } catch (e) {
      setXml(`<Error>Unable to tokenise: ${e.message}</Error>`)
    }
  }

  const download = () => {
    const url = URL.createObjectURL(new Blob([xml], {type: 'text/xml'}))
    const a = document.createElement("a")
    a.href = url
    a.download = `workflow.yxwz`
    document.body.appendChild(a)
    a.click()
    setTimeout(function() { 
        document.body.removeChild(a) 
        window.URL.revokeObjectURL(url) 
    }, 0)
  }

  const execute= () => {
    (async () => {
      const rawResponse = await fetch('http://localhost:9000/dynamic', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: xml
      })

      const content = await rawResponse.json();
      console.log(content);
    })()
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={6}>
        <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.root}>
              Code:
            </Typography>
            <Button variant="contained" color="primary" onClick={evaluateCode}>
              <Icon>code</Icon>&nbsp;
              Evaluate
            </Button>
          </Toolbar>
          <TextField
            id="outlined-multiline-static"
            label="Code"
            multiline
            rows="30"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            fullWidth
            onChange={handleOnChange}
            value={window.localStorage.getItem('parserRaw') || ''}
          />
        </Grid>
        <Grid item xs={6}>
          <Toolbar>
            <Button variant="contained" color="primary" onClick={download} disabled={xml === '' || xml.substring(0,7) === '<Error>'}>
              <Icon>save_alt</Icon>&nbsp;
              Download
            </Button>
            <Button variant="contained" color="primary" onClick={execute} disabled={xml === '' || xml.substring(0,7) === '<Error>'}>
              <Icon>play_arrow</Icon>&nbsp;
              Execute
            </Button>
          </Toolbar>
          <Tabs value={tabValue} onChange={(e, n) => setTabValue(n)} disabled={xml === ''}>
            <Tab label="Workflow XML">Workflow XML</Tab>
          </Tabs>
          {tabValue === 0 &&
          <GridList cols={1} cellHeight={'auto'}>
            <GridListTile style={{overflow: 'visible'}} >
              <pre style={{display: 'inline-block', paddingLeft: '5px'}}>
                {xml}
              </pre>
            </GridListTile>
          </GridList>}
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(Home)