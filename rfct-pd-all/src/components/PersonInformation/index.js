import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
// UTILS
import formatDate from 'Utils/formatDate';

const personInformation = ({ selectedPerson, onEnterKeyPress, onPersonCodeChange, personCode }) => {
  const disabled = Object.keys(selectedPerson).length > 0;
  const hidden = !disabled;

  return (
    <Grid container style={{ padding: '40px 0 32px' }} spacing={16}>
      <Grid item xs={12} md={2}>
        <TextField
          label={<FormattedMessage
            id="common.person_code"
            defaultMessage="Código da CN"
            description="Rótulo comum - Código da CN"
          />}
          margin="normal"
          fullWidth
          disabled={disabled}
          InputLabelProps={{ shrink: true }}
          value={personCode}
          onKeyPress={onEnterKeyPress}
          onChange={onPersonCodeChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        {!hidden && <TextField
          label={<FormattedMessage
            id="common.full_name"
            defaultMessage="Nome Completo"
            description="Rótulo comum - Nome Completo"
          />}
          margin="normal"
          fullWidth
          disabled={disabled}
          InputLabelProps={{ shrink: true }}
          value={selectedPerson.name || ''}
        />}
      </Grid>
      <Grid item xs={12} md={3}>
        {!hidden && <TextField
          label={<FormattedMessage
            id="common.role_function"
            defaultMessage="Papel/Função"
            description="Rótulo comum - Papel/Função"
          />}
          margin="normal"
          fullWidth
          disabled={disabled}
          InputLabelProps={{ shrink: true }}
          value={selectedPerson.functionName || ''}
        />}
      </Grid>
      <Grid item xs={12} md={3}>
        {!hidden && <TextField
          label={<FormattedMessage
            id="common.commercial_status"
            defaultMessage="Status Comercial"
            description="Rótulo comum - Status Comercial"
          />}
          margin="normal"
          fullWidth
          disabled={disabled}
          InputLabelProps={{ shrink: true }}
          value={selectedPerson.status || ''}
        />}
      </Grid>
      {selectedPerson.currentCycle && selectedPerson.status && selectedPerson.status.statusCode !== 4 &&
        <React.Fragment>
          <Grid item xs={12} md={3}>
            {!hidden && <TextField
              label={<FormattedMessage
                id="common.current_cycle"
                defaultMessage="Código do Ciclo Vigente"
                description="Rótulo comum - Código do Ciclo Vigente"
              />}
              margin="normal"
              fullWidth
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
              value={selectedPerson.currentCycle.cycleCode}
            />}
          </Grid>
          <Grid item xs={12} md={3}>
            {!hidden && <TextField
              label={<FormattedMessage
                id="common.cycle_start"
                defaultMessage="Início do ciclo"
                description="Rótulo comum - Início do ciclo"
              />}
              margin="normal"
              fullWidth
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
              value={formatDate(selectedPerson.currentCycle.dateStart)}
            />}
          </Grid>
          <Grid item xs={12} md={3}>
            {!hidden && <TextField
              label={<FormattedMessage
                id="common.cycle_end"
                defaultMessage="Fim do ciclo"
                description="Rótulo comum - Fim do ciclo"
              />}
              margin="normal"
              fullWidth
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
              value={formatDate(selectedPerson.currentCycle.dateEnd)}
            />}
          </Grid>
          <Grid item xs={12} md={3}>
            {!hidden && <TextField
              label={<FormattedMessage
                id="common.level"
                defaultMessage="Nível"
                description="Rótulo comum - Nível"
              />}
              margin="normal"
              fullWidth
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
              value={selectedPerson.gpLevelDescription}
            />}
          </Grid>
        </React.Fragment>}
    </Grid>
  );
};

personInformation.propTypes = {
  onEnterKeyPress: PropTypes.func,
  onPersonCodeChange: PropTypes.func.isRequired,
  selectedPerson: PropTypes.object.isRequired,
  personCode: PropTypes.string,
};

export default personInformation;
