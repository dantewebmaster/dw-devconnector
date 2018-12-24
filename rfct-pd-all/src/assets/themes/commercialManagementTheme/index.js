import base from "./base";

export default {
  ...base,
  overrides: {
    fontSize: 14,
    MuiButton: {
      root: {
        border: 0,
        borderRadius: 5,
        color: '#999',
      },
      raisedPrimary: {
        minWidth: 100,
        color: base.palette.primary.contrastText,
        backgroundColor: base.palette.primary.light,
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: base.palette.primary.dark,
          color: base.palette.primary.contrastText,
          '@media (hover: none)': {
            backgroundColor: base.palette.primary.light,
            color: base.palette.primary.contrastText,
          },
        },
        '&:focus': {
          outline: 'none'
        }
      },
      flatPrimary: {
        '&:focus': {
          outline: 'none'
        }
      },
    },
    MuiButtonBase: {
      root: {
        '&:focus': {
          outline: 'none',
        }
      },
    },
    MuiListItemIcon: {
      root: {
        '&:focus': {
          outline: 'none',
        }
      },
    },
    MuiTypography: {
      subtitle1: {
        fontSize: 24,
        color: base.palette.text.black,
        fontFamily: '"NaturaSansRegular", Helvetica, Arial, sans-serif',
      },
      headline: {
        fontSize: 18,
        textTransform: 'capitalize',
        fontFamily: '"NaturaSansRegular", Helvetica, Arial, sans-serif',
      },
      title: {
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 8,
        margin: '10px 0 15px 0',
        textTransform: 'uppercase',
        fontFamily: '"NaturaSansRegular", Helvetica, Arial, sans-serif',
      },
      subheading: {
        fontSize: 14,
        color: base.palette.text.grey,
      },
      body2: {
        fontSize: 14,
        fontWeight: 600,
      }
    },
    MuiFormControlLabel: {
      root: {
        fontSize: 14,
        marginLeft: 0,
        marginRight: 0,
      }
    },
    MuiInput: {
      root: {
        fontSize: 14,
      }
    },
    MuiAppBar: {
      colorPrimary: {
        color: base.palette.primary.main,
        backgroundColor: base.palette.text.white,
      }
    },
    MuiDrawer: {
      paperAnchorDockedLeft: {
        border: 0,
      }
    }
  },
  alert: base.palette.danger,
  buttonsBox: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  textGrey: base.palette.text.grey,
  borderColor: base.palette.primary.main,
  backgroundGrey: base.palette.text.ligth,
  backgroundWhite: base.palette.text.white,
};
