const styles = theme => ({
  root: {
    flexGrow: 1,
    minHeight: '100vh',
    height: '100%',
    zIndex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    display: 'flex',
    '&:focus': {
      outline: 'none'
    }
  },
  appBar: {
    ...theme.mixins.appBar,
    color: theme.palette.text.primary,
    display: 'flex',
    margin: 0,
    padding: 0,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: 260,
    width: `calc(100% - 260px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButtonDrawer: {
    marginLeft: 12,
    '&:focus': {
      outline: 'none'
    }
  },
  menuButton: {
    margin: 10,
    '&:focus': {
      outline: 'none'
    }
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    margin: 0,
    padding: 0,
    position: 'relative',
    width: 260,
    height: '100%',
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    height: '100%',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.text.white,
    ...theme.mixins.toolbar,
  },
  borderBottom: {
    borderBottom: '1px solid #0000001f',
  },
  height: {
    minHeight: 76,
  },
  typography: {
    width: '25em',
    color: '#FFFFFF',
    display: 'flex',
    height: '24px',
    alignSelf: 'start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0 0 14px 14px',
  },
  content: {
    flexGrow: 1,
    marginTop: 72,
    padding: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.default,
    display: 'block',
    width: 'auto',
    overflow: 'auto',
  },
  flags: {
    width: 25,
    height: 25,
    margin: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    marginRight: '16px',
    '& div': {
      textTransform: 'capitalize'
    },
  },
  divider: {
    margin: '0 10px 0 5px',
  },
  row: {
    zIndex: 3,
    height: '24px',
    display: 'flex',
    alignItems: 'end',
    flexDirection: 'row',
  },
  background: {
    height: '0.5em',
    width: '100%',
  },
  title: {
    width: '25em',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    fontFamily: '"NaturaSansRegular", Helvetica, Arial, sans-serif',
  },
  titleH1: {
    fontSize: '14px',
    textTransform: 'capitalize',
    color: theme.palette.common.white,
    lineHeight: '1',
  },
  block: {
    display: 'flex',
    marginRight: theme.spacing.unit,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blockRight: {
    width: `${theme.spacing.unit * 35}px`,
  },
  blockLeft: {
    paddingRight: '9.5%',
    width: '310px',
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
  logoNatura: {
    padding: 5,
    paddingLeft: 25,
    height: 'auto',
    width: `${theme.spacing.unit * 20}px`,
    background: 'transparent no-repeat center',
    margin: '0 auto',
  },
  divLeft: {
    width: 19,
    height: 19,
    position: 'relative',
    '&::before': {
      width: 19,
      height: 19,
      content: '""',
      display: 'block',
      position: 'relative',
      backgroundColor: 'white',
      borderTopRightRadius: 10,
    }
  },
  divRight: {
    width: 19,
    height: 19,
    position: 'relative',
    '&::before': {
      width: 19,
      height: 19,
      content: '""',
      display: 'block',
      position: 'relative',
      borderTopLeftRadius: 10,
      backgroundColor: 'white',
    }
  },
  textField: {
    fontSize: 14,
    margin: 0,
  },
  businessModelName: {
    fontSize: '12px',
    textTransform: 'capitalize',
    color: '#333',
  },
});

export default styles;
