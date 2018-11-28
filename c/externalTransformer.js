const transformHierarchy = (hierarchyList, groupRoles) =>
  hierarchyList.map((hierarchyModel) => {
    const result = {
      businessModel: {
        businessModelId: hierarchyModel.businessModelId,
        businessModelName: hierarchyModel.businessModelName,
      },
      hierarchies: [],
    };
    hierarchyModel.Hierarchies = hierarchyModel.Hierarchies
      .sort((a, b) => a.hierarchyId > b.hierarchyId);
    hierarchyModel.Hierarchies.map((hierarchy) => {
      const item = {
        orderLevel: hierarchy.orderLevel,
        hasPerson: hierarchy.hasPerson,
        hasCalendar: hierarchy.hasCalendar,
        hasZones: hierarchy.hasZones,
        structureLevel: hierarchy.StructureLevel,
      };
      if (!groupRoles) {
        item.functions = hierarchy.Functions.map(functionObj => ({
          functionId: functionObj.functionId,
          functionName: functionObj.functionName,
          role: functionObj.Role,
        }));
      } else {
        item.roles = [];
        hierarchy.Functions.map((functionObj) => {
          let role = item.roles.find(r => r.roleId === functionObj.Role.roleId);
          if (!role) {
            role = {
              roleId: functionObj.Role.roleId,
              roleName: functionObj.Role.roleName,
              functions: [],
            };
            item.roles.push(role);
          }
          role.functions.push({
            functionId: functionObj.functionId,
            functionName: functionObj.functionName,
          });
        });
      }

      result.hierarchies.push(item);
    });
    return result;
  });

const transformBusinessModel = (businessModelList, groupRoles) =>
  businessModelList.map((businessModel) => {
    const item = {
      businessModelId: businessModel.businessModelId,
      businessModelName: businessModel.businessModelName,
      country: businessModel.CountryCompany.Country,
      company: businessModel.CountryCompany.Company,
      status: businessModel.statusId,
    };
    if (!groupRoles) {
      item.functions = businessModel.Functions.map(functionObj => ({
        functionId: functionObj.functionId,
        functionName: functionObj.functionName,
        role: functionObj.Role,
      }));
    } else {
      item.roles = [];
      businessModel.Functions.map((functionObj) => {
        let role = item.roles.find(r => r.roleId === functionObj.Role.roleId);
        if (!role) {
          role = {
            roleId: functionObj.Role.roleId,
            roleName: functionObj.Role.roleName,
            functions: [],
          };
          item.roles.push(role);
        }
        role.functions.push({
          functionId: functionObj.functionId,
          functionName: functionObj.functionName,
        });
      });
    }
    return item;
  });

const transformStructureConsultant = structuresRet =>
  structuresRet.structures.map((structure) => {
    const item = {
      structureLevelId: structure.structureLevelId,
      structureCode: structure.structureCode,
      structureName: structure.structureName,
      parentStructureLevelId: structure.parentStructureLevelId,
      parentStructureCode: structure.parentStructureCode,
      maxPeople: null,
      weight: null,
      hasNextLevel: structuresRet.nextLevel !== null,
      functions: [],
    };
    if (structure.StructureParameter) {
      item.maxPeople = structure.StructureParameter.weightMax;
      item.weight = structure.StructureParameter.weight;
    }
    if (structure.Hierarchy.Functions) {
      structure.Hierarchy.Functions.map((f) => {
        const xFunction = {
          functionId: f.functionId,
          functionName: f.functionName,
          role: f.Role,
        };
        item.functions.push(xFunction);
      });
    }
    return item;
  });

const transformGeoCoverageFromStructure = geoCoverageRet =>
  geoCoverageRet.map((geoCoverage) => {
    const item = {
      zipCodeStart: geoCoverage.geoCoverageStart,
      zipCodeEnd: geoCoverage.geoCoverageEnd,
    };
    return item;
  });

const transformOperacionalCycles = (cycleGroupRet) => {
  const result = [];
  cycleGroupRet.map((cycleGroup) => {
    let cycle = result.find(c => c.cycleCode === cycleGroup.Cycle.cycleCode);
    const index = result.findIndex(c => c.cycleCode === cycleGroup.Cycle.cycleCode);
    if (!cycle) {
      cycle = {
        cycleCode: cycleGroup.Cycle.cycleCode,
        cycleBeginDate: cycleGroup.dateStart,
        cycleEndDate: cycleGroup.dateEnd,
      };
      result.push(cycle);
    } else {
      if (cycle.cycleBeginDate > cycleGroup.dateStart) {
        result[index].cycleBeginDate = cycleGroup.dateStart;
      }
      if (cycle.cycleEndDate < cycleGroup.dateEnd) {
        result[index].cycleEndDate = cycleGroup.dateEnd;
      }
    }
  });
  result.map((cycle) => {
    let active = false;
    const now = new Date();
    const beginDate = new Date(cycle.cycleBeginDate);
    const endDate = new Date(cycle.cycleEndDate);
    if (beginDate <= now && endDate >= now) {
      active = true;
    }
    cycle.active = active;
    return cycle;
  });
  return result.sort((a, b) => a.cycleCode > b.cycleCode);
};

const transformOperacionalCyclesAll = (cycleRet) => {
  const result = [];
  cycleRet.map((cycle) => {
    const cycleResp = {
      cycleCode: cycle.cycleCode,
      dateStart: cycle.dateStart,
      dateEnd: cycle.dateEnd,
    };
    result.push(cycleResp);
  });
  result.map((cycle) => {
    let active = false;
    const now = new Date();
    const beginDate = new Date(cycle.dateStart);
    const endDate = new Date(cycle.dateEnd);
    if (beginDate <= now && endDate >= now) {
      active = true;
    }
    cycle.active = active;
    return cycle;
  });
  return result.sort((a, b) => a.cycleCode > b.cycleCode);
};

const transformStructureEndCycle = (structures) => {
  const result = [];
  structures.map((s) => {
    const structure = {
      structureLevelId: s.structure_level,
      structureLevelName: s.structure_level_name,
      structureCode: s.structure_code,
      structureName: s.structure_name,
      parentStructureLevelId: s.parent_structure_level,
      parentStructureLevelName: s.parent_structure_level_name,
      parentStructureCode: s.parent_structure_code,
      parentStructureName: s.parent_structure_name,
      cycle: s.cycle,
    };
    result.push(structure);
  });
  return result;
};

const transformStructureAll = (structures) => {
  const result = [];
  structures.map((s) => {
    const structure = {
      structureLevelId: s.Hierarchy.StructureLevel.structureLevelId,
      structureLevelName: s.Hierarchy.StructureLevel.structureLevelName,
      structureCode: s.structureCode,
      structureName: s.structureName,
      parentStructureLevelId: (s.Hierarchy.StructureLevelParent || {}).structureLevelId,
      parentStructureLevelName: (s.Hierarchy.StructureLevelParent || {}).structureLevelName,
      parentStructureCode: (s.StructureParent || {}).structureCode,
      parentStructureName: (s.StructureParent || {}).structureName,
    };
    result.push(structure);
  });
  return result;
};

const transformStructureByCycle = (structures) => {
  const result = [];
  structures.map((s) => {
    const structure = {
      structureLevelId: s.structure_level,
      structureLevelName: s.structure_level_name,
      structureCode: s.structure_code,
      structureName: s.structure_name,
      parentStructureLevelId: (s.parent_structure_level || undefined),
      parentStructureLevelName: (s.parent_structure_level_name || undefined),
      parentStructureCode: (s.parent_structure_code || undefined),
      parentStructureName: (s.parent_structure_name || undefined),
    };
    result.push(structure);
  });
  return result;
};

const transformFunctions = (functions, groupRoles) =>
  functions.map((item) => {
    const result = {};
    if (!groupRoles) {
      result.functions = item.Functions.map(functionObj => ({
        functionId: functionObj.functionId,
        functionName: functionObj.functionName,
        role: functionObj.Role,
      }));
    } else {
      result.roles = [];
      item.Functions.map((functionObj) => {
        let role = result.roles.find(r => r.roleId === functionObj.Role.roleId);
        if (!role) {
          role = {
            roleId: functionObj.Role.roleId,
            roleName: functionObj.Role.roleName,
            functions: [],
          };
          result.roles.push(role);
        }
        role.functions.push({
          functionId: functionObj.functionId,
          functionName: functionObj.functionName,
        });
      });
    }
    return result;
  });

module.exports = {
  transformHierarchy,
  transformBusinessModel,
  transformStructureConsultant,
  transformGeoCoverageFromStructure,
  transformOperacionalCycles,
  transformStructureEndCycle,
  transformStructureAll,
  transformStructureByCycle,
  transformOperacionalCyclesAll,
  transformFunctions,
};
