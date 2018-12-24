import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import DeviceHubIcon from '@material-ui/icons/DeviceHubOutlined';

import StructureTree from 'Components/StructureTree';
import ActionDialog from 'Components/ActionDialog';
import AssociateResponsibleForm from './AssociateResponsibleForm';

const styles = theme => ({
  stack: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    color: `${theme.palette.grey['400']} !important`,
    fontSize: '0.8em',
    minHeight: '3em',
    marginTop: theme.spacing.unit * 2,
  },
  info: {
    fontSize: '1em',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    margin: '20px 0'
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
    marginTop: -3,
  },
});

const AssociationStructureView = ({ fields, lists, handlers, dialogOpen, classes }) => {
  return (
    <React.Fragment>
      <Card style={{ overflow: 'visible', marginBottom: '16px' }}>
        <CardContent>
          <Grid container spacing={40} justify="center">
            <Grid item xs={2}>
              <div className={classes.stack}>
                <Typography className={classes.title}>
                  <FormattedMessage
                    id="common.commercial_structure_code"
                    defaultMessage="Código da estrutura comercial"
                    description="Rótulo comum - Código da estrutura comercial"
                  />
                </Typography>
                <div className={classes.info}>
                  <Typography >
                    {fields.structureCode}
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className={classes.stack}>
                <Typography className={classes.title}>
                  <FormattedMessage
                    id="common.structure_name"
                    defaultMessage="Nome da estrutura comercial"
                    description="Rótulo comum - Nome da estrutura comercial"
                  />
                </Typography>
                <div className={classes.info}>
                  <Typography >
                    {fields.structureName}
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className={classes.stack}>
                <Typography className={classes.title}>
                  <FormattedMessage
                    id="common.person_code"
                    defaultMessage="Código da pessoa"
                    description="Rótulo comum - Código da pessoa"
                  />
                </Typography>
                <div className={classes.info}>
                  <Typography >
                    {fields.personCode}
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className={classes.stack}>
                <Typography className={classes.title}>
                  <FormattedMessage
                    id="common.person"
                    defaultMessage="Pessoa"
                    description="Rótulo comum - Pessoa"
                  />
                </Typography>
                <div className={classes.info}>
                  <Typography >
                    {fields.personName}
                  </Typography>
                </div>
              </div>
            </Grid>
            {fields.functions && fields.functions.length > 0 &&
              <Grid item xs={4}>
                <Typography className={classes.title}>
                  <FormattedMessage
                    id="common.role_function"
                    defaultMessage="Papel/Função"
                    description="Rótulo comum - Papel / Função"
                  />
                </Typography>
                <Typography>
                  {fields.functions.map(item => `${item.functionName} / ${item.roleName}`)}
                </Typography>
              </Grid>}
          </Grid>
        </CardContent>
        <Divider />
        <CardContent>
          <Grid container spacing={40} justify="center">
            <Grid item md={4}>
              <div className={classes.stack}>
                <header className={classes.header}>
                  <DeviceHubIcon className={classes.icon} />
                  <Typography style={{ textTransform: 'uppercase' }}>
                    <FormattedMessage
                      id="common.commercial_structure"
                      defaultMessage="Estrutura Comercial"
                      description="Rótulo comum - Estrutura Comercial"
                    />
                  </Typography>
                </header>
                <article>
                  <StructureTree structures={lists.structureSearchTree} />
                </article>
              </div>
            </Grid>
            <Grid item md={8}>
              {fields.hasResponsible === true ?
                <React.Fragment>
                  <header className={classes.header}>

                  </header>
                  <article>
                    <div>
                      <Button
                        variant="contained"
                        size="large"
                        color="primary"
                      >
                        <FormattedMessage
                          id="common.unassign"
                          defaultMessage="Remover Atribuição"
                          description="Rótulo comum - Remover Atribuição"
                        />
                      </Button>
                    </div>
                  </article>
                </React.Fragment>
                :
                <React.Fragment>
                  <header className={classes.header}>
                    <Typography style={{ textTransform: 'uppercase' }}>
                      <FormattedMessage
                        id="labels.fields.structure_not_associated"
                        defaultMessage="Estrutura não possui pessoa responsável"
                        description="Rótulo do campo - Estrutura não possui pessoa responsável"
                      />
                    </Typography>
                  </header>
                  <article>
                    <div>
                      <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        onClick={() => handlers.openDialog()}
                      >
                        <FormattedMessage
                          id="common.assign"
                          defaultMessage="Atribuir"
                          description="Rótulo comum - Atribuir"
                        /> - P
                      </Button>
                    </div>
                  </article>
                </React.Fragment>
              }
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <ActionDialog
        open={dialogOpen}
        onCancel={() => handlers.closeDialog(2)}
        iconType="info"
        title={<FormattedMessage
          id="modal.title.association_responsible"
          defaultMessage="Relacionar responsável a estrutura"
          description="Rótulo do botão - Relacionar responsável a estrutura"
        />}
        confirmMode={false}
        customForm={
          <AssociateResponsibleForm fields={fields} handlers={handlers} />
        }
      />
    </React.Fragment>
  );
};

AssociationStructureView.propTypes = {
  fields: PropTypes.object.isRequired,
  lists: PropTypes.object,
  handlers: PropTypes.object,
  classes: PropTypes.object,
  dialogOpen: PropTypes.bool,
};

export default withStyles(styles)(AssociationStructureView);
