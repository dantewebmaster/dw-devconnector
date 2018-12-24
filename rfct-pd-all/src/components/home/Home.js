import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerActions } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
// ICONS
import TuneIcon from '@material-ui/icons/Tune';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooksOutlined';
import HowToRegIcon from '@material-ui/icons/HowToRegOutlined';
import PersonOutlineIcon from '@material-ui/icons/PersonOutlined';
import GetAppIcon from '@material-ui/icons/GetAppOutlined';
import FindInPageIcon from '@material-ui/icons/FindInPageOutlined';
// CUSTOM COMPONENTS
import HomeCard from '../common/HomeCard';
// ACTIONS
import * as authActions from '../../actions/authActions';

const publicPath = process.env.PUBLIC_PATH;

class HomePage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <div>
        <Typography variant="subtitle1" component="h1" style={{ padding: '0 0 1.5rem' }}>
          <FormattedMessage
            id="page.homeTitle"
            defaultMessage="Gestão de Relação Comercial"
            description="Título da página - Home/Gestão de Relação Comercial"
          />
        </Typography>
        <Grid container spacing={40}>
          <Grid item xs={12} sm={6} md={4}>
            <HomeCard
              title={<FormattedMessage
                id="page.person_information"
                defaultMessage="Pessoas"
                description="Título da página - Pessoas"
              />}
              desc={<FormattedMessage
                id="card.person.desc"
                defaultMessage="Consulta de informações sobre Pessoas."
                description="Descrição do card da home - Pessoas"
              />}
              icon={<PersonOutlineIcon fontSize="inherit" />}
              linkTo={publicPath + "person-information"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <HomeCard
              title={<FormattedMessage
                id="page.parameters"
                defaultMessage="Parametrização"
                description="Título da página - Parametrização"
              />}
              desc={<FormattedMessage
                id="cards.parameters.desc"
                defaultMessage="Módulo de gestão da criação e manutenção de modelos e suas estruturas hierárquicas."
                description="Descrição do card da home - Parametrização"
              />}
              icon={<TuneIcon fontSize="inherit" />}
              linkTo={publicPath + "parameters"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <HomeCard
              title={<FormattedMessage
                id="menu.structure_change"
                defaultMessage="Movimentação"
                description="Rótulo do card da home - Movimentação"
              />}
              desc={<FormattedMessage
                id="card.online_structure_change.desc"
                defaultMessage="Consulta, agendamento e cancelamento de  movimentações e movimentações online."
                description="Descrição do card da home - Movimentação"
              />}
              icon={<ImportExportIcon fontSize="inherit" />}
              linkTo={publicPath + "relationship-structure-change"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <HomeCard
              title={<FormattedMessage
                id="common.commercial_status"
                defaultMessage="Status Comercial"
                description="Rótulo comum - Status Comercial"
              />}
              desc={<FormattedMessage
                id="cards.commercial_status.desc"
                defaultMessage="Cessação e reativação online de pessoas por CN e por Arquivo."
                description="Descrição do card da home - Status Comercial"
              />}
              icon={<HowToRegIcon fontSize="inherit" />}
              linkTo={publicPath + "person-relationship-status"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <HomeCard
              title={<FormattedMessage
                id="common.reports"
                defaultMessage="Relatórios"
                description="Rótulo comum - Relatórios"
              />}
              desc={<FormattedMessage
                id="cards.reports.desc"
                defaultMessage="Relatórios de movimentações, agendamentos e vigência de responsável."
                description="Descrição do card da home - Relatórios"
              />}
              icon={<LibraryBooksIcon fontSize="inherit" />}
              linkTo={publicPath + "scheduling-report"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <HomeCard
              title={<FormattedMessage
                id="common.downloads"
                defaultMessage="Downloads"
                description="Rótulo comum - Downloads"
              />}
              desc={<FormattedMessage
                id="card.downloads.desc"
                defaultMessage="Faça o download de arquivos de relatórios exportados."
                description="Descrição do card da home - Downloads"
              />}
              icon={<GetAppIcon fontSize="inherit" />}
              linkTo={publicPath + "downloads"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <HomeCard
              title={<FormattedMessage
                id="menu.structure_suggestion"
                defaultMessage="Sugestão"
                description="Rótulo de menu - Sugestão"
              />}
              desc={<FormattedMessage
                id="card.suggestion.desc"
                defaultMessage="Informe uma cobertura geográfica e receba uma sugestão de estrutura."
                description="Descrição do card da home - Sugestão"
              />}
              icon={<FindInPageIcon fontSize="inherit" />}
              linkTo={publicPath + "structure-suggestion"}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

HomePage.propTypes = {
  user: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  redirect: PropTypes.string.isRequired,
  accessToken: PropTypes.string,
  userCode: PropTypes.string,
  replace: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    redirect: ownProps.location.query.redirect || '/',
    accessToken: ownProps.location.query.accessToken,
    userCode: ownProps.location.query.userCode,
    replace: routerActions.replace,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
