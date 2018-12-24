import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import classNames from 'classnames';
import { Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import Divider from '@material-ui/core/Divider';
import AutoComplete from 'Components/AutoComplete';
import TextField from '@material-ui/core/TextField';

// ICON
import SearchIcon from '@material-ui/icons/SearchOutlined';

// VIEWS
import AssociationStructureView from './AssociationStructureView';
import AssociationResponsibleView from './AssociationResponsibleView';
import NotFound from 'Components/NotFound';

import CardTemplate from 'Components/common/templates/CardTemplate';

const styles = theme => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: '1.2em'
  },
  alignField: {
    marginTop: '24px',
  },
  grid: {
    borderRight: `1px solid ${theme.palette.grey['200']}`
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
    marginTop: 3,
  },
  structureSelect: {
    display: 'flex',
  },
});

const AssociationSearchView = ({ fields, lists, handlers, dialogOpen, classes }) => {
  const resetInput = () => fields.resetFields;

  return (
    <React.Fragment>
      <CardTemplate
        icon={<SearchIcon />}
        title={<FormattedMessage
          id="common.search"
          defaultMessage="Pesquisar"
          description="Rótulo comum - Pesquisar"
        />}
      >
        <Grid container spacing={40} justify="center">
          <Grid item md={6} sm={12} style={{ paddingTop: 16 }} className={classes.grid}>
            <Typography style={{ marginBottom: 8 }}>
              <FormattedMessage
                id="common.person"
                defaultMessage="Pessoa"
                description="Rótulo comum - Pessoa"
              />
            </Typography>
            <Divider />
            <div className={classes.alignField}>
              <TextField
                label={<FormattedMessage
                  id="common.person_code"
                  defaultMessage="Código da Pessoa"
                  description="Rótulo comum - Código da Pessoa"
                />}
                className={classes.textField}
                value={fields.personCodeField}
                InputLabelProps={{ shrink: true }}
                onKeyPress={handlers.enterKeyPress}
                onChange={handlers.textFieldChange('personCodeField')}
              />
            </div>
          </Grid>
          <Grid item md={6} sm={12} style={{ paddingTop: 16 }}>
            <Typography style={{ marginBottom: 8 }}>
              <FormattedMessage
                id="common.commercial_structure"
                defaultMessage="Estrutura Comercial"
                description="Rótulo comum - Estrutura comercial"
              />
            </Typography>
            <Divider />
            <Grid container spacing={16}>
              <Grid item xs={6}>
                <Typography className={classes.alignField} variant="caption">
                  <FormattedMessage
                    id="common.type"
                    defaultMessage="Tipo"
                    description="Rótulo comum - Tipo"
                  />
                </Typography>
                <AutoComplete
                  field="searchStructureLevelId"
                  value="structureLevelId"
                  label="structureLevelName"
                  onChangeHandler={handlers.setField}
                  options={lists.structureLevels}
                  onInputChangeHandler={handlers.setField}
                  clearInput={resetInput()}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.alignField} variant="caption">
                  <FormattedMessage
                    id="common.commercial_structure"
                    defaultMessage="Estrutura Comercial"
                    description="Rótulo comum - Estrutura comercial"
                  />
                </Typography>
                <AutoComplete
                  field="searchStructureCode"
                  value="structureCode"
                  label="structureName"
                  options={lists.searchStructures}
                  onChangeHandler={handlers.setField}
                  onInputChangeHandler={handlers.setField}
                  disabledInput={!fields.searchStructureLevelId}
                  clearInput={resetInput() || !fields.searchStructureLevelId}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardTemplate>
      {fields.responseSearchResponsible === false &&
        fields.associationResponsibleView.personCode === null &&
        <NotFound
          text={<FormattedMessage
            id="PERSON_NOT_FOUND"
            defaultMessage="Pessoa não encontrada"
            description="Mensagem quando não encontrar pessoa"
          />}
        />}
      {fields.responseSearchResponsible === true &&
        <AssociationResponsibleView
          fields={fields}
          lists={lists}
          handlers={handlers}
          dialogOpen={dialogOpen}
        />}
      {fields.responseSearchStructure === false &&
        <NotFound
          buttonAction={handlers.handleCancel}
          text={<FormattedMessage
            id="common.structure_not_found"
            defaultMessage="Estrutura não encontrada"
            description="Mensagem quando não encontrar estrutura"
          />}
          buttonLabel={<FormattedMessage
            id="common.new_search"
            defaultMessage="Nova Pesquisa"
            description="Rótulo do botão - Nova pesquisa"
          />}
        />}
      {fields.responseSearchStructure === true &&
        <AssociationStructureView
          fields={fields}
          lists={lists}
          handlers={handlers}
          dialogOpen={dialogOpen}
        />}
    </React.Fragment>
  );
};

AssociationSearchView.propTypes = {
  fields: PropTypes.object.isRequired,
  lists: PropTypes.object.isRequired,
  handlers: PropTypes.object,
  classes: PropTypes.object,
  dialogOpen: PropTypes.bool,
};

export default withStyles(styles)(AssociationSearchView);
