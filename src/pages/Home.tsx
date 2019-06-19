import React, { useState } from 'react'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { TokenType } from '../services/TokenType'
import { BaseNode } from '../services/Nodes'
import parser from '../services/parser'
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

  const [ tokens, setTokens ] = useState<BaseNode[][]>([])

  const handleOnChange = (event: any) => {
    try {
      window.localStorage.setItem('parserRaw', event.target.value)
      const parsed = parser(event.target.value)
    } catch (e) {
      setTokens([[new BaseNode(TokenType.Error, `Unable to tokenise: ${e.message}`)]])
    }
  }

  const copyAsJSON = (event: any) => {
    navigator.clipboard.writeText(JSON.stringify(tokens))
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={6}>
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
        <Grid item xs={3}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.root}>
              State:
            </Typography>
            <Button variant="contained" color="primary" onClick={copyAsJSON}>
              <Icon>code</Icon>&nbsp;
              Copy as JSON
            </Button>
          </Toolbar>
          <GridList cols={1} cellHeight={'auto'}>
            { tokens.map((subTokens, i) => (
              <GridListTile key={i} style={{overflow: 'visible'}} >
                <pre style={{display: 'inline-block', paddingLeft: '5px'}}>
                { subTokens.map((token, j) => (
                  <abbr style={{paddingRight: '5px'}} title={token.Type} key={`${i}_${j}`}>{token.NodeValue}</abbr>
                ))}
                </pre>
              </GridListTile>
            ))}
          </GridList>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(Home)