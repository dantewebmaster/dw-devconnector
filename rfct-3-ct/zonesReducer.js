import _ from 'lodash';
import types from '../actions/types';

let initialState = {
  data: {},
  bulkGeoStructuresResult: {},
  exportGeoStructuresResult: {
    exportedGeoStructures: [],
    exportFinished: false,
    exportCount: 0,
  },
  state: {},
  city: {},
  lists: {
    ufs: [],
    zones: [],
    cities: [],
    parentTree: [],
    geoStructures: [],
    structures: [],
    businessModels: [],
    structureTypes: [],
    geoCoverageList: [],
    searchGeoCoverageList: [],
    selectedGeoCoverageList: [],
    assignmentsGeoCoverageList: [],
    loading: false,
  },
  fields: {
    businessModel: null,
    structureType: null,
    structure: '',
    structureName: '',
    geoStructure: {},
    geoStructureSearch: '',
    geoStructureDescription: '',
    stateId: null,
    cityUid: null,
    ibgeCode: '',
    description: '',
    geoCoverageStart: '',
    geoCoverageEnd: '',
    zoneCode: 0,
    zoneUid: '',
    search: '',
    geoCoverage: '',
    searchUid: '',
    error: false,
    _id: '',
  },
};

const mergeFields = (state, payload) => {
  let updatedFields = { ...state.fields };
  let updatedLists = { ...state.lists };
  let stateInfo = { ...state.state };
  let cityInfo = { ...state.city };

  if (payload.overwrite)
    _.set(updatedFields, payload.field, payload.value);
  else
    _.merge(updatedFields, { [payload.field]: payload.value });

  if (payload.field === 'stateId') {
    const array = updatedLists.ufs.filter(item => item.stateId === payload.value);
    stateInfo = { ...array[0] };
  }
  if (payload.field === 'cityUid') {
    const array = updatedLists.cities.filter(item => item.cityUid === payload.value);
    cityInfo = { ...array[0] };
  }

  return { ...state, state: stateInfo, city: cityInfo, fields: updatedFields, lists: updatedLists };
};

const getDefaultFieldValues = (payload, state) => {
  const geoCoverageRange = payload.zonesGeoCoverage.map(item => {
    return {
      _id: item.geoCoverageStart + item.geoCoverageEnd,
      zipCodeZoneUid: item.zipCodeZoneUid,
      geoCoverageStart: item.geoCoverageStart,
      geoCoverageEnd: item.geoCoverageEnd
    };
  });

  const newState = {
    ...state,
    data: payload,
    fields: {
      ...state.fields,
      description: payload.zoneName,
      zoneCode: payload.zoneCode,
      zoneUid: payload.zoneUid,
    },
    lists: { ...state.lists, geoCoverageList: geoCoverageRange }
  }

  if (payload.statesCity) {
    newState.state = {
      stateId: payload.statesCity.stateId,
      stateName: payload.statesCity.stateName,
      stateUf: payload.statesCity.stateUf
    },
      newState.city = {
        cityUid: payload.statesCity.cityUid,
        cityId: payload.statesCity.cityId,
        cityName: payload.statesCity.cityName,
        ibgeCode: payload.statesCity.ibgeCode,
      },
      newState.fields = {
        ...newState.fields,
        stateId: payload.statesCity.stateId,
        cityUid: payload.statesCity.cityUid,
        ibgeCode: payload.statesCity.ibgeCode,
        description: payload.zoneName,
        zoneCode: (payload.zoneCode === '') ? payload.statesCity.stateUf.concat(payload.statesCity.ibgeCode || 0) : payload.zoneCode
      }
  }

  return newState;
};

const getSelectedGeoStructure = (payload, state) => {
  return {
    ...state,
    fields: {
      ...state.fields,
      geoStructure: payload,
      geoStructureSearch: `${payload.geoStructureCode} - ${payload.geoStructureDescription}`,
      geoStructureDescription: payload.geoStructureDescription
    },
  }
};

const getGeoCoverageZones = (payload, state) => {
  const geoCoverageList = payload.zonesGeoCoverage.map(item => {
    return {
      _id: item.zipCodeZoneUid,
      geoCoverageStart: item.geoCoverageStart,
      geoCoverageEnd: item.geoCoverageEnd
    };
  });

  return {
    ...state,
    lists: { ...state.lists, geoCoverageList, loading: false }
  };
};

const getGeoCoverageDistrict = (payload, state) => {
  const geoCoverageList = payload.districtGeoCoverages.map(item => {
    return {
      _id: item.zipCodeDistrictUid,
      geoCoverageStart: item.geoCoverageStart,
      geoCoverageEnd: item.geoCoverageEnd
    };
  });

  return {
    ...state,
    lists: { ...state.lists, geoCoverageList }
  };
};

const resetLists = (state, payload) => {
  let newLists = { ...state.lists };

  if (Array.isArray(payload) && payload.length > 0)
    Object.values(payload).forEach(listName => {
      newLists[listName] = initialState.lists[listName];
    });
  else if (!_.isEmpty(payload))
    newLists[payload] = initialState.lists[payload];
  else
    newLists = { ...initialState.lists };

  return newLists;
};

const addGeoCoverage = (state, payload) => {
  let geoCoverageList = [...state.lists.geoCoverageList];

  geoCoverageList.push(
    {
      ['_id']: `${payload.start}${payload.end}`,
      ['geoCoverageStart']: payload.start,
      ['geoCoverageEnd']: payload.end
    }
  );

  return {
    ...state,
    lists: { ...state.lists, geoCoverageList },
    fields: {
      ...state.fields,
      geoCoverageStart: '',
      geoCoverageEnd: '',
      _id: '',
    }
  };
};

const removeGeoCoverage = (state, payload) => {
  let ceps = state.lists.geoCoverageList;

  _.forEach(payload, function(value) {
    ceps = ceps.filter(item => (item._id !== value));
  });

  return {
    ...state,
    lists: { ...state.lists, geoCoverageList: ceps }
  };
};

const saveGeoCoverage = (state, payload) => {
  const geoCoverageList = _.cloneDeep(state.lists.geoCoverageList);
  const index = geoCoverageList.findIndex(item => (item._id === payload._id));
  geoCoverageList[index] = payload

  return { ...state, lists: { ...state.lists, geoCoverageList } };
};

const updateFieldsWithPayload = (fields, payload) => {
  return {
    ...fields,
    _id: payload._id,
    geoCoverageStart: payload.geoCoverageStart,
    geoCoverageEnd: payload.geoCoverageEnd,
  };
};

const parseExportedGeoStructures = (state, payload) => {
  const exportedGeoStructures = payload.map(item => {
    const parentTree = item.parentTree;
    return {
      regionName: (parentTree[2] || []).geoStructureDescription,
      regionCode: (parentTree[2] || []).geoStructureCode,
      departmentName: item.geoStructureDescription,
      departmentCode: item.geoStructureCode,
      provinceName: (parentTree[1] || []).geoStructureDescription,
      provinceCode: (parentTree[1] || []).geoStructureCode,
      districtName: (parentTree[0] || []).geoStructureDescription,
      districtCode: (parentTree[0] || []).geoStructureCode,
    };
  });
  return {
    ...state,
    lists: { ...state.lists, exportedGeoStructures: _.sortBy(exportedGeoStructures, ['regionCode']) },
    fields: { ...state.fields, exportInProcess: false, exportFinished: true },
  }
};

export default function zones(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case `${types.GET_ALL}_FULFILLED`:
      return {
        ...state,
        lists: { ...state.lists, zones: payload },
        fields: {
          ...state.fields,
          zoneCode: payload.length > 0 && payload[0].zone && payload[0].zone.statesCity.stateUf ?
            payload[0].zone.statesCity.stateUf.concat(payload[0].zone.statesCity.ibgeCode || 0) : state.fields.zoneCode
        }
      };
    case `${types.GET}_FULFILLED`:
      return getDefaultFieldValues(payload, state);
    case `${types.GET_SELECTED_GEO_STRUCTURE}_FULFILLED`:
      return getSelectedGeoStructure(payload[0], state);
    case `${types.GET_GEO_COVERAGE_ZONE}_PENDING`:
      return { ...state, lists: { ...state.lists, geoCoverageList: [], loading: true } };
    case `${types.GET_GEO_COVERAGE_ZONE}_FULFILLED`:
      return getGeoCoverageZones(payload, state);
    case `${types.GET_GEO_COVERAGE_DISTRICT}_FULFILLED`:
      return getGeoCoverageDistrict(payload, state);
    case types.SET_UID:
      return { ...state, fields: { ...state.fields, [payload.field]: payload.value } };
    case types.SET_FIELD:
      return mergeFields(state, payload);
    case types.ADD_GEO_COVERAGE:
      return addGeoCoverage(state, payload);
    case types.REMOVE_CEP_GEO_COVERAGE:
      return removeGeoCoverage(state, payload);
    case `${types.GET_UF}_FULFILLED`:
      return { ...state, lists: { ...state.lists, ufs: _.sortBy(payload, 'stateUf') } };
    case `${types.GET_CITIES}_FULFILLED`:
      return { ...state, lists: { ...state.lists, cities: _.sortBy(payload, 'cityName'), zones: [] } };
    case types.RESET_FIELDS:
      return { ...state, fields: { ...initialState.fields } };
    case types.RESET_FIELD_LIST_STATE:
      return {
        ...state,
        fields: { ...state.fields, search: initialState.fields.search, cityUid: initialState.fields.cityUid },
        lists: { ...state.lists, searchGeoCoverageList: initialState.lists.searchGeoCoverageList }
      };
    case types.RESET_FIELD_LIST_CITY:
      return {
        ...state,
        fields: { ...state.fields, search: initialState.fields.search },
        lists: { ...state.lists, searchGeoCoverageList: initialState.lists.searchGeoCoverageList }
      };
    case `${types.GET_BUSINESS_MODELS}_FULFILLED`:
      return { ...state, lists: { ...state.lists, businessModels: payload } };
    case `${types.GET_STRUCTURES_TYPES}_FULFILLED`:
      return { ...state, lists: { ...state.lists, structureTypes: payload.filter(i => i.hasZones) } };
    case `${types.GET_STRUCTURES}_FULFILLED`:
      return { ...state, lists: { ...state.lists, structures: payload } };
    case `${types.GET_GEO_STRUCTURES}_FULFILLED`:
      return { ...state, lists: { ...state.lists, geoStructures: payload } };

    case types.EXPORT_GEO_STRUCTURES:
      return parseExportedGeoStructures(state, payload);

    case types.EXPORT_GEO_STRUCTURES_INIT:
      return { ...state, fields: { ...state.fields, exportInProcess: true } };
    case types.EXPORT_GEO_STRUCTURES_FINISH:
      return { ...state, fields: { ...state.fields, exportInProcess: false } };

    case `${types.GET_ASSIGNMENTS_STRUCTURE}_FULFILLED`:
      return { ...state, lists: { ...state.lists, assignmentsGeoCoverageList: payload } };
    case `${types.GET_ASSIGNMENTS_GEO_COVERAGE}_FULFILLED`:
      if (state.fields.search.trim() === '' && state.fields.geoCoverage.trim === '') {
        return state
      }
      return { ...state, lists: { ...state.lists, searchGeoCoverageList: payload } };
    case types.SET_SELECTED_STRUCTURES:
      return { ...state, lists: { ...state.lists, assignmentsGeoCoverageList: payload } }
    case types.SELECTED_ASSIGNMENTS:
      return { ...state, lists: { ...state.lists, selectedGeoCoverageList: payload } };
    case types.RESET_FIELDS_CITY:
      return { ...state, fields: { ...state.fields, search: '' } };
    case types.RESET_FIELDS_SEARCH:
      return { ...state, lists: { ...state.lists, searchGeoCoverageList: initialState.lists.searchGeoCoverageList } };
    case types.UPDATE_CEP_GEO_COVERAGE:
      return { ...state, fields: updateFieldsWithPayload(state.fields, payload) };
    case types.SAVE_GEO_COVERAGE:
      return saveGeoCoverage(state, payload);
    case types.RESET_FIELDS_GEO_COVERAGE:
      return { ...state, fields: { ...state.fields, _id: '', geoCoverageStart: '', geoCoverageEnd: '' } };
    case types.RESET_LISTS:
      return { ...state, lists: resetLists(state, payload) };
    case types.RESET_ZONES:
      return {
        ...state,
        fields: {
          ...state.fields,
          stateId: initialState.fields.stateId,
          cityUid: initialState.fields.cityUid,
          search: initialState.fields.search,
          geoCoverage: initialState.fields.geoCoverage,
          geoStructureSearch: initialState.fields.geoCoverage,
          zoneCode: initialState.fields.zoneCode
        },
        lists: {
          ...state.lists,
          searchGeoCoverageList: initialState.lists.searchGeoCoverageList,
          geoStructures: initialState.lists.geoStructures
        }
      };
    case types.RESET_STRUCTURE:
      return {
        ...state,
        fields: { ...initialState.fields },
        lists: { ...state.lists, structureTypes: initialState.lists.structureTypes }
      };
    case types.RESET_FIELDS_STATE:
      return {
        ...state,
        fields: { ...state.fields, search: '', cityUid: '' },
        lists: { ...state.lists, cities: [] }
      };
    case types.BULK_GEO_STRUCTURES_INIT:
      return {
        ...state,
        bulkGeoStructuresResult: {
          processed: 0,
          created: 0,
          updated: 0,
          deleted: 0,
          failed: 0,
          cancel: false,
          pending: true,
        }
      };

    case types.BULK_GEO_STRUCTURES_CANCEL:
      return { ...state, bulkGeoStructuresResult: { ...state.bulkGeoStructuresResult, pending: false, cancel: true } };

    case types.BULK_GEO_STRUCTURES_FINISH:
      return { ...state, bulkGeoStructuresResult: { ...state.bulkGeoStructuresResult, pending: false, cancel: false } };

    case types.BULK_GEO_STRUCTURES:
      return {
        ...state,
        bulkGeoStructuresResult: {
          processed: state.bulkGeoStructuresResult.processed + payload.processed,
          created: state.bulkGeoStructuresResult.created + payload.created,
          updated: state.bulkGeoStructuresResult.updated + payload.updated,
          deleted: state.bulkGeoStructuresResult.deleted + payload.deleted,
          failed: state.bulkGeoStructuresResult.failed + payload.failed,
          cancel: state.bulkGeoStructuresResult.cancel,
          pending: state.bulkGeoStructuresResult.pending,
        }
      };
    default:
      return state;
  }
}

