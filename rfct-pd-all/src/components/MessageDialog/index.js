import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import IconInfo from '@material-ui/icons/Info';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  paperWidthXs: {
    borderRadius: '25px',
    padding: theme.spacing.unit * 2,
    minWidth: '320px',
  },
  modalIcon: {
    fontSize: '2rem',
    margin: '1.5rem auto',
  },
  modalTitle: {
    fontWeight: 700,
    lineHeight: '1.4',
    fontSize: '16px',
  },
  modalDesc: {
    margin: '1.5rem auto',
  },
});

const modalTransition = props => <Slide direction="up" {...props} />;

const messageDialog = ({ classes, open, title, desc, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={modalTransition}
      maxWidth="xs"
      classes={{ paperWidthXs: classes.paperWidthXs }}
      onClose={onCancel}
      onBackdropClick={onCancel}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <IconInfo className={classes.modalIcon} color="primary" />
      <div>
        <Grid align="center">
          <Typography variant="subtitle1" className={classes.modalTitle}>{title}</Typography>
          <Typography className={classes.modalDesc}>{desc}</Typography>
          <Button className={classes.button} variant="outlined" color="primary" onClick={onConfirm}>
            <FormattedMessage
              id="common.ok"
              defaultMessage="OK"
              description="Rótulo comum - OK"
            />
          </Button>
        </Grid>
      </div>
    </Dialog>
  );
};

messageDialog.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool.isRequired,
  title: PropTypes.node,
  desc: PropTypes.node,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default withStyles(styles)(messageDialog);
