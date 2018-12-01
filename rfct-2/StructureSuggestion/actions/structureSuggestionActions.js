import types from './types';
import ExternalsApi from '../../../services/externalsApi';
import RelationshipStructureApi from '../../../services/relationshipStructureApi';

export const fetchFunctions = () => dispatch => dispatch({
  type: types.FETCH_FUNCTIONS,
  payload: ExternalsApi.fetchFunctions()
});

export const fetchGeoStructureTree = payload => dispatch => dispatch({
  type: types.FETCH_GEO_STRUCTURE_TREE_ASYNC,
  payload: ExternalsApi.fetchGeoStructureTree(payload)
});

export const fetchSuggestedStructure = payload => dispatch => dispatch({
  type: types.FETCH_SUGGESTED_STRUCTURE,
  payload: ExternalsApi.fetchSuggestedStructure(payload)
});

export const fetchStructureResponsible = (structureLevelId, structureCode) => dispatch => dispatch({
  type: types.FETCH_STRUCTURE_RESPONSIBLE,
  payload: RelationshipStructureApi.findResponsibleByStructure(structureLevelId, structureCode)
});

export const setField = payload => {
  return { type: types.SET_FIELD, payload };
};

export const resetFields = payload => {
  return { type: types.RESET_FIELDS, payload };
};

export const resetLists = payload => {
  return { type: types.RESET_LISTS, payload };
};
