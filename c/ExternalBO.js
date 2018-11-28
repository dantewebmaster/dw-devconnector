const logger = require('../../helpers/logger');
const ExternalRepository = require('../repositories/ExternalRepository');
const externalTransformer = require('../../helpers/transformers/externalTransformer');
const countryTranformer = require('../../helpers/transformers/countryTransformer');
const { Exception, errorDefinitions } = require('../../helpers/errors');
const statusEnum = require('../../helpers/enums/statusEnum');
const validations = require('../../helpers/validations');

const Dependency = {
  ExternalRepository,
  externalTransformer,
  countryTranformer,
};

class ExternalBO {
  constructor(params) {
    this.externalRepository = new Dependency.ExternalRepository();
    // set param for general use
    this.params = params;
    // set options general options
    const businessModelId = (params['business-model-id'] ? params['business-model-id'] : params.businessModelId);
    this.options = {
      countryId: Dependency.countryTranformer.transformCountryCode(params.country.value),
      companyId: params.company.value,
      userId: (params['user-id'] || {}).value,
      businessModelId: (businessModelId || {}).value,
      limit: (params._limit || { _limit: 200 }).value, // eslint-disable-line no-underscore-dangle
      offset: (params._offset || { _offset: 0 }).value, // eslint-disable-line no-underscore-dangle
    };
  }

  async getBusinessModel() {
    logger.debug('ExternalBO.getBusinessModel');
    const groupRoles = (this.params['group-roles'] || {}).value;
    const criteria = {
      countryId: this.options.countryId,
      functionId: (this.params['function-id'] || {}).value,
      roleId: (this.params['role-id'] || {}).value,
      businessModelName: (this.params['business-model-name'] || {}).value,
      businessModelId: (this.params['business-model-id'] || {}).value,
    };
    const data = await this.externalRepository.getBusinessModel(criteria, this.options);
    return Dependency.externalTransformer.transformBusinessModel(data, groupRoles);
  }

  async getBusinessModelActive() {
    logger.debug('ExternalBO.getBusinessModelActive');
    const groupRoles = (this.params['group-roles'] || {}).value;
    const criteria = {
      countryId: this.options.countryId,
      functionId: (this.params['function-id'] || {}).value,
      roleId: (this.params['role-id'] || {}).value,
      status: statusEnum.MODELO_COMERCIAL.ATIVO,
      businessModelName: (this.params['business-model-name'] || {}).value,
      businessModelId: (this.params['business-model-id'] || {}).value,
    };
    const data = await this.externalRepository.getBusinessModel(criteria, this.options);
    return Dependency.externalTransformer.transformBusinessModel(data, groupRoles);
  }

  getCyclesFromStructures() {
    logger.debug('ExternalBO.getCyclesFromStructures');
    const criteria = {
      structureLevelId: this.params['structure-level-id'].value,
      structureCode: this.params['structure-code'].value,
      qtyCycles: this.params['qty-cycles'].value,
      retrieveLevelCycles: this.params['retrieve-level-cycles'].value,
      dateStart: this.params['cycles-date-start'].originalValue,
    };
    return this.externalRepository.getCyclesFromStructures(criteria, this.options);
  }

  async getStructureChildren() {
    logger.debug('ExternalBO.getStructureChild');
    const parentStructureLevelId = (this.params.parentStructureLevelId || {}).value;
    const parentStructureCode = (this.params.parentStructureCode || {}).value;
    const parentStructureCodeArray = (this.params.parentStructureCodeArray || {}).value;
    const orderLevel = (this.params.orderLevel || {}).value;
    if (!parentStructureLevelId && !parentStructureCode &&
      !parentStructureCodeArray && orderLevel === undefined) {
      Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER,
        values: { '#INPUT': 'parentStructureLevelId and parentStructureCode or parentStructureCodeArray or orderLevel must have a value' },
      });
    }

    if ((!orderLevel || orderLevel) &&
      ((!parentStructureLevelId && (parentStructureCode || parentStructureCodeArray)) ||
        (parentStructureLevelId && (!parentStructureCode && !parentStructureCodeArray)))) {
      Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER,
        values: { '#INPUT': 'parentStructureLevelId and parentStructureCode or parentStructureCodeArray must have a value' },
      });
    }

    if (!this.params.structureName && !this.params.structureCode) {
      Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER,
        values: { '#INPUT': 'structureName or structureCode must have a value' },
      });
    }

    const criteria = {
      orderLevel,
      parentStructureCode,
      parentStructureLevelId,
      parentStructureCodeArray,
      countryId: this.options.countryId,
      structureName: (this.params.structureName || {}).value,
      structureCode: (this.params.structureCode || {}).value,
    };

    const data = await this.externalRepository.getStructureChildren(criteria, this.options);
    return data;
  }

  async getHierarchy() {
    const data = await this.externalRepository.getHierarchy(this.options);
    const groupRoles = (this.params['group-roles'] || {}).value;
    return Dependency.externalTransformer
      .transformHierarchy(data, groupRoles);
  }

  async getStructureConsultant() {
    logger.debug('ExternalBO.getStructureConsultant');
    const geoCoverage = (this.params['zip-code'] || {}).value || (this.params['geo-coverage'] || {}).value;
    const parentStructureLevelId = (this.params['parent-structure-level-id'] || {}).value;
    const parentStructureCode = (this.params['parent-structure-code'] || {}).value;
    const filterStructureCode = (this.params['filter-structure-code'] || {}).value;
    if (!geoCoverage && !parentStructureCode && !parentStructureLevelId) {
      Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER,
        values: { '#INPUT': 'structureLevelId and structureCode or zipCode/geoCoverage must have a value' },
      });
    }

    if (((!geoCoverage || geoCoverage) && !parentStructureCode && parentStructureLevelId) ||
      ((!geoCoverage || geoCoverage) && parentStructureCode && !parentStructureLevelId)) {
      Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER,
        values: { '#INPUT': 'structureLevelId and structureCode must have a value' },
      });
    }
    const criteria = {
      parentStructureLevelId,
      parentStructureCode,
      geoCoverage,
    };
    let data = await this.externalRepository.getStructureConsultant(criteria, this.options);
    data = Dependency.externalTransformer.transformStructureConsultant(data);
    if (filterStructureCode) {
      data = data.filter(i => i.structureCode === filterStructureCode);
    }
    return data;
  }

  async getGeoCoverageFromStructure() {
    logger.debug('ExternalBO.getGeoCoverageFromStructure');
    const structureLevelId = (this.params['structure-level-id'] || {}).value;
    const structureCode = (this.params['structure-code'] || {}).value;
    const criteria = {
      structureLevelId,
      structureCode,
    };
    const data = await this.externalRepository.getGeoCoverageFromStructure(criteria, this.options);
    return Dependency.externalTransformer.transformGeoCoverageFromStructure(data);
  }

  async getOperacionalCycles() {
    logger.debug('ExternalBO.getOperacionalCycles');
    const dateStart = (this.params['date-start'] || {}).originalValue;
    const dateEnd = (this.params['date-end'] || {}).originalValue;
    const criteria = {
      dateStart,
      dateEnd,
    };
    const data = await this.externalRepository.getOperacionalCycles(criteria, this.options);
    return Dependency.externalTransformer.transformOperacionalCycles(data);
  }

  async getOperacionalCyclesAll() {
    logger.debug('ExternalBO.getOperacionalCyclesAll');
    const dateStart = (this.params['date-start'] || {}).originalValue;
    const dateEnd = (this.params['date-end'] || {}).originalValue;
    const criteria = {
      dateStart,
      dateEnd,
    };
    const data = await this.externalRepository.getOperacionalCyclesAll(criteria, this.options);
    // return data;
    return Dependency.externalTransformer.transformOperacionalCyclesAll(data);
  }

  disableStructure() {
    logger.debug('ExternalBO.disableStructure');
    const structureLevelId = this.params.structureLevelId.value;
    const structureCode = this.params.structureCode.value;
    return this.externalRepository
      .disableStructure({
        structureLevelId,
        structureCode,
        options: { ...this.options, country: this.params.country.value },
      });
  }

  async getStructureEndCycle() {
    logger.debug('ExternalBO.getStructureEndCycle');
    const dateEnd = this.params.date.originalValue;
    const data = await this.externalRepository
      .getStructureEndCycle({
        dateEnd,
      }, this.options);
    return {
      count: parseInt(data.count, 10),
      rows: Dependency.externalTransformer.transformStructureEndCycle(data.rows),
    };
  }

  async getCycleByYear() {
    logger.debug('ExternalBO.getCycleByYear');
    const yearStart = this.params['year-start'].value;
    const yearEnd = this.params['year-end'].value;
    const structureLevelId = this.params['structure-level-id'].value;
    const structureCode = this.params['structure-code'].value;
    const cycleCode = this.params['cycle-code'].value;
    if ((yearStart && yearEnd === undefined) ||
      (yearStart === undefined && yearEnd)) {
      Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER,
        values: { '#INPUT': 'yearStart and yearEnd must have a value' },
      });
    }
    if (yearStart > yearEnd) {
      Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER,
        values: { '#INPUT': 'yearStart must be less than yearEnd' },
      });
    }
    if ((structureLevelId && structureCode === undefined) ||
      (structureLevelId === undefined && structureCode)) {
      Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER,
        values: { '#INPUT': 'structureLevelId and structureCode must have a value' },
      });
    }
    const criteria = {
      structureLevelId,
      structureCode,
      yearStart,
      yearEnd,
      cycleCode,
    };
    const data = await this.externalRepository.getCycleByYear(criteria, this.options);
    return data;
  }

  async getStructureAll() {
    logger.debug('ExternalBO.getStructureAll');
    const structureLevelId = this.params['structure-level-id'].value;
    const orderLevel = this.params['order-level'].value;
    if ((structureLevelId === undefined && orderLevel === undefined)
      || (structureLevelId !== undefined && orderLevel !== undefined)) {
      Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER,
        values: { '#INPUT': 'structureLevelId or orderLevel must have a value' },
      });
    }
    const criteria = {
      structureLevelId,
      orderLevel,
    };
    const data = await this.externalRepository.getStructureAll(criteria, this.options);
    return Dependency.externalTransformer.transformStructureAll(data);
  }

  async getStructureByCycle() {
    logger.debug('ExternalBO.getStructureByCycle');
    const structureLevelId = this.params['structure-level-id'].value;
    const orderLevel = this.params['order-level'].value;
    const cycleCode = this.params['cycle-code'].value;
    const cycleCodeStart = this.params['cycle-code-start'].value;
    const cycleCodeEnd = this.params['cycle-code-end'].value;
    const dateStart = this.params['date-start'].originalValue;
    const dateEnd = this.params['date-end'].originalValue;
    if (structureLevelId !== undefined && orderLevel !== undefined) {
      Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER,
        values: { '#INPUT': 'structureLevelId or orderLevel must have a value' },
      });
    }

    if ((cycleCodeStart === undefined && cycleCodeEnd !== undefined)
      || (cycleCodeStart !== undefined && cycleCodeEnd === undefined)) {
      Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER,
        values: { '#INPUT': 'cycleCodeStart and cycleCodeEnd must have a value' },
      });
    }

    if ((dateStart === undefined && dateEnd !== undefined)
      || (dateStart !== undefined && dateEnd === undefined)) {
      Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER,
        values: { '#INPUT': 'dateStart and dateEnd must have a value' },
      });
    }

    const criteria = {
      structureLevelId,
      orderLevel,
      cycleCode,
      cycleCodeStart,
      cycleCodeEnd,
      dateStart,
      dateEnd,
    };
    const data = await this.externalRepository.getStructureByCycle(criteria, this.options);
    return Dependency.externalTransformer.transformStructureByCycle(data);
  }

  async getGeoStructureTree() {
    const geoStructureCode = this.params['geo-structure-code'].value;
    const geoStructureDescription = this.params['geo-structure-description'].value;

    const data = await this.externalRepository.getGeoStructureTree({
      geoStructureDescription, geoStructureCode,
    });

    return data;
  }

  async getFunctions() {
    logger.debug('ExternalBO.getFunctions');
    const groupRoles = (this.params['group-roles'] || {}).value;
    const data = await this.externalRepository.getFunctions(this.options);
    return Dependency.externalTransformer.transformFunctions(data, groupRoles);
  }

  async getStructuresAssignments() {
    const cityUid = this.params['city-uid'].value;
    const geoCoverage = (this.params['geo-coverage'] || {}).value;
    const description = (this.params.description || {}).value;
    const geoCoverageType = (this.params.geoCoverageType || {}).value;
    if (geoCoverageType === '1') {
      if (cityUid) {
        validations.isUUID(cityUid, 'cityUid');
      }
    }
    if (cityUid === undefined && geoCoverage === undefined && description === undefined) {
      Exception.raise({
        ...errorDefinitions.BAD_REQUEST_PARAMETER,
        values: { '#INPUT': 'cityUid, geoCoverage or description must have a value' },
      });
    }
    return this.externalRepository.getStructuresAssignments({
      cityUid, geoCoverage, description, geoCoverageType,
    });
  }
}

module.exports = ExternalBO;
