import _ from 'lodash';
import types from '../actions/types';

const initialState = {
  fields: {
    personCode: '',
    personHierarchyValues: {},
    selectedPerson: null,
    currentCycle: null,
  },
  lists: {
    structureTree: [],
    structureLevels: {},
    personHistory: [],
  },
};

const getStructureLevels = (payload) => {
  return _.orderBy(payload[0].hierarchies.map(level => {
    return {
      hasPerson: level.hasPerson,
      orderLevel: level.orderLevel,
      ...level.structureLevel
    };
  }), ['orderLevel'], ['asc'])
    .reduce((obj, current) => {
      obj[current.orderLevel] = current;
      return obj;
    }, {});
};

const parsePersonStructures = (state, payload) => {
  if (Object.keys(payload).length > 0) {
    let currentCycle;
    const structures = _.orderBy(payload[0].structures, ['orderLevel'], ['asc'])
      .reduce((obj, current) => {
        obj[current.orderLevel] = {
          ...current,
          formattedStructure: `${current.structureCode} - ${current.structureName}`,
          hasPerson: state.lists.structureLevels[current.orderLevel].hasPerson || true,
        };
        if (current.hasCalendar) {
          currentCycle = current.cycles.length > 0 ? current.cycles[0] : {};
        }
        return obj;
      }, {});

    return {
      ...state,
      fields: {
        ...state.fields,
        personHierarchyValues: structures,
        selectedPerson: { ...state.fields.selectedPerson, currentCycle: currentCycle },
      },
      lists: {
        ...state.lists,
        structureTree: Object.keys(structures).reduce((array, key) => array.concat([structures[key]]), []),
      },
    };
  }
};

const mergeFields = (fields, payload) => {
  let updatedFields = _.cloneDeep(fields);
  if (payload.overwrite)
    _.set(updatedFields, payload.field, payload.value);
  else
    _.merge(updatedFields, { [payload.field]: payload.value });

  return updatedFields;
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

const parsePersonHistory = (state, payload) => {
  const parseHistoryRow = (target = {}) => ({
    originStructureLevelId: target.originStructureLevelId,
    originStructureLevelName: target.originStructureLevelName,
    originStructureCode: target.originStructureCode,
    originStructureName: target.originStructureName,
    destinationStructureLevelId: target.destinationStructureLevelId,
    destinationStructureLevelName: target.destinationStructureLevelName,
    destinationStructureCode: target.destinationStructureCode,
    destinationStructureName: target.destinationStructureName,
    startCycle: target.startCycle,
    endCycle: target.endCycle,
    startDate: target.startDate,
    endDate: target.endDate,
    createdBy: target.createdBy,
    userName: target.userName,
    status: target.status,
    ceaseDescription: target.ceaseDescription,
  });
  const groupData = (macro, target) => {
    const key = target.role.id;
    const group = macro[key];
    if (group) {
      const history = group.history.concat([parseHistoryRow(target)]);
      const gpLevelDescription = group.gpLevelDescription || target.gpLevelDescription;
      const newGroup = Object.assign({}, group, { history, gpLevelDescription });
      return Object.assign({}, macro, { [key]: newGroup });
    }
    const newGroup = {
      personCode: target.personCode,
      personId: target.personId,
      role: target.role,
      gpLevelDescription: state.fields.selectedPerson.gpLevelDescription || null,
      status: target.status,
      history: [parseHistoryRow(target)],
    };
    return Object.assign({}, macro, { [key]: newGroup });
  };

  if (Array.isArray(payload)) {
    const newHistories = payload.reverse().reduce(groupData, {});
    return {
      ...state,
      lists: {
        ...state.lists,
        personHistory: (state.personHistory || []).concat(Object.values(newHistories))
      }
    };
  }
  return { ...state };
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case `${types.FETCH_PERSON_INFORMATION}_FULFILLED`:
      return { ...state, fields: { ...state.fields, selectedPerson: { ...payload } } };

    case `${types.FETCH_PERSON_HISTORY}_FULFILLED`:
      return parsePersonHistory(state, payload);

    case `${types.FETCH_RESPONSIBLE_PERSON_HISTORY}_FULFILLED`:
      return parsePersonHistory(state, payload);

    case `${types.FETCH_HIERARCHY_LEVEL}_FULFILLED`:
      return { ...state, lists: { ...state.lists, structureLevels: getStructureLevels(payload) } };

    case `${types.FETCH_HIERARCHY_STRUCTURE}_FULFILLED`:
      return parsePersonStructures(state, payload);

    case types.SET_FIELD:
      return { ...state, fields: mergeFields(state.fields, payload) };

    case types.CLEAR_SEARCH:
      return { ...state, fields: { ...initialState.fields }, lists: { ...state.lists, personHistory: [] } };

    case types.RESET_LISTS:
      return resetLists(state, payload);

    case types.RESET_FIELDS:
      return resetFields(state, payload);

    default:
      return state;
  }
};
