import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import CardTemplate from 'Components/common/templates/CardTemplate';

const styles = theme => ({
  title: {
    color: `${theme.palette.grey['400']} !important`,
    fontSize: '0.8em',
    minHeight: theme.spacing.unit * 3,
  },
});

const PersonStructure = ({ fields, buttonLabel, buttonAction, classes }) => {
  return (
    <CardTemplate>
      <Grid container spacing={8} justify="space-between" alignItems="center">
        {fields.structureCode &&
          <Grid item xs={2}>
            <Typography className={classes.title}>
              <FormattedMessage
                id="common.structure_code"
                defaultMessage="Código da estrutura"
                description="Rótulo comum - Código da estrutura"
              />
            </Typography>
            <Typography >{fields.structureCode}</Typography>
          </Grid>}
        {fields.structureName &&
          <Grid item xs={2}>
            <Typography className={classes.title}>
              <FormattedMessage
                id="labels.fields.structure_name"
                defaultMessage="Nome da estrutura comercial"
                description="Rótulo da coluna - Nome da estrutura"
              />
            </Typography>
            <Typography>{fields.structureName}</Typography>
          </Grid>}
        {fields.personCode &&
          <Grid item xs={2}>
            <Typography className={classes.title}>
              <FormattedMessage
                id="common.person_code"
                defaultMessage="Código da pessoa"
                description="Rótulo comum - Pesquisar"
              />
            </Typography>
            <Typography>{fields.personCode}</Typography>
          </Grid>}
        {fields.personName &&
          <Grid item xs={2}>
            <Typography className={classes.title}>
              <FormattedMessage
                id="common.person"
                defaultMessage="Pessoa"
                description="Rótulo comum - Pessoa"
              />
            </Typography>
            <Typography>{fields.personName}</Typography>
          </Grid>}
        {fields.functions && fields.functions.length > 0 &&
          <Grid item xs={5}>
            <Typography className={classes.title}>
              <FormattedMessage
                id="common.role_function"
                defaultMessage="Papel / Função"
                description="Rótulo comum - Papel / Função"
              />
            </Typography>
            <Typography>
              {fields.functions.map(item => `${item.functionName} / ${item.roleName}`)}
            </Typography>
          </Grid>}
        <Grid item align="right">
          <Button
            variant="contained"
            onClick={buttonAction}
            size="medium"
            color="primary"
          >
            {buttonLabel}
          </Button>
        </Grid>
      </Grid>
    </CardTemplate>
  );
};

PersonStructure.propTypes = {
  classes: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  buttonLabel: PropTypes.object,
  buttonAction: PropTypes.func,
};

export default withStyles(styles)(PersonStructure);
