import { set, merge, cloneDeep } from 'lodash';

export const resetFields = (state, payload, initialState) => {
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

export const resetLists = (state, payload, initialState) => {
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

export const mergeFields = (fields, payload) => {
  let updatedFields = cloneDeep(fields);
  if (payload.overwrite)
    set(updatedFields, payload.field, payload.value);
  else
    merge(updatedFields, { [payload.field]: payload.value });
  return updatedFields;
};
