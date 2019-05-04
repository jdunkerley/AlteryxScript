import React, { useState } from 'react'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { Token, TokenType } from '../services/TokenType'
import tokenise from '../services/tokeniser'
import { Toolbar, Button, Icon } from '@material-ui/core'

const styles = createStyles({
  root: {
    flexGrow: 1
  },
  paper: {
    textAlign: 'center',
    padding: '10px'
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

const Tokeniser: React.FC<Props> = (props: Props) => {
  const { classes } = props
  const [ codeBlock, setCodeBlock ] = useState<Token[]>([])

  const handleOnChange = (event: any) => {
    try {
      setCodeBlock(tokenise(event.target.value))
    } catch {
      setCodeBlock([{Value: "Unable to tokenise", Type: TokenType.Error}])
    }
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6" color="inherit">
              Alteryx Script Tokeniser Tester
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <TextField
              id="outlined-multiline-static"
              label="Script Code Playpen"
              multiline
              rows="30"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              fullWidth
              onChange={handleOnChange}
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.root}>
              Tokens:
            </Typography>
            <Button variant="contained" color="primary">
              <Icon>code</Icon>&nbsp;
              Copy as JSON
            </Button>
          </Toolbar>
          <GridList cols={1} cellHeight={'auto'}>
            { codeBlock.map((token, i) => (
              <GridListTile key={i} style={{overflow: 'visible'}} >
                <strong>{token.Type}</strong><pre style={{display: 'inline-block', 'padding-left': '5px'}}>{token.Value}</pre>
              </GridListTile>
            ))}
          </GridList>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(Tokeniser)