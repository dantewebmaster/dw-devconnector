const styles = theme => ({
  menuItem: {
    paddingRight: theme.spacing.unit,
    position: 'relative',
    display: 'flex',
    minHeight: '56px',
    maxHeight: '56px',
    textDecoration: 'none',
    borderRadius: `0 ${theme.spacing.unit}px ${theme.spacing.unit}px 0`,
    transition: theme.transitions.create(['background'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    '&:hover, &:focus, &.selected': {
      textDecoration: 'none',
      color: theme.palette.primary.light,
      borderRadius: `0 ${theme.spacing.unit}px ${theme.spacing.unit}px 0`,
      '& $primary, & $icon': {
        color: theme.palette.primary.light,
      },
      '& $menuLink': {
        backgroundColor: theme.palette.background.default,
      },
    },
  },
  menuLink: {
    width: '100%',
    marginTop: theme.spacing.unit,
    borderRadius: `0 ${theme.spacing.unit}px ${theme.spacing.unit}px 0`,
  },
  primary: {
    color: theme.palette.grey['600'],
    width: '100%',
    lineHeight: '1.4',
    fontSize: '14px',
    fontWeight: '400',
  },
  icon: {
    color: theme.palette.grey['600'],
    paddingLeft: theme.spacing.unit,
  },
  paddingRight: {
    paddingRight: theme.spacing.unit,
  },
  submenuArrow: {
    color: theme.palette.common.black,
    position: 'absolute',
    top: '0',
    left: '0',
    height: '100%',
  },
  submenuOpen: {
    color: theme.palette.primary.light,
    width: '100%',
    fontSize: '14px',
  },
});

export default styles;
