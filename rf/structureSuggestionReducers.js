import types from '../actions/types';
import * as parsers from './structureSuggestionParsers';
import { resetFields, resetLists, mergeFields } from 'Utils/reducersUtils';

const initialState = {
  fields: {
    searchText: null,
    geoCoverageCode: null,
    suggestedStructure: {},
    structureResponsible: {},
    registrantPersonCode: null,
    indicativePersonCode: null,
  },
  lists: {
    geoStructures: [],
    nonLeadershipFunctions: [],
  },
};

const parseSuggestedStructure = (state, payload) => {
  return { ...state, fields: { ...state.fields, suggestedStructure: payload } };
};

const parseStructureResponsible = (state, payload) => {
  return { ...state, fields: { ...state.fields, structureResponsible: payload } };
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.SET_FIELD:
      return { ...state, fields: mergeFields(state.fields, payload) };

    case `${types.FETCH_FUNCTIONS}_FULFILLED`:
      return { ...state, lists: { ...state.lists, nonLeadershipFunctions: payload.nonLeadership } };

    case `${types.FETCH_GEO_STRUCTURE_TREE}_FULFILLED`:
      return { ...state, lists: { ...state.lists, geoStructures: parsers.parseGeoStructureTree(payload) } };

    case `${types.FETCH_SUGGESTED_STRUCTURE}_FULFILLED`:
      return parseSuggestedStructure(state, payload);

    case `${types.FETCH_STRUCTURE_RESPONSIBLE}_FULFILLED`:
      return parseStructureResponsible(state, payload);

    case types.RESET_LISTS:
      return resetLists(state, payload, initialState);

    case types.RESET_FIELDS:
      return resetFields(state, payload, initialState);

    default:
      return state;
  }
};
