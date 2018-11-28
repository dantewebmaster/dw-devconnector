
const createRequest = require('../helpers/createRequest');

const CONTROLLER_NAME = 'external';

const ExternalBO = require('../core/businessOperation/ExternalBO');

module.exports = {

  /** --- GET ------------------------------------------- */
  getBusinessModels: createRequest(CONTROLLER_NAME, 'getBusinessModel', ExternalBO),

  getBusinessModelActive: createRequest(CONTROLLER_NAME, 'getBusinessModelActive', ExternalBO),

  getFunctions: createRequest(CONTROLLER_NAME, 'getFunctions', ExternalBO),

  // getStructureByCycle: mockStructureByCycle,
  getStructureByCycle: createRequest(CONTROLLER_NAME, 'getStructureByCycle', ExternalBO),

  getCycleByYear: createRequest(CONTROLLER_NAME, 'getCycleByYear', ExternalBO),

  getOperacionalCycles: createRequest(CONTROLLER_NAME, 'getOperacionalCycles', ExternalBO),

  getOperacionalCyclesAll: createRequest(CONTROLLER_NAME, 'getOperacionalCyclesAll', ExternalBO),

  getCyclesFromStructures: createRequest(CONTROLLER_NAME, 'getCyclesFromStructures', ExternalBO),

  getStructureChildren: createRequest(CONTROLLER_NAME, 'getStructureChildren', ExternalBO),

  getStructureAll: createRequest(CONTROLLER_NAME, 'getStructureAll', ExternalBO),

  getHierarchy: createRequest(CONTROLLER_NAME, 'getHierarchy', ExternalBO),

  getStructureConsultant: createRequest(CONTROLLER_NAME, 'getStructureConsultant', ExternalBO),

  getGeoCoverageFromStructure: createRequest(CONTROLLER_NAME, 'getGeoCoverageFromStructure', ExternalBO),

  getStructureEndCycle: createRequest(CONTROLLER_NAME, 'getStructureEndCycle', ExternalBO),

  disableStructure: createRequest(CONTROLLER_NAME, 'disableStructure', ExternalBO),

  getGeoStructureTree: createRequest(CONTROLLER_NAME, 'getGeoStructureTree', ExternalBO),

  getStructuresAssignments: createRequest(CONTROLLER_NAME, 'getStructuresAssignments', ExternalBO),
};
