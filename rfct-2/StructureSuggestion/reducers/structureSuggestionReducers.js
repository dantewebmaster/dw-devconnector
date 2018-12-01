import types from '../actions/types';
import { cloneDeep, set, merge } from 'lodash';

const initialState = {
  fields: {
    searchText: null,
    geoCoverageCode: null,
    structureResponsible: null,
    structureLevelId: null,
    structureCode: null,
    registrantPersonCode: null,
    indicativePersonCode: null,
    loading: false,
  },
  lists: {
    geoStructures: [],
    suggestedStructureTree: [],
    nonLeadershipFunctions: [],
  },
};

const mergeFields = (fields, payload) => {
  let updatedFields = cloneDeep(fields);
  if (payload.overwrite)
    set(updatedFields, payload.field, payload.value);
  else
    merge(updatedFields, { [payload.field]: payload.value });
  return updatedFields;
};

const parseGeoStructureTree = (state, payload) => {
  const lastLevels = payload.filter(item => item.nextLevel.length === 0);

  const parsedGeoStructure = lastLevels.map(item => {
    let label = '';
    item.parentTree.reverse().map(parent => label = label + `${parent.geoStructureDescription} / `);
    return {
      geoCoverageCode: item.geoStructureCode.toString(),
      geoCoverageDescription: `${label + item.geoStructureCode} - ${item.geoStructureDescription}`,
    };
  });

  return {
    ...state,
    lists: { ...state.lists, geoStructures: parsedGeoStructure },
    fields: { ...state.fields, loading: false }
  };
};

const parseSuggestedStructure = (state, payload) => {
  const lastlevel = {
    structureLevelId: payload.structureLevelId,
    structureCode: payload.structureCode,
    structureLevelName: payload.structureLevelName,
    structureName: payload.structureName,
  };
  const fullStructureTree = payload.parentTree.reverse();
  fullStructureTree.push(lastlevel);

  return {
    ...state,
    fields: { ...state.fields, structureLevelId: payload.structureLevelId, structureCode: payload.structureCode },
    lists: { ...state.lists, suggestedStructureTree: fullStructureTree }
  };
};

// Reset lists 2.0
const resetLists = (state, payload) => {
  let resetedLists = null;
  // If is array, map, else pass as uniq list
  if (Array.isArray(payload)) {
    let reseted = {};
    payload.map(list => reseted[list] = initialState.lists[payload]);
    resetedLists = { ...reseted };
  } else {
    resetedLists = { [payload]: initialState.lists[payload] };
  }
  return { ...state, lists: { ...state.lists, ...resetedLists } };
};

// Reset fields 2.0
const resetFields = (state, payload) => {
  let resetedFields = null;
  // If is array, map, else pass as uniq list
  if (Array.isArray(payload)) {
    let reseted = {};
    payload.map(field => reseted[field] = initialState.fields[payload]);
    resetedFields = { ...reseted };
  } else {
    resetedFields = { [payload]: initialState.fields[payload] };
  }
  return { ...state, fields: { ...state.fields, ...resetedFields } };
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case `${types.FETCH_FUNCTIONS}_FULFILLED`:
      return { ...state, lists: { ...state.lists, nonLeadershipFunctions: payload.nonLeadership } };

    case `${types.FETCH_GEO_STRUCTURE_TREE_ASYNC}_FULFILLED`:
      return parseGeoStructureTree(state, payload);

    case `${types.FETCH_GEO_STRUCTURE_TREE_ASYNC}_PENDING`:
      return { ...state, fields: { ...state.fields, loading: true } };

    case `${types.FETCH_SUGGESTED_STRUCTURE}_FULFILLED`:
      return parseSuggestedStructure(state, payload);

    case `${types.FETCH_STRUCTURE_RESPONSIBLE}_FULFILLED`:
      return { ...state, fields: { ...state.fields, structureResponsible: payload } };

    case types.SET_FIELD:
      return { ...state, fields: mergeFields(state.fields, payload) };

    case types.RESET_LISTS:
      return resetLists(state, payload);

    case types.RESET_FIELDS:
      return resetFields(state, payload);

    default:
      return state;
  }
};
