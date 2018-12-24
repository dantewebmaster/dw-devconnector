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
    padding: '0 0 1.5rem',
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
  const resetInput = () => !fields.geoCoverageCode;

  return (
    <div>
      <Typography variant="subtitle1" component="h1" className={classes.pageTitle}>
        <FormattedMessage
          id="page.structure_suggestion"
          defaultMessage="Sugestão de Estrutura Comercial"
          description="Título da página - Sugestão de Estrutura Comercial"
        />
      </Typography>
      <CardTemplate
        icon={<SearchIcon />}
        title={<FormattedMessage
          id="common.search"
          defaultMessage="Pesquisar"
          description="Rótulo comum - Pesquisar"
        />}
      >
        <Grid container spacing={40} justify="space-around" alignItems="center">
          <Grid item xs={6}>
            {fields.techParams.geoCoverageType === '2' ?
              <React.Fragment>
                <Typography variant="caption">
                  <FormattedMessage
                    id="common.geo_structure"
                    defaultMessage="Estrutura Geográfica"
                    description="Rótulo comum - Estrutura Geográfica"
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
                    id="common.type_zipcode"
                    defaultMessage="Digite o CEP"
                    description="Rótulo comum - Digite o CEP"
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
              disabled={!fields.geoCoverageCode}
            >
              <FormattedMessage
                id="common.search"
                defaultMessage="Pesquisar"
                description="Rótulo comum - Pesquisar"
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
                  description="Subtítulo - Estrutura Comercial Sugerida"
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
                  id="common.new_search"
                  defaultMessage="Nova Pesquisa"
                  description="Rótulo comum - Nova Pesquisa"
                />
              </Button>
            </Grid>

            <Grid item md={9} sm={12}>
              <div className={classes.responsibleHeader}>
                <PeopleIcon className={classes.responsibleIcon} />
                <Typography variant="button" component="h4">
                  <FormattedMessage
                    id="common.responsible"
                    defaultMessage="Responsável"
                    description="Rótulo comum - Responsável"
                  />
                </Typography>
              </div>
              <div className={classes.responsibleInfo}>
                {fields.structureResponsible && Object.keys(fields.structureResponsible).length > 0 ?
                  <React.Fragment>
                    <div>
                      <Typography variant="caption" gutterBottom>
                        <FormattedMessage
                          id="common.person_code"
                          defaultMessage="Código da Pessoa"
                          description="Rótulo comum - Código da Pessoa"
                        />
                      </Typography>
                      <Typography variant="button" component="h4">
                        {fields.structureResponsible.personCode}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption" gutterBottom>
                        <FormattedMessage
                          id="common.person_name"
                          defaultMessage="Nome da Pessoa"
                          description="Rótulo comum - Nome da Pessoa"
                        />
                      </Typography>
                      <Typography variant="button" component="h4">
                        {fields.structureResponsible.personName}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption" gutterBottom>
                        <FormattedMessage
                          id="common.role_function"
                          defaultMessage="Papel / Função"
                          description="Rótulo comum - Papel / Função"
                        />
                      </Typography>
                      <Typography variant="button" component="h4">
                        {fields.structureResponsible.functionName}
                      </Typography>
                    </div>
                  </React.Fragment> :
                  <Typography variant="subtitle1" component="h3">
                    <FormattedMessage
                      id="messages.responsible_without_structure"
                      defaultMessage="Estrutura não possui responsável."
                      description="Mensagem exibida quando estrutura não possui responsável"
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
