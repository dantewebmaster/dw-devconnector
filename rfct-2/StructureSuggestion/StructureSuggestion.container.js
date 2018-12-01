import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import StructureSuggestionView from './views/StructureSuggestionView';
import withHandlers from 'Components/HighOrderComponents/withHandlers';
import withMessages from 'Components/HighOrderComponents/withMessages';
import * as structureSuggestionActions from './actions/structureSuggestionActions';

class StructureSuggestion extends Component {
  componentDidMount() {
    this.props.actions.fetchFunctions();
  }

  componentDidUpdate(prevProps) {
    const { structureSuggestion: { fields: prevFields } } = prevProps;
    const { actions, handlers, structureSuggestion: { fields: thisFields }, user } = this.props;

    if (thisFields.searchText
      && thisFields.searchText !== ''
      && thisFields.searchText !== prevFields.searchText) {
      this.handleGetGeoStructureTree(thisFields.searchText);
    } else if (
      !thisFields.geoCoverageCode
      && thisFields.geoCoverageCode !== prevFields.geoCoverageCode
      && user.techParams.geoCoverageType !== '2'
      || thisFields.searchText !== prevFields.searchText && thisFields.searchText === ''
    ) {
      handlers.resetLists(['geoStructures']);
    }

    thisFields.structureCode
      && thisFields.structureCode !== prevFields.structureCode
      && thisFields.structureCode !== ''
      && actions.fetchStructureResponsible(thisFields.structureLevelId, thisFields.structureCode);
  }

  handleGetGeoStructureTree = payload => {
    const { actions } = this.props;
    let code;
    let desc;

    !isNaN(payload) ? code = parseInt(payload) : undefined;
    isNaN(payload) ? desc = payload : undefined;

    const config = {
      cache: false,
      params: {
        'geo-structure-code': code,
        'geo-structure-description': desc,
      },
    };

    actions.fetchGeoStructureTree(config);
  }

  handleGetSuggestedStructure = () => {
    const { actions, structureSuggestion: { fields, lists } } = this.props;

    actions.resetLists('suggestedStructureTree');
    actions.resetFields('structureResponsible');

    const payload = {
      'personId': fields.personId || undefined,
      'role': lists.nonLeadershipFunctions[0].role.roleId || undefined,
      'function': lists.nonLeadershipFunctions[0].functionId || undefined,
      'geoCoverageCode': fields.geoCoverageCode || fields.searchText || undefined,
      'registrantPersonCode': fields.registrantPersonCode || undefined,
      'indicativePersonCode': fields.indicativePersonCode || undefined,
      'flowType': fields.flowType || 'CT',
    };

    actions.fetchSuggestedStructure(payload);
  }

  handleClearSearch = () => {
    const { handlers } = this.props;
    handlers.resetLists(['geoStructures', 'suggestedStructureTree']);
    handlers.resetFields(['geoCoverageCode', 'suggestedStructure', 'structureResponsible', 'structureCode', 'structureLevelId']);
  };

  get handlers() {
    return {
      ...this.props.handlers,
      getSuggestedStructure: this.handleGetSuggestedStructure,
      geoCoverageType: this.handleGeoCoverageType,
      clearSearch: this.handleClearSearch,
    };
  }

  get fields() {
    const { structureSuggestion: { fields }, user: { techParams } } = this.props;
    return {
      ...fields,
      techParams
    };
  }

  render() {
    const { structureSuggestion: { lists } } = this.props;
    return (
      <StructureSuggestionView fields={this.fields} lists={lists} handlers={this.handlers} />
    );
  }
}

StructureSuggestion.propTypes = {
  structureSuggestion: PropTypes.object,
  user: PropTypes.object,
  handlers: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  structureSuggestionActions: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    structureSuggestion: state.structureSuggestion,
    techParams: state.user.techParams,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...structureSuggestionActions }, dispatch)
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers,
  withMessages,
)(StructureSuggestion);
