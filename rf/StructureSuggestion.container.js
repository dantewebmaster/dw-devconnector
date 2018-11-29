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
      && user.techParams.geoCoverageType !== '1'
    ) {
      handlers.resetLists(['structureSearchTree']);
      handlers.resetFields('personCode');
    }

    if (thisFields.suggestedStructure.structureCode && thisFields.suggestedStructure.structureCode !== prevFields.suggestedStructure.structureCode && Object.keys(thisFields.suggestedStructure).length > 0) {
      actions.fetchStructureResponsible(thisFields.suggestedStructure.structureLevelId, thisFields.suggestedStructure.structureCode);
    }
  }

  handleGetGeoStructureTree = payload => {
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

    this.props.actions.fetchGeoStructureTree(config);
  }

  handleGetSuggestedStructure = () => {
    const { actions, structureSuggestion: { fields, lists } } = this.props;

    actions.resetFields('geoCoverageCode');

    actions.resetFields('suggestedStructure');

    const payload = {
      'personId': fields.personId || undefined,
      'role': lists.nonLeadershipFunctions[0].role.roleId || undefined,
      'function': lists.nonLeadershipFunctions[0].functionId || undefined,
      // 'function': fields.personFunction || undefined,
      'geoCoverageCode': fields.geoCoverageCode || undefined,
      'registrantPersonCode': fields.registrantPersonCode || undefined,
      'indicativePersonCode': fields.indicativePersonCode || undefined,
      'flowType': fields.flowType || 'CT',
    };

    actions.fetchSuggestedStructure(payload);
  }

  handleGeoCoverageType() {
    const { user } = this.props;
    return user.techParams;
  }

  get handlers() {
    return {
      ...this.props.handlers,
      getSuggestedStructure: this.handleGetSuggestedStructure,
      geoCoverageType: this.handleGeoCoverageType,
    };
  }

  render() {
    const { structureSuggestion: { fields, lists } } = this.props;
    return (
      <StructureSuggestionView fields={fields} lists={lists} handlers={this.handlers} />
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
