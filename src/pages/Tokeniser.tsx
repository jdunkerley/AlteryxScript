import React, { useState } from 'react'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { Token, TokenType } from '../services/TokenType'
import tokenise from '../services/tokeniser'

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
          <Typography variant="h6" color="inherit">
              Tokens:
          </Typography>
          { codeBlock.map((token, i) => (
            <Paper className={classes.paper}>
              <Typography variant="title" color={token.Type === TokenType.Error ? 'error' : 'inherit'}>
                {token.Type} : {token.Value}
              </Typography>
            </Paper>
          ))}
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(Tokeniser)