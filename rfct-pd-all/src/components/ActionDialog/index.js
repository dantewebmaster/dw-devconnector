import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
// ICONS
import IconInfo from '@material-ui/icons/Info';
import IconDelete from '@material-ui/icons/Delete';

const styles = theme => ({
  modalContent: {
    overflow: 'visible',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    margin: theme.spacing.unit,
  },
  paperWidthXs: {
    padding: theme.spacing.unit,
    borderRadius: theme.spacing.unit * 2,
    minWidth: '330px',
    maxWidth: '440px',
    overflow: 'visible',
  },
  paperWidthMd: {
    padding: theme.spacing.unit,
    borderRadius: theme.spacing.unit * 2,
    minWidth: '460px',
    maxWidth: '560px',
    overflow: 'visible',
  },
  modalIcon: {
    fontSize: '2rem',
    margin: '1.5rem auto',
  },
  modalTitle: {
    fontWeight: 700,
    lineHeight: '1.6',
    paddingBottom: theme.spacing.unit * 2,
    fontSize: '16px',
  },
  modalDesc: {
    margin: theme.spacing.unit * 3,
  },
});

const modalTransition = props => <Slide direction="up" {...props} />;

const actionDialog = ({ open, iconType, title, desc, onCancel, onConfirm, classes, confirmMode, onReasonChange, selectHandler, parameters, selectValue, reason, customForm }) => {

  return (
    <Dialog
      open={open}
      TransitionComponent={modalTransition}
      maxWidth="md"
      classes={{ paperWidthXs: classes.paperWidthXs, paperWidthMd: classes.paperWidthMd }}
      onClose={onCancel}
      onBackdropClick={onCancel}
      aria-labelledby="action-dialog-slide-title"
      aria-describedby="action-dialog-slide-description"
    >
      {!customForm ?
        iconType === "info" ?
          <IconInfo className={classes.modalIcon} color="primary" /> :
          <IconDelete className={classes.modalIcon} /> : null}

      <DialogContent className={classes.modalContent}>
        {title &&
          <Typography variant="subtitle1" align="center" className={classes.modalTitle} gutterBottom>
            {title}
          </Typography>}
        {desc &&
          <Typography align="center" className={classes.modalDesc}>{desc}</Typography>}

        {selectHandler && parameters.length > 0 &&
          <div style={{ display: 'block', margin: '0 auto 1rem', textAlign: 'center' }}>
            <InputLabel htmlFor="reason-select">
              <FormattedMessage
                id="common.reason"
                defaultMessage="Motivo"
                description="Rótulo comum - Motivo"
              />
            </InputLabel>
            <Select
              value={selectValue || 'Motivo'}
              onChange={selectHandler}
              inputProps={{
                name: 'reasonUid',
                id: 'reason-select'
              }}
              autoWidth={true}
              style={{ minWidth: '120px' }}
            >
              {parameters.slice(1, 4).map(item => {
                return (
                  <MenuItem
                    key={item.parameterUid}
                    value={item.parameterUid}
                    style={{ minWidth: '120px' }}
                  >
                    {item.parameterDescription}
                  </MenuItem>
                );
              })}
            </Select>
          </div>}

        {onReasonChange &&
          <div style={{ display: 'block', margin: '0 auto 1rem', textAlign: 'center' }}>
            <TextField
              label={<FormattedMessage
                id="common.justification"
                defaultMessage="Justificativa"
                description="Rótulo comum - Justificativa"
              />}
              margin="normal"
              fullWidth
              value={reason}
              onChange={onReasonChange}
            />
          </div>}
        {!customForm ?
          <div className={classes.buttons}>
            <Button
              className={classes.button}
              variant="contained"
              size="large"
              color="primary"
              onClick={onConfirm}
              disabled={
                (selectHandler && !selectValue) || (onReasonChange && typeof reason === "string"
                  && reason.trim().length === 0)
              }
            >
              {confirmMode ?
                <FormattedMessage
                  id="commom.yes"
                  defaultMessage="Sim"
                  description="Rótulo comum - Sim"
                /> : <FormattedMessage
                  id="common.ok"
                  defaultMessage="OK"
                  description="Rótulo comum - OK"
                />}
            </Button>

            {confirmMode &&
              <Button
                className={classes.button}
                variant="outlined"
                size="large"
                onClick={onCancel}
              >
                <FormattedMessage
                  id="common.no"
                  defaultMessage="Não"
                  description="Rótulo comum - Não"
                />
              </Button>}
          </div>
          : null}
        {customForm && customForm}
      </DialogContent>
    </Dialog>
  );
};

actionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  classes: PropTypes.object,
  iconType: PropTypes.string,
  title: PropTypes.node,
  desc: PropTypes.node,
  confirmMode: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onReasonChange: PropTypes.func,
  parameters: PropTypes.array,
  reason: PropTypes.string,
  selectHandler: PropTypes.func,
  selectValue: PropTypes.any,
  customForm: PropTypes.node,
};

export default withStyles(styles)(actionDialog);
