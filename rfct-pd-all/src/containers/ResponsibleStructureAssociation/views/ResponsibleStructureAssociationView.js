import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
// VIEWS
import AssociationSearchView from './AssociationSearchView';
import SearchAwaitView from './SearchAwaitView';
import SearchDoneView from './SearchDoneView';
import ResponsibleWithoutStructureView from './ResponsibleWithoutStructureView';
import StructureWithoutResponsibleView from './StructureWithoutResponsibleView';
// CUSTOM COMPONENT
import ViewSelect from 'Components/ViewSelect/ViewSelect';
// ICONS
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import PersonIcon from '@material-ui/icons/PersonOutlined';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import DeviceIcon from '@material-ui/icons/DeviceHubOutlined';
import CheckIcon from '@material-ui/icons/Check';

const styles = theme => ({
  pageTitle: {
    padding: '0 0 1.5rem',
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  icon: {
    fontSize: 32,
  },
});

const ResponsibleStructureAssociationView = ({ fields, lists, handlers, view, dialogOpen, classes }) => {
  const getView = (view) => {
    switch (view) {
      case 1:
        return <AssociationSearchView
          fields={fields}
          lists={lists}
          handlers={handlers}
          dialogOpen={dialogOpen}
        />;
      case 2:
        return <React.Fragment>
          <SearchAwaitView />
          <SearchDoneView />
        </React.Fragment>;
      case 3:
        return <ResponsibleWithoutStructureView
          fields={fields}
          lists={lists}
          handlers={handlers}
          dialogOpen={dialogOpen}
        />;
      case 4:
        return <StructureWithoutResponsibleView
          fields={fields}
          lists={lists}
          handlers={handlers}
          dialogOpen={dialogOpen}
        />;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <Typography variant="subtitle1" component="h1" className={classes.pageTitle}>
        <FormattedMessage
          id="page.responsible_association"
          defaultMessage="Atribuição"
          description="Título da página - Atribuição"
        />
      </Typography>
      <Paper className={classes.paper} elevation={0}>
        <Grid container spacing={40} justify="center" alignItems="center">
          <Grid item xs={3} align="center">
            <ViewSelect
              icon={<PeopleIcon className={classes.icon} />}
              onView={view === 1}
              handler={() => handlers.viewSelect(1)}
              label={<FormattedMessage
                id="common.association"
                defaultMessage="Associação"
                description="Rótulo comum - Associação"
              />}
            />
          </Grid>
          <Grid item xs={3} align="center">
            <ViewSelect
              icon={<SearchIcon className={classes.icon} />}
              onView={view === 2}
              handler={() => handlers.viewSelect(2)}
              badgeContent={fields.bulkStatus === 1 && <CheckIcon />}
              badgeColor="primary"
              label={<FormattedMessage
                id="common.search"
                defaultMessage="Pesquisar"
                description="Rótulo comum - Pesquisar"
              />}
            />
          </Grid>
          <Grid item xs={3} align="center">
            {fields.bulkStatus === 1 && lists.responsibleBulkResult.length > 0 &&
              <ViewSelect
                icon={<PersonIcon className={classes.icon} />}
                onView={view === 3}
                handler={() => handlers.viewSelect(3)}
                badgeContent={lists.responsibleBulkResult.length}
                badgeColor={view === 3 ? 'primary' : 'secondary'}
                label={<FormattedMessage
                  id="association.responsible_no_structure"
                  defaultMessage="Responsáveis sem estrutura"
                  description="Rótulo do campo - Responsáveis sem estrutura"
                />}
              />}
          </Grid>
          <Grid item xs={3} align="center">
            {fields.bulkStatus === 1 && lists.structureBulkResult.length > 0 &&
              <ViewSelect
                icon={<DeviceIcon className={classes.icon} />}
                onView={view === 4}
                handler={() => handlers.viewSelect(4)}
                badgeContent={lists.structureBulkResult.length}
                badgeColor={view === 4 ? 'primary' : 'secondary'}
                label={<FormattedMessage
                  id="association.structure_no_responsible"
                  defaultMessage="Estruturas sem responsáveis"
                  description="Rótulo do campo - Estruturas sem responsáveis"
                />}
              />}
          </Grid>
        </Grid>
      </Paper>
      {getView(view)}
    </React.Fragment>
  );
};

ResponsibleStructureAssociationView.propTypes = {
  handlers: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  lists: PropTypes.object.isRequired,
  classes: PropTypes.object,
  view: PropTypes.number,
  dialogOpen: PropTypes.bool,
};

export default withStyles(styles)(ResponsibleStructureAssociationView);

