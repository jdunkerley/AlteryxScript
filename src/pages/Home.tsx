import React, { useState } from 'react'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
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

  const handleOnChange = (event: any) => {
    window.localStorage.setItem('parserRaw', event.target.value)
    setCode(event.target.value)
  }

  const evaluateCode = (event: any) => {
    try {
      const parsed = parser(code)

      const evaluator = new Evaluator()
      parsed.forEach(s => {
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

  const copyAsJSON = (event: any) => {
    navigator.clipboard.writeText(xml)
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
            <Typography variant="h6" color="inherit" className={classes.root}>
              Workflow XML:
            </Typography>
            <Button variant="contained" color="primary" onClick={copyAsJSON}>
              <Icon>code</Icon>&nbsp;
              Download
            </Button>
            <Button variant="contained" color="primary" onClick={copyAsJSON}>
              <Icon>code</Icon>&nbsp;
              Execute
            </Button>
          </Toolbar>
          <GridList cols={1} cellHeight={'auto'}>
            <GridListTile style={{overflow: 'visible'}} >
              <pre style={{display: 'inline-block', paddingLeft: '5px'}}>
                {xml}
              </pre>
            </GridListTile>
          </GridList>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(Home)