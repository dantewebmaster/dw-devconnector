import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

// ICONS
import IconExpandMore from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  expansionPanel: {
    backgroundColor: theme.palette.grey['100'],
    borderRadius: theme.spacing.unit * 0.5,
    marginTop: theme.spacing.unit * 2,
    padding: '0',
    '&:before': {
      display: 'none',
    },
  },
  expanded: {
    backgroundColor: '#fff',
    paddingTop: '0',
    border: `2px solid ${theme.palette.grey['100']}`,
  },
  expansionPanelSummary: {
    display: 'block',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
  },
  expansionPanelDetails: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4,
  },
  tableHeader: {
    backgroundColor: theme.palette.grey['100'],
    marginTop: theme.spacing.unit * 2,
  },
  tableItem: {
    borderBottom: `1px solid ${theme.palette.grey['100']}`,
    paddingTop: theme.spacing.unit * 2,
  },
});

const parametersList = ({ parameters, classes, group }) => {

  return (
    <ExpansionPanel classes={{ expanded: classes.expanded, root: classes.expansionPanel }} elevation={0}>
      <ExpansionPanelSummary className={classes.expansionPanelSummary} expandIcon={<IconExpandMore />}>
        <Typography component="h4">
          {group === 2 && <FormattedMessage
            id="common.cessation_reasons"
            defaultMessage="Motivos de Cessação"
            description="Rótulo comum - Motivos da Cessação"
          />}
          {group === 3 && <FormattedMessage
            id="common.cancel_reasons"
            defaultMessage="Motivos de Cancelamento"
            description="Rótulo comum - Motivos da Cancelamento"
          />}
        </Typography>
      </ExpansionPanelSummary>
      <Divider />
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
        {parameters && parameters.length > 0 ?
          <Table>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell>
                  <Typography component="p" align="left">
                    <FormattedMessage
                      id="common.description"
                      defaultMessage="Descrição"
                      description="Rótulo comum - Descrição"
                    />
                  </Typography>
                </TableCell>
                {group === 2 &&
                  <TableCell>
                    <Typography component="p" align="left">
                      <FormattedMessage
                        id="common.category"
                        defaultMessage="Categoria"
                        description="Rótulo comum - Categoria"
                      />
                    </Typography>
                  </TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {parameters && parameters.map(parameter => {
                return (
                  <TableRow key={parameter.parameterUid}>
                    {parameter.parameterDescription &&
                      <TableCell>
                        <Typography variant="caption" align="left">{parameter.parameterDescription}
                        </Typography>
                      </TableCell>}
                    {parameter.parameterText &&
                      <TableCell>
                        <Typography variant="caption" align="left">
                          {parameter.parameterText}
                        </Typography>
                      </TableCell>}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table> : <Typography align="center" component="h3">
            <FormattedMessage
              id="common.not_found"
              defaultMessage="Nada para mostrar"
              description="Rótulo comum - Nada para mostrar"
            />
          </Typography>}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

parametersList.propTypes = {
  classes: PropTypes.object.isRequired,
  parameters: PropTypes.array,
  group: PropTypes.number,
};

export default withStyles(styles)(parametersList);
