import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  formItem: {
    marginBottom: theme.spacing.unit * 4,
  },
});

const AssociateResponsibleForm = ({ handlers, fields, classes }) => {
  return (
    <React.Fragment>
      <div className={classes.formItem}>
        <TextField
          label={<FormattedMessage
            id="common.responsible"
            defaultMessage="Responsável"
            description="Rótulo comum - Responsável"
          />}
          value={fields.personCodeModal}
          InputLabelProps={{ shrink: true }}
          onKeyPress={handlers.enterKeyPressModal}
          onChange={handlers.textFieldChange('personCodeModal')}
          fullWidth
        />
      </div>
      <div className={classes.formItem}>
        <Typography>
          <FormattedMessage
            id="common.person"
            defaultMessage="Pessoa"
            description="Rótulo comum - Pessoa"
          />
        </Typography>
        <Typography>{fields.personName}</Typography>
      </div>
      <div className={classes.formItem}>
        <Typography>
          <FormattedMessage
            id="common.role_function"
            defaultMessage="Papel / Função"
            description="Rótulo comum - Papel / Função"
          />
        </Typography>
        <Typography>
          {fields.functions && fields.functions.length > 0 &&
            fields.functions.map(item => `${item.functionName} / ${item.roleName}`)
          }
        </Typography>
      </div>
      <Button
        variant="contained"
        size="large"
        color="primary"
        onClick={handlers.assignUnassign}
        disabled={!fields.personCode}
        style={{ margin: '0 auto', display: 'block' }}
      >
        <FormattedMessage
          id="common.confirm"
          defaultMessage="Confirmar"
          description="Rótulo comum - Confirmar"
        />
      </Button>
    </React.Fragment>
  );
};

AssociateResponsibleForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handlers: PropTypes.object,
  dialogOpen: PropTypes.bool,
  classes: PropTypes.object,
};

export default withStyles(styles)(AssociateResponsibleForm);
