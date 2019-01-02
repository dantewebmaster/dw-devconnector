import React from 'react';
import 'react-block-ui/style.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ensureIntl } from './ensureIntl';
import { bindActionCreators } from "redux";
import styled from 'styled-components';
import ReduxBlockUi from 'react-block-ui/redux';
import { addLocaleData, IntlProvider } from 'react-intl';
// MATERIAL UI COMPONENTS
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CircularProgress from 'material-ui/CircularProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import commercialManagementTheme from './assets/themes/commercialManagementTheme';
// CUSTOM COMPONENTS
import Header from 'containers/common/header';
import TopNavigation from 'containers/common/TopNavigation';
import * as authAction from "containers/Login/actions/authActions";
//HELPERS
import translations from './l10n/';
import en from "react-intl/locale-data/en";
import pt from "react-intl/locale-data/pt";
import es from "react-intl/locale-data/es";
import getLanguageFromLocale from './utils/getLanguageFromLocale';
import { getLocalStorageSessionData, setLocalStorageSessionDataProp } from './utils/localStorageSessionData';

import getMenu from './utils/HandleGetMenu';

// const messages = require('./l10n/pt-BR.json');

const muiTheme = getMuiTheme(commercialManagementTheme);

addLocaleData([...pt, ...es, ...en]);

const MainWrapper = styled.div`
  width: ${props => !props.navDrawerOpen ? '100%' : (props.windowWidth - (200 + 60)) + 'px'};
  margin-left: ${props => !props.navDrawerOpen ? '0px' : '260px'};
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLangChange = this.handleLangChange.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);

    this.state = {
      // messages: messages,
      // locale: "pt-BR",
      // mainContentClassNames: 'container-fluid'
      navDrawerOpen: false,
      navDrawerClassNames: 'col',
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,

      activeMenus: [],
    };

    this.onResize = this.onResize.bind(this);
  }

  onResize() {
    if (this.rqf) return;
    if (typeof window !== 'undefined') {
      this.rqf = window.requestAnimationFrame(() => {
        this.rqf = null;
        this.updateDimensions();
      });
    }
  }

  updateDimensions() {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  }

  componentWillMount() {
    const { user } = this.props;
    //ensure we have the messages in redux store
    if (user && !user.messages && user.locale) {
      this.changeLanguage(user.locale);
    }
  }

  componentDidMount() {
    this.updateDimensions();
    if (typeof window !== 'undefined')
      window.addEventListener('resize', this.onResize, false);

    getMenu('BR', 1)
      .then(res => this.setState({ activeMenus: res }));
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined')
      window.removeEventListener('resize', this.onResize);
  }

  handleLangChange(value) {
    this.changeLanguage(value);
  }

  changeLanguage(lang) {
    ensureIntl(lang).then(({ messages, localeData }) => {
      addLocaleData(localeData);
      setLocalStorageSessionDataProp('locale', lang);
      this.setState({ lang, messages, locale: lang });
      this.props.actions.changeLanguage(lang, messages);
    });
  }
  getModule(user = { modules: [] }) {
    return (user.modules || []).find(row => row.code === process.env.MODULE_NAME);
  }
  render() {
    let { user } = this.props;
    const { navDrawerOpen, windowWidth } = this.state;
    let locale =
      user.locale ||
      this.state.locale ||
      getLocalStorageSessionData('locale') ||
      navigator.language;

    const messages =
      user.messages || this.state.messages || translations[getLanguageFromLocale(locale)];

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <IntlProvider locale={locale} key={locale} messages={messages}>
          <ReduxBlockUi
            tag="div"
            block={[/_PENDING/]}
            unblock={[/_FULFILLED/, /_REJECTED/, /_AUTOCOMPLETE/, /_UNBLOCK/]}
            loader={<CircularProgress size={80} thickness={5} color="#00BCD4" />}
          >
            {user.isAuthenticated
              ? (
                <div>
                  <Header
                    width={windowWidth}
                    user={user}
                    module={this.getModule(user)}
                    locale={locale}
                    onChangeLanguage={this.handleLangChange}
                  />

                  <div className="header-nav">
                    <TopNavigation activeMenus={this.state.activeMenus} />
                  </div>

                  <MainWrapper
                    className="middle"
                    navDrawerOpen={navDrawerOpen}
                    windowWidth={windowWidth}
                  >

                    <div className="container-fluid px-3 mb-5">
                      <div className="row">
                        <div className="col">
                          {this.props.children}
                        </div>
                      </div>
                    </div>

                  </MainWrapper>
                </div>
              )
              : (
                <div>
                  <div>
                    <img
                      className="groups-container-login-background"
                      src={require('assets/img/backgroundNatura.png')}
                      alt="Background Natura"
                    />
                    <div className="groups-container-login-background-img">
                      <img className="header-logo-img" src={require('assets/img/natura.png')} alt="Natura Logo" />
                    </div>
                  </div>
                  {this.props.children}
                </div>
              )
            }
          </ReduxBlockUi>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  user: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.usuario
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authAction, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
