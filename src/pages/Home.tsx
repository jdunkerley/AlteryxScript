import React from 'react'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

const styles = createStyles({
  root: {
    flexGrow: 1
  },
  paper: {
    textAlign: 'center',
    padding: '10px'
  }
})

export interface Props extends WithStyles<typeof styles> {
}

const Home: React.FC<Props> = (props: Props) => {
  const { classes } = props

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>

      </Paper>
    </div>
  )
}

export default withStyles(styles)(Home)