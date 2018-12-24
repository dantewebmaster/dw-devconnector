import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import moment from "moment";
// MATERIAL UI COMPONENTS
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { withStyles } from '@material-ui/core/styles';
// UTILS
import formatDate from 'Utils/formatDate';

const styles = () => ({
  date: {
    marginBottom: 15,
  },
  button: {
    marginLeft: 15,
  },
});

const searchFilter = ({ fields, handlers, lists, classes }) => {
  const today = moment().endOf('day');
  const isSearchDisabled = !moment(fields.selectedDate, 'YYYY-MM-DD', true).isValid() || moment(fields.selectedDate) > today;

  const isProcessDisabled = !fields.selectedStructures || fields.selectedStructures.length === 0;

  return (
    <Grid container spacing={16} justify="flex-start" alignItems="center">
      <Grid item xs={12} md={2}>
        <Typography variant="caption">
          <FormattedMessage
            id="common.closing_date"
            defaultMessage="Data de Fechamento"
            description="Rótulo comum - Data de Fechamento"
          />
        </Typography>
        <Select
          value={fields.selectedDate}
          onChange={handlers.handleDateChange}
          disabled={(lists.closingDates || []).length === 0}
          fullWidth
        >
          {lists.closingDates.map(date => (
            <MenuItem
              key={date.dateEnd}
              value={date.dateEnd}
            >
              {formatDate(date.dateEnd)}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={12} md={4}>
        <div>
          <Typography variant="caption">
            <FormattedMessage
              id="label.filter_by_parent_structures"
              defaultMessage="Filtrar por estrutura superior"
              description="Rótulo do item de formulário - Filtrar por estrutura superior"
            />
          </Typography>
          <Select
            value={fields.selectedParentStructure}
            onChange={handlers.handleParentStructureChange('selectedParentStructure')}
            disabled={lists.parentStructures.length === 0 || lists.structuresByDate.length === 0}
            fullWidth
          >
            <MenuItem value={''} />
            {lists.parentStructures.map(structure =>
              <MenuItem
                key={structure.structureCode}
                value={structure.structureCode}
              >
                {structure.structureName}
              </MenuItem>)}
          </Select>
        </div>
      </Grid>
      <Grid item xs={12} md={4}>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={handlers.handleSearchStructuresByDate}
          disabled={isSearchDisabled}
        >
          <FormattedMessage
            id="common.search"
            defaultMessage="Pesquisar"
            description="Rótulo comum - Pesquisar"
          />
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handlers.handleBulkReactivateSelected}
          disabled={(fields.selectedDate === "") || isProcessDisabled}
          className={classes.button}
        >
          <FormattedMessage
            id="common.start_process"
            defaultMessage="Processar"
            description="Rótulo comum - Processar"
          />
        </Button>
      </Grid>
    </Grid>
  );
};

searchFilter.propTypes = {
  fields: PropTypes.object.isRequired,
  lists: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  classes: PropTypes.object,
};

export default withStyles(styles)(searchFilter);
