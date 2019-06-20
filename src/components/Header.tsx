import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { RouteComponentProps } from 'react-router'
import { withRouter, Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import { Toolbar } from '@material-ui/core'

export interface Props extends RouteComponentProps {
}

const Header: React.FC<Props> = (props: Props) => {
  const { location } = props

  return (
    <div style={{flexGrow: 1}}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit" inline>
            AlterScript
          </Typography>
          <div style={{flexGrow: 1}} />
          <Tabs value={location.pathname}>
            <Tab label="Home" component={props => <Link {...props} to="/" />} value="/" />
            <Tab label="Tokeniser" component={props => <Link {...props} to="/tokeniser" />} value="/tokeniser" />
            <Tab label="Parser" component={props => <Link {...props} to="/parser" />} value="/parser" />
          </Tabs> 
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default withRouter(Header)