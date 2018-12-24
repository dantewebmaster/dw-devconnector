import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

// STYLES
const styles = theme => ({
  root: {
    display: 'flex',
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing.unit * 4,
    paddingTop: theme.spacing.unit * 5,
  },
  formItem: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
    width: '320px',
    '@media (max-width: 920px)': {
      width: '50%',
    },
  },
});

const ReportFilter = ({ classes, fields, cycles, plansLevels, onChange, disableSelect }) => {
  return (
    <CardContent className={classes.root}>
      <div className={classes.formItem}>
        <Typography variant="caption">
          <FormattedMessage
            id="label.movement_type"
            defaultMessage="Movimentações:"
            description="Rótulo do item de formulário - Movimentações:"
          />
        </Typography>
        <Select
          value={fields.queryType}
          onChange={onChange('queryType')}
          fullWidth
          disabled={disableSelect}
        >
          <MenuItem value={0}>
            <FormattedMessage
              id="common.scheduled"
              defaultMessage="Agendadas"
              description="Rótulo comum - Agendadas"
            />
          </MenuItem>
          <MenuItem value={1}>
            <FormattedMessage
              id="common.effected"
              defaultMessage="Efetivadas"
              description="Rótulo comum - Efetivadas"
            />
          </MenuItem>
          <MenuItem value={2}>
            <FormattedMessage
              id="label.canceled"
              defaultMessage="Canceladas"
              description="Valor do item de select - Canceladas"
            />
          </MenuItem>
          <MenuItem value={3}>
            <FormattedMessage
              id="common.not_effected"
              defaultMessage="Não Efetivadas"
              description="Rótulo comum - Não Efetivadas"
            />
          </MenuItem>
        </Select>
      </div>
      {fields.queryType.toString() &&
        <div className={classes.formItem}>
          <Typography variant="caption">
            {fields.queryType === 0 ?
              <FormattedMessage
                id="label.origin_cycle"
                defaultMessage="Selecione o ciclo origem"
                description="Rótulo do item de formulário - Selecione o ciclo origem"
              /> : <FormattedMessage
                id="label.past_cycle"
                defaultMessage="Selecione ciclo passado"
                description="Rótulo do item de formulário - Seleção de ciclo passado"
              />}
          </Typography>
          <Select
            value={fields.cycle}
            onChange={onChange('cycle')}
            disabled={cycles.length === 0}
            fullWidth
          >
            {cycles.map(cycle => <MenuItem key={cycle.cycleCode} value={cycle.cycleCode}>{cycle.cycleCode}</MenuItem>)}
          </Select>
        </div>
      }
      { plansLevels && plansLevels.length > 0 &&
        <div className={classes.formItem}>
        <Typography variant="caption">
          <FormattedMessage
            id="gp_level.list"
            defaultMessage="Tipo de Nível"
            description="Tipo de Nível"
          />
        </Typography>
        <Select
          value={fields.schedulingByGpLevel}
          onChange={onChange('schedulingByGpLevel')}
          fullWidth
        >
          <MenuItem
            value='0'
          >
            <FormattedMessage
              id="common.all"
              defaultMessage="Todos"
              description="Rótulo comum - Todos"
            />
          </MenuItem>
          {plansLevels.map(item =>
            <MenuItem
              key={item.sequence}
              value={item.idLevel}
            >
              { item.levelName }
            </MenuItem>
          )}
        </Select>
      </div>
      }
    </CardContent>
  );
};

ReportFilter.propTypes = {
  plansLevels: PropTypes.array,
  cycles: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  disableSelect: PropTypes.bool.isRequired,
};

export default withStyles(styles)(ReportFilter);
