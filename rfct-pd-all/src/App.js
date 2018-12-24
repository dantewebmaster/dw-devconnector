import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ensureIntl } from "./ensureIntl";
import ReduxBlockUi from "react-block-ui/redux";
import "react-block-ui/style.css";
import index from "./assets/themes/commercialManagementTheme/index";
import * as authAction from "./actions/authActions";
// LANGUAGES/REACT INTL
import { addLocaleData, IntlProvider } from "react-intl";
import en from "react-intl/locale-data/en";
import pt from "react-intl/locale-data/pt";
import es from "react-intl/locale-data/es";
// MATERIAL UI COMPONENTS
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
// CUSTOM COMPONENTS
import Template from "./components/common/Template";
import BackgroundLogin from "./components/login/BackgroundLogin";

let theme = createMuiTheme({
  ...index,
  typography: {
    useNextVariants: true,
  },
  palette: {
    ...index.palette,
    type: 'light',
  },
});

let messages = require('./l10n/pt-BR.json');

addLocaleData([...pt, ...es, ...en]);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLangChange = this.handleLangChange.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.state = {
      locale: "pt-BR",
      messages: messages,
      navDrawerOpen: false,
      navDrawerClassNames: 'col',
      mainContentClassNames: 'container-fluid',
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    };
    this.onResize = this.onResize.bind(this);
  }

  onResize() {
    if (this.rqf) {
      return;
    }

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

  componentDidMount() {
    this.updateDimensions();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onResize, false);
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
    }
  }

  handleLangChange(value) {
    this.changeLanguage(value);
  }

  handleTheme = (newTheme) => {
    theme = createMuiTheme({
      typography: {
        useNextVariants: true,
      },
      palette: {
        type: newTheme,
      }
    });
    this.setState({ 'update': true });
  };

  changeLanguage(lang) {
    ensureIntl(lang).then(({ messages, localeData }) => {
      addLocaleData(localeData);
      this.setState({ lang, messages, locale: lang });
      this.props.actions.changeLanguage(lang, messages);
    });
  }

  getModule(user) {
    let mod;
    if (user.modules && user.modules.length)
      mod = user.modules.find(row => row.code === process.env.MODULE_NAME);

    if (!mod)
      mod = user.module;

    return mod;
  }

  render() {
    let { user, route } = this.props;
    let messages = this.state.messages;
    let locale = this.state.locale;
    let mod = this.getModule(user);

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <IntlProvider locale={locale} key={locale} messages={messages}>
          <ReduxBlockUi
            tag="div"
            block={[/_PENDING/]}
            unblock={[/_FULFILLED/, /_REJECTED/, /_AUTOCOMPLETE/]}
            loader={<CircularProgress size={80} thickness={5} color="primary" />}
            style={{ position: 'fixed', top: 0, left: 0, height: '100%', width: '100%', overflow: 'hidden' }}
          >
            {user.isAuthenticated ? (
              <Template
                user={user}
                route={route}
                module={mod}
                locale={locale}
                onChangeTheme={this.handleTheme}
                onChangeLanguage={this.handleLangChange}
              >
                {this.props.children}
              </Template>
            ) : (
                <div>
                  <BackgroundLogin /> {this.props.children}
                </div>
              )}
          </ReduxBlockUi>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authAction, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
