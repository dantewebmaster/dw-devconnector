import types from './types';
import ZonesApi from './zonesApi';

export const resetFields = () => (dispatch) => dispatch({
  type: types.RESET_FIELDS
});

export const resetStructure = () => (dispatch) => dispatch({
  type: types.RESET_STRUCTURE
});

export const resetZone = () => (dispatch) => dispatch({
  type: types.RESET_ZONES
});

export const resetFieldListSearch = () => (dispatch) => dispatch({
  type: types.RESET_FIELDS_SEARCH
});

export const resetFieldListState = () => (dispatch) => dispatch({
  type: types.RESET_FIELD_LIST_STATE
});

export const resetFieldListCity = () => (dispatch) => dispatch({
  type: types.RESET_FIELD_LIST_CITY
});

export const getAll = (params) => (dispatch) => dispatch({
  type: types.GET_ALL,
  payload: ZonesApi.getAll(params)
});

export const getZone = (uuid) => (dispatch) => dispatch({
  type: types.GET,
  payload: ZonesApi.getZone(uuid)
});

export const getSelectedGeoStructure = (config) => (dispatch) => dispatch({
  type: types.GET_SELECTED_GEO_STRUCTURE,
  payload: ZonesApi.getGeoStructures(config)
});


export const getGeoCoverageZone = (uuid) => (dispatch) => dispatch({
  type: types.GET_GEO_COVERAGE_ZONE,
  payload: ZonesApi.getZone(uuid)
});

export const getGeoCoverageDistrict = (uuid) => (dispatch) => dispatch({
  type: types.GET_GEO_COVERAGE_DISTRICT,
  payload: ZonesApi.getDistrict(uuid)
});

export const postZone = (zones) => (dispatch) => dispatch({
  type: types.POST,
  payload: ZonesApi.postZone(zones)
});

export const patchZone = (zones) => (dispatch) => dispatch({
  type: types.PATCH,
  payload: ZonesApi.patchZone(zones)
});

export const setField = (payload) => (dispatch) => dispatch({
  type: types.SET_FIELD,
  payload,
});

export const addGeoCoverage = (start, end) => (dispatch) => dispatch({
  type: types.ADD_GEO_COVERAGE,
  payload: { start, end }
});

export const removeGeoCoverage = (ids) => (dispatch) => dispatch({
  type: types.REMOVE_CEP_GEO_COVERAGE,
  payload: ids
});

export const updateGeoCoverage = (payload) => (dispatch) => dispatch({
  type: types.UPDATE_CEP_GEO_COVERAGE,
  payload,
});

export const saveGeoCoverage = (payload) => (dispatch) => dispatch({
  type: types.SAVE_GEO_COVERAGE,
  payload
});

export const getUfs = () => (dispatch) => dispatch({
  type: types.GET_UF,
  payload: ZonesApi.getUfs()
});

export const getCities = (uf) => (dispatch) => dispatch({
  type: types.GET_CITIES,
  payload: ZonesApi.getCities(uf)
});

export const deleteZone = (uuid) => (dispatch) => dispatch({
  type: types.DELETE_ZONE,
  payload: ZonesApi.deleteZone(uuid)
});

export const getBusinessModels = () => (dispatch) => dispatch({
  type: types.GET_BUSINESS_MODELS,
  payload: ZonesApi.getBusinessModels()
});

export const getStructureLevels = (businessModelUid) => (dispatch) => dispatch({
  type: types.GET_STRUCTURES_TYPES,
  payload: ZonesApi.getStructureLevels(businessModelUid)
});

export const getStructures = (businessModelId, config) => (dispatch) => dispatch({
  type: types.GET_STRUCTURES,
  payload: ZonesApi.getStructures(businessModelId, config)
});

export const getGeoStructures = (config) => (dispatch) => dispatch({
  type: types.GET_GEO_STRUCTURES,
  payload: ZonesApi.getGeoStructures(config)
});

export const setSelectedStructures = (payload) => (dispatch) => dispatch({
  type: types.SET_SELECTED_STRUCTURES,
  payload
});

export const selectAssigments = (payload) => (dispatch) => dispatch({
  type: types.SELECTED_ASSIGNMENTS,
  payload
});

export const getAssignmentsStructure = (uuid, actualList, geoCoverageList) => (dispatch) => dispatch({
  type: types.GET_ASSIGNMENTS_STRUCTURE,
  payload: ZonesApi.getAssignmentsStructure(uuid, actualList, geoCoverageList)
});

export const getAssignmentsGeoCoverage = (config) => (dispatch) => dispatch({
  type: types.GET_ASSIGNMENTS_GEO_COVERAGE,
  payload: ZonesApi.getAssignmentsGeoCoverage(config)
});

export const setAssignments = (uuid, payload) => (dispatch) => dispatch({
  type: types.SET_ASSIGNMENTS,
  payload: ZonesApi.setAssignments(uuid, payload)
});

export const setUid = (field, value) => (dispatch) => dispatch({
  type: types.SET_UID,
  payload: { field, value }
});

export const resetFieldsState = () => (dispatch) => dispatch({
  type: types.RESET_FIELDS_STATE
});

export const resetFieldsCity = () => (dispatch) => dispatch({
  type: types.RESET_FIELDS_CITY
});

export const resetLists = (listName) => (dispatch) => dispatch({
  type: types.RESET_LISTS,
  payload: listName || null
});

export const resetFieldsGeoCoverage = () => (dispatch) => dispatch({
  type: types.RESET_FIELDS_GEO_COVERAGE
});

export const bulkGeoStructure = (payload) => async (dispatch) => dispatch({
  type: types.BULK_GEO_STRUCTURES,
  payload: await ZonesApi.bulkGeoStructure(payload)
});

export const bulkGeoStructureInit = (payload) => (dispatch) => dispatch({
  type: types.BULK_GEO_STRUCTURES_INIT,
  payload
});
export const bulkGeoStructureFinish = (payload) => (dispatch) => dispatch({
  type: types.BULK_GEO_STRUCTURES_FINISH,
  payload
});
export const bulkGeoStructureCancel = (payload) => (dispatch) => dispatch({
  type: types.BULK_GEO_STRUCTURES_CANCEL,
  payload
});

// Export geo structures
export const exportGeoStructuresInit = () => (dispatch) => dispatch({
  type: types.EXPORT_GEO_STRUCTURES_INIT
});
export const exportGeoStructures = (config) => async (dispatch) => dispatch({
  type: types.EXPORT_GEO_STRUCTURES,
  payload: await ZonesApi.exportGeoStructures(config)
});
export const exportGeoStructuresCancel = () => {
  return ZonesApi.cancelExportGeoStructures();
};
export const exportGeoStructuresFinish = () => (dispatch) => dispatch({
  type: types.EXPORT_GEO_STRUCTURES_FINISH,
});
