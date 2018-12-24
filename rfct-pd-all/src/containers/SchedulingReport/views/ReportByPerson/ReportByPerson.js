import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import ReportFilter from '../ReportFilter';
import ReportActions from '../ReportActions';

const styles = theme => ({
  textField: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    '@media (max-width: 920px)': {
      width: '100%',
    },
  },
});

const ReportByPerson = ({ handlers, fields, lists, classes }) => {
  return (
    <React.Fragment>
      <CardContent className={classes.root}>
        <TextField
          label={<FormattedMessage
            id="common.person_code"
            defaultMessage="Código da Pessoa"
            description="Rótulo comum - Código da Pessoa"
          />}
          className={classes.textField}
          value={fields.personCode}
          InputLabelProps={{ shrink: true }}
          onChange={handlers.fieldChange('personCode')}
        />
      </CardContent>
      <ReportFilter
        fields={fields}
        cycles={lists.cycles}
        onChange={handlers.fieldChange}
        disableSelect={fields.personCode === ''}
      />
      <ReportActions
        disableSubmit={fields.queryType === ''}
        onCancel={handlers.cancelReport}
        onSubmit={
          fields.queryType === 0 ? handlers.getRequestedReport :
            fields.queryType === 1 ? handlers.getProcessedReport :
              handlers.getInconsistenciesReport
        }
      />
    </React.Fragment>
  );
};

ReportByPerson.propTypes = {
  classes: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  lists: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReportByPerson);
