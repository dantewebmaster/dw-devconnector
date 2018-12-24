import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import Typography from '@material-ui/core/Typography';
// CUSTOM COMPONENTS
import withHandlers from 'Components/HighOrderComponents/withHandlers';
import withMessages from 'Components/HighOrderComponents/withMessages';
import DownloadablesList from './views/DownloadablesList';
import NotFound from 'Components/NotFound';
import * as downloadReportsActions from './actions/downloadReportsActions';

class DownloadReports extends Component {
  state = {
    page: 0,
    rowsPerPage: 10,
  };

  componentDidMount() {
    this.handleRefreshQueue();
  }

  handleRefreshQueue = () => {
    this.setState({ page: 0 }, () => this.handleChangePage(0, 10));
  };

  handleChangePage = (page, rowsPerPage) => {
    const { actions } = this.props;
    this.setState({ page });
    const config = {
      cache: false,
      params: {
        '_limit': rowsPerPage,
        '_offset': page > 0 ? rowsPerPage * page : 0,
      },
    };
    actions.getDownloadables(config);
  };

  get handlers() {
    return {
      ...this.props.handlers,
      changePage: this.handleChangePage,
      refreshQueue: this.handleRefreshQueue,
    };
  }

  render() {
    const { downloadReports: { lists } } = this.props;

    const hasData = lists.downloadables && lists.downloadables.rows && lists.downloadables.rows.length > 0;

    return (
      <React.Fragment>
        <Typography variant="subtitle1" component="h1" style={{ padding: '0 0 1.5rem' }}>
          <FormattedMessage
            id="common.downloads"
            defaultMessage="Downloads"
            description="Rótulo comum - Downloads"
          />
        </Typography>
        {hasData ?
          <DownloadablesList
            lists={lists}
            handlers={this.handlers}
            pageList={this.state.page}
            rowsPerPage={this.state.rowsPerPage}
          /> : <NotFound
            text={<FormattedMessage
              id="message.downloads_not_found"
              defaultMessage="Não há downloads disponíveis no momento"
              description="Mensagem quando não há downloads disponíveis"
            />}
          />}
      </React.Fragment>
    );
  }
}

DownloadReports.propTypes = {
  classes: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  downloadReports: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    downloadReports: state.downloadReports
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...downloadReportsActions }, dispatch)
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withMessages,
  withHandlers,
)(DownloadReports);
