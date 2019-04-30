import React from 'react'
import { withStyles, WithStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    flexGrow: 1
  }
}

export interface Props extends WithStyles<typeof styles> {
}

const Header: React.FC<Props> = (props: Props) => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Alteryx Script
                    </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default withStyles(styles)(Header)