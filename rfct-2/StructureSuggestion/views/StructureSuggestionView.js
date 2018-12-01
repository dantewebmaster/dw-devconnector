import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MUI Components
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// ICONS
import SearchIcon from '@material-ui/icons/SearchOutlined';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import { withStyles } from '@material-ui/core/styles';
// CUSTOM COMPONENTS
import StructureTree from 'Components/StructureTree';
import AutoComplete from 'Components/AutoComplete';
import CardTemplate from 'Components/common/templates/CardTemplate';

const styles = theme => ({
  pageTitle: {
    padding: '1.5rem 0.8rem',
  },
  responsibleHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  responsibleIcon: {
    marginRight: theme.spacing.unit * 2,
    fontSize: '32px',
  },
  responsibleInfo: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '48px',
    marginTop: '48px',
    '& > div': {
      marginRight: theme.spacing.unit * 6,
    },
  },
});

const StructureSuggestionView = ({ classes, fields, lists, handlers }) => {
  const resetInput = () => fields.resetFields;

  return (
    <div>
      <Typography variant="display1" component="h1" className={classes.pageTitle}>
        <FormattedMessage
          id="page.structure_suggestion"
          defaultMessage="Sugestão de Estrutura Comercial"
          description="Título da página - Sugestão de Estrutura Comercial"
        />
      </Typography>
      <CardTemplate
        icon={<SearchIcon />}
        title={<FormattedMessage
          id="card.title.search"
          defaultMessage="Pesquisar"
          description="Titulo do card - Pesquisar"
        />}
      >
        <Grid container spacing={40} justify="space-around" alignItems="center">
          <Grid item xs={6}>
            {fields.techParams.geoCoverageType === '2' ?
              <React.Fragment>
                <Typography variant="caption">
                  <FormattedMessage
                    id="label.geo_structure"
                    defaultMessage="Estrutura Geográfica"
                    description="Rótulo do campo - Estrutura Geográfica"
                  />
                </Typography>
                <AutoComplete
                  field="geoCoverageCode"
                  value="geoCoverageCode"
                  label="geoCoverageDescription"
                  options={lists.geoStructures}
                  onChangeHandler={handlers.autocompleteFieldChange('geoCoverageCode')}
                  onInputChangeHandler={handlers.autocompleteFieldChange('searchText')}
                  clearInput={resetInput()}
                  isLoading={fields.loading}
                />
              </React.Fragment> : fields.techParams.geoCoverageType === '1' ?
                <TextField
                  label={<FormattedMessage
                    id="label.geo_structure"
                    defaultMessage="Estrutura Geográfica"
                    description="Rótulo do campo - Estrutura Geográfica"
                  />}
                  className={classes.textField}
                  value={fields.geoCoverageCode || ''}
                  onChange={handlers.textFieldChange('geoCoverageCode')}
                  InputLabelProps={{ shrink: true }}
                /> : null}
          </Grid>
          <Grid item xs={6} align="right">
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={handlers.getSuggestedStructure}
              disabled={!fields.geoCoverageCode && !fields.searchText}
            >
              <FormattedMessage
                id="button.search"
                defaultMessage="Buscar"
                description="Rótulo do botão - Buscar"
              />
            </Button>
          </Grid>
        </Grid>
      </CardTemplate>

      {lists.suggestedStructureTree
        && lists.suggestedStructureTree.length > 0 &&
        <CardTemplate>
          <Grid container spacing={40}>
            <Grid item md={3} sm={12}>
              <StructureTree
                title={<FormattedMessage
                  id="subtitle.suggested_structure"
                  defaultMessage="Estrutura Comercial Sugerida"
                  description="Rótulo do campo - Estrutura Comercial Sugerida"
                />}
                structures={lists.suggestedStructureTree}
              />
              <Button
                variant="outlined"
                size="large"
                color="primary"
                onClick={() => handlers.clearSearch()}
              >
                <FormattedMessage
                  id="button.new_search"
                  defaultMessage="Nova Busca"
                  description="Rótulo do botão - Nova Busca"
                />
              </Button>
            </Grid>

            <Grid item md={9} sm={12}>
              <div className={classes.responsibleHeader}>
                <PeopleIcon className={classes.responsibleIcon} />
                <Typography variant="button" component="h4">
                  <FormattedMessage
                    id="labels.subtitle.responsible"
                    defaultMessage="Responsável"
                    description="Rótulo do campo - Responsável"
                  />
                </Typography>
              </div>
              <div className={classes.responsibleInfo}>
                {fields.structureResponsible && Object.keys(fields.structureResponsible).length > 0 ?
                  <React.Fragment>
                    <div>
                      <Typography variant="caption" gutterBottom>Código da pessoa</Typography>
                      <Typography variant="button" component="h4">
                        {fields.structureResponsible.personCode}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption" gutterBottom>Nome da pessoa</Typography>
                      <Typography variant="button" component="h4">
                        {fields.structureResponsible.personName}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption" gutterBottom>Papel/Função</Typography>
                      <Typography variant="button" component="h4">
                        {fields.structureResponsible.functionName}
                      </Typography>
                    </div>
                  </React.Fragment> :
                  <Typography variant="subtitle1" component="h3">
                    <FormattedMessage
                      id="messages.responsible_without_structure"
                      defaultMessage="Estrutura não possui responsável."
                      description="Rótulo do campo - Estrutura não possui responsável"
                    />
                  </Typography>}
              </div>
            </Grid>
          </Grid>
        </CardTemplate>}
    </div>
  );
};

StructureSuggestionView.propTypes = {
  fields: PropTypes.object.isRequired,
  lists: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  classes: PropTypes.object,
};

export default withStyles(styles)(StructureSuggestionView);
