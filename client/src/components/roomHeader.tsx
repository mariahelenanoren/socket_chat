import {
  Toolbar,
  Typography,
  makeStyles,
  createStyles,
  Theme,
  AppBar,
} from '@material-ui/core';
import { useContext } from 'react';
import { ChatContext } from '../contexts/chatContext';

const drawerWidth = 240;

export default function RoomHeader() {
  const classes = useStyles();
  const { currentRoom } = useContext(ChatContext);

  return (
    <AppBar
      color="inherit"
      elevation={1}
      position="fixed"
      className={classes.appBar}
    >
      <Toolbar>
        <Typography noWrap>{currentRoom}</Typography>
      </Toolbar>
    </AppBar>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      top: '4rem',
      zIndex: 1,
      [theme.breakpoints.down('xs')]: {
        top: '3.6rem',
        width: '100%',
      },
    },
  })
);
