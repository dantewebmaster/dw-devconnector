import _ from 'lodash';
import types from '../actions/types';

const initialState = {
  selectedPerson: {},
  structureLevels: {},
  originValues: {},
  destinationValues: {},
  scheduledRequests: {},
  origin: {},
  destination: {},
  personCode: '',
  currentCycle: null,
  cancelModal: {
    title: 'modal.confirmCancel.title',
    desc: 'modal.confirmCancel.desc',
    titleDefault: 'Cancelamento de movimentação',
    descDefault: 'Deseja confirmar o cancelamento do agendamento?',
    open: false,
    scheduleUid: ''
  },
  getCycleModal: {
    title: 'modal.confirmSchedule.title',
    desc: 'modal.confirmSchedule.desc',
    titleDefault: 'Agendamento de movimentação',
    descDefault: 'Deseja confirmar o agendamento?',
    open: false,
    destinationCycle: ''
  },
  fields: {
    schedulingByStructureOriginValues: {},
    schedulingByStructureDestinationValues: {},
    schedulingByStructureQueryType: 0,
    schedulingByGpLevel: '0',
    schedulingByStructureSelectedCycle: '',
    schedulingByStructureSelectedPeople: [],
    reason: '',
    selectCycle: '',

    originStructureLevelId: null,
    originStructureCode: null,
    destStructureLevelId: null,
    destStructureCode: null,

    resetFields: false,
  },
  lists: {
    schedulingByStructureCycles: null,
    structuresByParent: null,
    structuresByOrder: null,
    peopleByStructure: null,
    bulkScheduleQueue: null,
    bulkScheduleLog: null,
    cycles: [],
    structures: [],
    originStructures: [],
    destStructures: [],
    plansLevels: [
      {
        "planId": 1,
        "planName": "CN",
        "idLevel": "bf89b2e0-ad0e-11e8-955c-f1334fb12b1b",
        "levelName": "PLATINO",
        "indexId": 1,
        "indexName": "RECEITA BRUTA",
        "revenueValue": "0.00",
        "sequence": 0
      },
      {
        "planId": 1,
        "planName": "CN",
        "idLevel": "18913660-ad32-11e8-afbd-af74ca8a81ca",
        "levelName": "DIAMANTE",
        "indexId": 1,
        "indexName": "RECEITA BRUTA",
        "revenueValue": "10.00",
        "sequence": 1
      },
      {
        "planId": 1,
        "planName": "CN",
        "idLevel": "998a9e34-f30d-11e8-8eb2-f2801f1b9fd1",
        "levelName": "LATAO",
        "indexId": 1,
        "indexName": "RECEITA BRUTA",
        "revenueValue": "50.00",
        "sequence": 2
      },
      {
        "planId": 1,
        "planName": "CN",
        "idLevel": "2209b5a0-b6ce-11e8-bcc5-91b8b7d6e790",
        "levelName": "ZAFIRO",
        "indexId": 1,
        "indexName": "RECEITA BRUTA",
        "revenueValue": "100.00",
        "sequence": 3
      },
      {
        "planId": 1,
        "planName": "CN",
        "idLevel": "17b8c505-8c4a-4b14-913d-436ae6fc4281",
        "levelName": "DIAMANTE 2",
        "indexId": 1,
        "indexName": "RECEITA BRUTA",
        "revenueValue": "300.00",
        "sequence": 4
      },
      {
        "planId": 1,
        "planName": "CN",
        "idLevel": "472028d0-fd49-11e8-8443-552a1aa11433",
        "levelName": "TESTANDO_TESTANDO",
        "indexId": 1,
        "indexName": "RECEITA BRUTA",
        "revenueValue": "123456.00",
        "sequence": 5
      }
    ],
  },
};

const parsePersonStructures = (state, payload) => {
  let currentCycle;
  const structures = _.orderBy(Object.keys(payload).length > 0 && payload[0].structures, ['orderLevel'], ['asc'])
    .reduce((obj, current) => {
      obj[current.orderLevel] = {
        ...current,
        formattedStructure: `${current.structureCode} - ${current.structureName}`,
        hasPerson: state.structureLevels[current.orderLevel].hasPerson || false
      };
      if (current.hasCalendar) {
        currentCycle = current.cycles.length > 0 ? current.cycles[0] : {};
      }
      return obj;
    }, {});

  const lowestLevel = findLowestLevelStructure(structures);

  return {
    ...state,
    originValues: structures,
    destinationValues: {},
    origin: lowestLevel,
    destination: {},
    selectedPerson: {
      ...state.selectedPerson,
      currentCycle: currentCycle,
    },

    lists: {
      ...state.lists,
      structures: [],
      originStructures: [],
      destStructures: [],
    }
  };
};

const parsePersonDestStructures = (state, payload) => {
  let currentCycle;
  const structures = _.orderBy(Object.keys(payload).length > 0 && payload[0].structures, ['orderLevel'], ['asc'])
    .reduce((obj, current) => {
      obj[current.orderLevel] = {
        ...current,
        formattedStructure: `${current.structureCode} - ${current.structureName}`,
        hasPerson: state.structureLevels[current.orderLevel].hasPerson || false
      };
      if (current.hasCalendar) {
        currentCycle = current.cycles.length > 0 ? current.cycles[0] : {};
      }
      return obj;
    }, {});

  const lowestLevel = findLowestLevelStructure(structures);

  return {
    ...state,
    destinationValues: structures,
    destination: lowestLevel,
    selectedPerson: {
      ...state.selectedPerson,
      currentCycle: currentCycle,
    },

    lists: {
      ...state.lists,
      structures: [],
      originStructures: [],
      destStructures: [],
    }
  };
};

const findLowestLevelStructure = values => {
  const list = Object.keys(values).map(key => values[key])
    .filter(current => current.structureCode && current.structureCode !== '');

  return list.length > 0 ? list[list.length - 1] : null;
};

const mergeFields = (fields, payload) => {
  let updatedFields = _.cloneDeep(fields);
  if (payload.overwrite)
    _.set(updatedFields, payload.field, payload.value);
  else
    _.merge(updatedFields, { [payload.field]: payload.value });

  return updatedFields;
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  let filler;
  switch (type) {
    case types.SET_FIELD:
      return { ...state, fields: mergeFields(state.fields, payload) };

    case types.CLEAR_FIELD:
      return { ...state, fields: { ...state.fields, [payload]: '' } };

    case types.RESET_FIELDS:
      return { ...state, fields: { ...initialState.fields } };

    case `${types.FETCH_PERSON_INFORMATION}_FULFILLED`:
      return { ...state, selectedPerson: payload };

    case `${types.FETCH_PERSON_STATUSES}_FULFILLED`:
      [filler] = payload;
      return { ...state, selectedPerson: { multiRoles: payload.length > 1, ...filler } };

    case `${types.FETCH_HIERARCHY_LEVEL}_FULFILLED`:
      return {
        ...state,
        structureLevels: _.orderBy(payload[0].hierarchies.map(level => {
          return {
            hasPerson: level.hasPerson,
            orderLevel: level.orderLevel,
            ...level.structureLevel
          };
        }), ['orderLevel'], ['asc'])
          .reduce((obj, current) => {
            obj[current.orderLevel] = current;
            return obj;
          }, {})
      };

    case `${types.FETCH_HIERARCHY_STRUCTURE}_FULFILLED`:
      return parsePersonStructures(state, payload);

    case `${types.FETCH_DEST_HIERARCHY_STRUCTURE}_FULFILLED`:
      return parsePersonDestStructures(state, payload);

    case `${types.FETCH_SCHEDULED_REQUESTS_BY_PERSON}_FULFILLED`:
      return {
        ...state,
        scheduledRequests: action.payload.reduce((obj, current) => {
          obj[current.schedulingUid] = current;
          return obj;
        }, {})
      };

    case `${types.FETCH_PEOPLE_BY_STRUCTURE}_PENDING`:
      return {
        ...state,
        lists: {
          ...state.lists,
          peopleByStructure: initialState.lists.peopleByStructure,
          structures: [],
          originStructures: [],
          destStructures: [],
        }
      };
    case `${types.FETCH_PEOPLE_BY_STRUCTURE}_FULFILLED`:
      return { ...state, lists: { ...state.lists, peopleByStructure: _.orderBy(payload, 'name', 'asc') } };

    case `${types.CANCEL_SCHEDULE}_FULFILLED`:
      return { ...state, scheduledRequests: _.omit(...state.scheduledRequests, [payload]) };

    case `${types.VALIDATE_SCHEDULE}_FULFILLED`:
      return {
        ...state,
        getCycleModal: {
          ...state.getCycleModal,
          values: payload,
          open: true,
          desc: 'message.VALIDATE_CYCLE',
        },
      };

    case `${types.CREATE_SCHEDULE}_PENDING`:
      return { ...state, getCycleModal: { ...state.getCycleModal, open: false } };
    case `${types.CREATE_SCHEDULE}_FULFILLED`:
      return { ...state, newSchedule: payload };

    case types.CHANGE_DESTINATION_STRUCTURE:
      if (_.has(payload, 'key') && _.has(payload, 'value'))
        return {
          ...state,
          destination: findLowestLevelStructure(payload),
          fields: { ...state.fields, [payload.key]: payload.value },
        };
      else
        return { ...state, destination: findLowestLevelStructure(payload), destinationValues: payload };

    case types.CLEAR_SCHEDULE:
      return {
        ...state,
        selectedPerson: {},
        originValues: {},
        destinationValues: {},
        origin: {},
        destination: {},
        getCycleModal: { ...initialState.getCycleModal },
        cancelModal: { ...initialState.cancelModal },
        fields: { ...initialState.fields },
        lists: { ...state.lists, peopleByStructure: null },
      };

    case types.CLEAR_STRUCTURE_SCHEDULING:
      return {
        ...state,
        originValues: {},
        destinationValues: {},
        fields: { ...initialState.fields, resetFields: true },
        lists: {
          ...state.lists,
          peopleByStructure: null,
          structures: [],
          originStructures: [],
          destStructures: [],
        },
      };

    case types.CLEAR_DIALOGS:
      return {
        ...state,
        getCycleModal: { ...initialState.getCycleModal },
        cancelModal: { ...initialState.cancelModal },
      };

    case `${types.FETCH_BULK_SCHEDULE_QUEUE}_FULFILLED`:
      return { ...state, lists: { ...state.lists, bulkScheduleQueue: payload } };

    case `${types.FETCH_BULK_SCHEDULE_LOG}_FULFILLED`:
      return { ...state, lists: { ...state.lists, bulkScheduleLog: payload } };

    case `${types.CANCEL_BULK_SCHEDULE}_FULFILLED`:
      return {
        ...state,
        lists: {
          ...state.lists,
          bulkScheduleQueue: initialState.lists.bulkScheduleQueue,
          bulkScheduleLog: initialState.lists.bulkScheduleLog,
        }
      };

    case types.CLEAR_LIST:
      return { ...state, lists: { ...state.lists, [payload]: [] } };

    case types.CLEAR_ORIGIN_STRUCTURE:
      return { ...state, originValues: {} };
    case types.CLEAR_DEST_STRUCTURE:
      return { ...state, destinationValues: {} };

    case `${types.SEARCH_STRUCTURE}_FULFILLED`:
      return {
        ...state,
        lists: { ...state.lists, structures: payload },
        fields: { ...state.fields, resetFields: false }
      };
    case `${types.SEARCH_STRUCTURE_ORIGIN}_FULFILLED`:
      return {
        ...state,
        lists: { ...state.lists, originStructures: payload },
        fields: { ...state.fields, resetFields: false }
      };
    case `${types.SEARCH_STRUCTURE_DEST}_FULFILLED`:
      return {
        ...state,
        lists: { ...state.lists, destStructures: payload },
        fields: { ...state.fields, resetFields: false }
      };

    case `${types.GET_PLANS_LEVELS}_FULFILLED`:
      return {
        ...state,
        lists: { ...state.lists, plansLevels: payload.cns }
      };

    default:
      return state;
  }
};
