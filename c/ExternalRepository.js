const uuid = require('uuid/v1');
const logger = require('../../helpers/logger');
const models = require('../models');
const statusEnum = require('../../helpers/enums/statusEnum');
const { Exception, errorDefinitions } = require('../../helpers/errors');
const brmService = require('../services/BRMService');
const moment = require('moment');

const db = models.sequelize;
const { Op } = models.sequelize;


const {
  Structure, BusinessModel, Hierarchy, StructureLevel, Country, CountryCompany,
  StructureParent, Functions, Roles, Company, Zones, District, GeoCoverageZones,
  GeoCoverageDistrict, StructureParameter, OperationalCycle, CycleGroup, Cycle,
  HierarchyFunction, StructureLevelParent, GeoStructureParent, StatesCity, StructureZones,
  StructureDistrict,
} = models;

class ExternalRepository {
  getBusinessModel({
    countryId,
    businessModelName,
    status,
    functionId,
    roleId,
    businessModelId,
  }) {
    logger.debug('ExternalRepository.get');

    const andBusinessModel = [];
    const andFunctions = [];
    const andRoles = [];
    let reqFunction = false;

    andBusinessModel.push({ countryId });

    if (businessModelName) {
      andBusinessModel.push({ businessModelName: { [Op.iLike]: `%${businessModelName}%` } });
    }
    if (status !== undefined) {
      andBusinessModel.push({ statusId: status });
    }
    if (functionId) {
      andFunctions.push({ functionId });
      reqFunction = true;
    }
    if (roleId) {
      andRoles.push({ roleId });
      reqFunction = true;
    }
    if (businessModelId) {
      andBusinessModel.push({ businessModelId });
    }
    return BusinessModel.findAll({
      where: { [Op.and]: andBusinessModel },
      include: [
        {
          model: CountryCompany,
          required: true,
          include: [
            {
              attributes: ['countryId', 'countryName'],
              model: Country,
              required: true,
            },
            {
              attributes: ['companyId', 'companyName'],
              model: Company,
              required: true,
            },
          ],
        },
        {
          model: Functions,
          required: reqFunction,
          attributes: ['functionId', 'functionName'],
          where: { [Op.and]: andFunctions },
          include: [
            {
              required: true,
              model: Roles,
              where: { [Op.and]: andRoles },
            },
          ],
        },
      ],
      order: [
        ['business_model', 'ASC'],
      ],
    });
  }

  getHierarchy(options) {
    logger.debug('ExternalRepository.getHierarchy');

    const andHierarchy = [];
    const andBusinessModel = [];

    andHierarchy.push({
      countryId: options.countryId,
      status: statusEnum.HIERARQUIA.ATIVO,
    });

    andBusinessModel.push({
      countryId: options.countryId,
    });

    andBusinessModel.push({
      status: statusEnum.MODELO_COMERCIAL.ATIVO,
    });

    if (options.businessModelId) {
      andBusinessModel.push({
        businessModelId: options.businessModelId,
      });
    }


    return BusinessModel.findAll({
      where: { [Op.and]: andBusinessModel },
      attributes: [
        'businessModelId',
        'businessModelName',
      ],
      include: [
        {
          required: false,
          model: Hierarchy,
          where: { [Op.and]: andHierarchy },
          include: [
            {
              model: Functions,
              through: HierarchyFunction,
              include: Roles,
            },
            {
              required: true,
              model: StructureLevel,
              attributes: [
                'structureLevelId',
                'structureLevelName',
              ],
            },
          ],
        },
        {
          required: true,
          model: CountryCompany,
          include: [{ model: Country, required: true }],
        },
      ],
      order: [
        [{ model: Hierarchy }, 'hierarchyId', 'ASC'],
        [{ model: Hierarchy }, 'orderLevel', 'ASC'],
      ],
    });
  }

  async getCyclesFromStructures({
    structureLevelId,
    structureCode,
    qtyCycles,
    retrieveLevelCycles,
    dateStart,
  }, options) {
    logger.debug('ExternalRepository.getCyclesFromStructures');
    const result = [];

    const getStructures = await this.getStructureOne({
      structureLevelId,
      structureCode,
    }, options);
    await Promise.all(getStructures.rows.map(async (structure) => {
      const itemResult = [];
      const itemStructure = await this
        .makeStructureResponse(structure, qtyCycles, retrieveLevelCycles, dateStart, options);
      itemResult.push(itemStructure);
      let parent = structure.StructureParent;
      if (parent && parent !== {}) {
        do {
          // eslint-disable-next-line no-await-in-loop
          const getParent = await this.getStructureOne({
            structureLevelId: parent.structureLevelId,
            structureCode: parent.structureCode,
          }, options);
          if (getParent && getParent !== {}) {
            const itemStructureParent = await this
              .makeStructureResponse(getParent.rows[0], qtyCycles, false, dateStart, options);
            itemResult.push(itemStructureParent);
          }
          parent = getParent.rows[0].StructureParent;
        } while (parent && parent !== {});
      }
      result.push({
        input: {
          structureLevelId,
          structureCode,
        },
        structures: itemResult,
      });
    }));
    return result;
  }

  async makeStructureResponse(structure, qtyCycles, retrieveLevelCycles, dateStart, options) {
    const response = {
      orderLevel: structure.Hierarchy.orderLevel,
      hasPerson: structure.Hierarchy.hasPerson,
      hasCalendar: structure.Hierarchy.hasCalendar,
      hasZones: structure.Hierarchy.hasZones,
      structureLevelId: structure.Hierarchy.StructureLevel.structureLevelId,
      structureLevelName: structure.Hierarchy.StructureLevel.structureLevelName,
      structureCode: structure.structureCode,
      structureName: structure.structureName,
      parentStructureLevelId: structure.parentStructureLevelId,
      parentStructureCode: structure.parentStructureCode,
      cycles: [],
    };
    if (structure.StructureParameter) {
      response.maxPeople = structure.StructureParameter.weightMax;
      response.weight = structure.StructureParameter.weight;
    }
    if ((retrieveLevelCycles && qtyCycles && qtyCycles > 0) ||
      (structure.Hierarchy.hasCalendar && qtyCycles && qtyCycles > 0)) {
      const cycles = await this.getOperacionalCycle({
        countryId: structure.countryId,
        structureLevelId: structure.structureLevelId,
        structureCode: structure.structureCode,
        dateStart,
      }, qtyCycles, options);
      response.cycles = cycles;
    }
    return response;
  }

  getOperacionalCycle({
    countryId,
    structureLevelId,
    structureCode,
    dateStart,
  }, qtyCycles, options) {
    logger.debug('ExternalRepository.getOperacionalCycle');
    const andCycle = [];
    const orDate = [];
    if (countryId) {
      andCycle.push({ countryId });
    }
    if (structureLevelId) {
      andCycle.push({ structureLevelId });
    }
    if (options.businessModelId) {
      andCycle.push({
        businessModelId: options.businessModelId,
      });
    }
    if (options.companyId) {
      andCycle.push({
        companyId: options.companyId,
      });
    }
    if (structureCode) {
      andCycle.push({ structureCode });
    }
    if (dateStart) {
      orDate.push({
        [Op.or]: [
          { dateStart: { [Op.gte]: dateStart } },
          {
            [Op.and]: [
              { dateEnd: { [Op.gte]: dateStart } },
              { dateStart: { [Op.lte]: dateStart } },
            ],
          },
        ]
        ,
      });
    } else {
      orDate.push({
        dateEnd: { [Op.gte]: new Date() },
      });
    }
    andCycle.push({
      [Op.or]: orDate,
    });
    return OperationalCycle.findAll({
      limit: qtyCycles,
      attributes: [
        'cycleCode',
        'dateStart',
        'dateEnd',
      ],
      offset: 0,
      where: { [Op.and]: andCycle },
      order: [
        ['cycleCode', 'ASC'],
      ],
    });
  }

  getStructureOne({ structureLevelId, structureCode }, options) {
    const andStructure = [];
    const andCompany = [];
    const andHierarchy = [];
    const andStructureParameter = [];
    if (structureLevelId) {
      andStructure.push({ structureLevelId });
    }
    if (structureCode) {
      andStructure.push({ structureCode });
    }

    andStructure.push({ countryId: options.countryId });
    andStructure.push({
      flagDeprecated: false,
    });
    andStructure.push({ businessModelId: options.businessModelId });
    andHierarchy.push({
      status: statusEnum.HIERARQUIA.ATIVO,
    });
    if (options.companyId) {
      andCompany.push({
        companyId: options.companyId,
      });
    }
    andStructureParameter.push({
      blockFlag: { [Op.not]: true },
    });
    return Structure.findAndCountAll({
      where: { [Op.and]: andStructure },
      include: [
        {
          model: Hierarchy,
          required: true,
          where: andHierarchy,
          include: [
            {
              model: StructureLevel,
              required: true,
            },
            {
              model: BusinessModel,
              attributes: [],
              required: true,
              include: [
                {
                  model: CountryCompany,
                  attributes: [],
                  required: true,
                  include: [
                    {
                      model: Company,
                      attributes: [],
                      required: true,
                      where: { [Op.and]: andCompany },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          required: false,
          model: StructureParameter,
          where: { [Op.and]: andStructureParameter },
        },
        {
          model: StructureParent,
          required: false,
        },
      ],
    });
  }

  getStructureAll({
    structureLevelId,
    orderLevel,
  }, options) {
    logger.debug('ExternalRepository.getStructureAll');
    const andStructure = [];
    const andHierarchy = [];
    const andCompany = [];
    const andBusinessModel = [];
    if (structureLevelId !== undefined) {
      andStructure.push({
        structureLevelId: { [Op.in]: structureLevelId },
      });
    }
    if (orderLevel !== undefined) {
      andHierarchy.push({
        orderLevel: { [Op.in]: orderLevel },
      });
    }
    andCompany.push({
      companyId: options.companyId,
    });
    andBusinessModel.push({
      businessModelId: options.businessModelId,
    });
    andStructure.push({
      countryId: options.countryId,
    });
    andStructure.push({
      flagDeprecated: { [Op.not]: true },
    });
    andStructure.push({ status: statusEnum.ESTRUTURA.ATIVO });
    andHierarchy.push({
      status: statusEnum.HIERARQUIA.ATIVO,
    });
    return Structure.findAll({
      where: { [Op.and]: andStructure },
      attributes: [
        'structureCode',
        'structureName',
      ],
      include: [
        {
          model: Hierarchy,
          attributes: ['orderLevel'],
          required: true,
          where: { [Op.and]: andHierarchy },
          include: [
            {
              model: BusinessModel,
              required: true,
              attributes: [],
              where: { [Op.and]: andBusinessModel },
              include: [
                {
                  model: CountryCompany,
                  attributes: [],
                  required: true,
                  include: [
                    {
                      model: Company,
                      attributes: [],
                      required: true,
                      where: { [Op.and]: andCompany },
                    },
                  ],
                },
              ],
            },
            {
              model: StructureLevel,
              required: true,
              attributes: [
                'structureLevelId',
                'structureLevelName',
              ],
            },
            {
              model: StructureLevelParent,
              required: false,
              attributes: [
                'structureLevelId',
                'structureLevelName',
              ],
            },
          ],
        },
        {
          model: StructureParent,
          required: false,
          attributes: [
            'structureCode',
            'structureName',
          ],
        },
      ],
    });
  }

  getStructureChildren({
    countryId,
    parentStructureLevelId,
    parentStructureCode,
    parentStructureCodeArray,
    orderLevel,
    structureName,
    structureCode,
  }, options) {
    logger.debug('ExternalRepository.getStructureChildren');
    const andStructureModel = [];
    const andHierarchy = [];
    const andCompany = [];

    andStructureModel.push({ countryId });
    andStructureModel.push({ businessModelId: options.businessModelId });
    andHierarchy.push({
      status: statusEnum.HIERARQUIA.ATIVO,
    });

    if (structureName) {
      if (structureName.match(/\D/) === null) {
        const orWhere = [];
        orWhere.push({
          structureCode: { [Op.eq]: structureName },
        });
        orWhere.push({
          structureName: { [Op.iLike]: `%${structureName}%` },
        });
        andStructureModel.push({ [Op.or]: orWhere });
      } else {
        andStructureModel.push({ structureName: { [Op.iLike]: `%${structureName}%` } });
      }
    }

    if (structureCode) {
      const orWhere = [];
      orWhere.push({
        structureCode: { [Op.eq]: structureCode },
      });
      orWhere.push({
        structureName: { [Op.iLike]: `%${structureCode}%` },
      });
      andStructureModel.push({ [Op.or]: orWhere });
    }

    if (parentStructureLevelId) {
      andStructureModel.push({
        parentStructureLevelId,
      });
    }

    if (parentStructureCode) {
      andStructureModel.push({
        parentStructureCode,
      });
    }

    if (orderLevel !== undefined) {
      andHierarchy.push({
        order_level: orderLevel,
      });
    }

    andCompany.push({
      companyId: options.companyId,
    });

    andStructureModel.push({ status: statusEnum.ESTRUTURA.ATIVO });

    andStructureModel.push({
      flagDeprecated: { [Op.not]: true },
    });

    if (parentStructureCodeArray) {
      andStructureModel.push({
        parentStructureCode: { [Op.in]: parentStructureCodeArray.map(i => i) },
      });
    }

    return Structure.findAll({
      limit: options.limit,
      offset: options.offset,
      attributes: [
        'structureCode',
        'structureLevelId',
        'structureName',
      ],
      where: { [Op.and]: andStructureModel },
      order: [['structureName', 'ASC']],
      include: [
        {
          required: true,
          model: Hierarchy,
          attributes: [],
          where: andHierarchy,
          include: [
            {
              model: BusinessModel,
              attributes: [],
              required: true,
              include: [
                {
                  model: CountryCompany,
                  attributes: [],
                  required: true,
                  include: [
                    {
                      model: Company,
                      attributes: [],
                      required: true,
                      where: { [Op.and]: andCompany },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async getStructureConsultant({
    parentStructureLevelId,
    parentStructureCode,
    geoCoverage,
  }, options) {
    logger.debug('ExternalRepository.getStructureConsultant');
    // get da hierarquia
    const [getHierarchy] = await this.getHierarchy(options);
    const hierarchy = getHierarchy.Hierarchies;
    let structures = null;
    let level = null;
    let nextLevel = null;
    // verificar se sera consultado por cep ou parent
    if (geoCoverage) {
      // -- fazer o find da hierarquia com cep (level)
      level = hierarchy.find(h => h.hasZones);
      nextLevel = hierarchy.find(h => h.hasPerson && h.orderLevel > level.orderLevel);
      if (level) {
        // -- fazer o get
        structures = await this.getStructureGeoCoverage({ geoCoverage }, level, options);
      } else {
        structures = [];
      }
    } else {
      // -- faz o get no children
      structures = await this.getStructureChildrenNoLimit({
        countryId: options.countryId,
        parentStructureLevelId,
        parentStructureCode,
      }, options);
      if (structures.length) {
        // -- fazer o find da hierarquia com a hierarquia do get (level)
        level = hierarchy.find(h => h.orderLevel === structures[0].Hierarchy.orderLevel);
      }
    }
    if (structures.length > 0) {
      // if level hasPerson -> se true, retorna as estruturas
      if (!level.hasPerson) {
        for (let i = 0; i < hierarchy.length; i += 1) {
          // if hierarquia.order > level.order
          if (hierarchy[i].orderLevel > level.orderLevel) {
            // executa o get children
            // Lint disabled for business propouse
            structures = await this.getManyStructuresChildren(structures, options); // eslint-disable-line
            // if maroto do hasPerson -> se true, retorna as estruturas
            if (hierarchy[i].hasPerson) break;
          }
        }
      }
    }
    // map maroto da hierarquia

    return {
      nextLevel,
      structures,
    };
  }

  async getManyStructuresChildren(structures, options) {
    logger.debug('ExternalRepository.getManyStructuresChildren');
    const result = [];
    await Promise.all(structures.map(async (structure) => {
      const structuresChildren = await this.getStructureChildrenNoLimit({
        countryId: structure.countryId,
        parentStructureLevelId: structure.structureLevelId,
        parentStructureCode: structure.structureCode,
      }, options);
      Promise.all(structuresChildren.map((structureChild) => {
        result.push(structureChild);
      }));
    }));
    return result;
  }

  getStructureChildrenNoLimit({
    countryId,
    parentStructureLevelId,
    parentStructureCode,
  }, options) {
    logger.debug('ExternalRepository.getStructureChildrenNoLimit');
    const andStructureModel = [];
    const andHierarchy = [];
    const andStructureParameter = [];
    const andCompany = [];

    andStructureModel.push({ countryId });
    andStructureModel.push({ businessModelId: options.businessModelId });

    if (parentStructureLevelId) {
      andStructureModel.push({
        parentStructureLevelId,
      });
    }

    if (parentStructureCode) {
      andStructureModel.push({
        parentStructureCode,
      });
    }

    andCompany.push({
      companyId: options.companyId,
    });

    andStructureModel.push({ status: statusEnum.ESTRUTURA.ATIVO });

    andStructureModel.push({
      flagDeprecated: { [Op.not]: true },
    });

    andStructureParameter.push({
      blockFlag: { [Op.not]: true },
    });

    return Structure.findAll({
      attributes: [
        'countryId',
        'structureLevelId',
        'structureCode',
        'structureName',
        'parentStructureLevelId',
        'parentStructureCode',
      ],
      where: { [Op.and]: andStructureModel },
      include: [
        {
          required: true,
          model: Hierarchy,
          where: andHierarchy,
          include: [
            {
              model: Functions,
              required: false,
              include: [
                {
                  model: Roles,
                  required: true,
                },
              ],
            },
            {
              model: BusinessModel,
              attributes: [],
              required: true,
              include: [
                {
                  model: CountryCompany,
                  attributes: [],
                  required: true,
                  include: [
                    {
                      model: Company,
                      attributes: [],
                      required: true,
                      where: { [Op.and]: andCompany },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          required: false,
          model: StructureParameter,
          where: { [Op.and]: andStructureParameter },
        },
      ],
    });
  }

  async getStructureGeoCoverage({ geoCoverage }, level, options) {
    logger.debug('ExternalRepository.getStructureGeoCoverage');
    const StructureZonesList = await this.getStructureGeoCoverageZone(
      { geoCoverage },
      level,
      options,
    );
    const StructureDistrictList = await this.getStructureGeoCoverageDistrict(
      { geoCoverage },
      level,
      options,
    );
    const structuresMap = new Map();
    const structures = [];
    StructureZonesList.map((structure) => {
      structuresMap.set(
        structure.structureUid,
        structure,
      );
    });
    StructureDistrictList.map((structure) => {
      structuresMap.set(
        structure.structureUid,
        structure,
      );
    });
    structuresMap.forEach(value => structures.push(value));
    return structures;
  }

  getStructureGeoCoverageZone({ geoCoverage }, level, options) {
    logger.debug('ExternalRepository.getStructureGeoCoverageZone');
    const andStructure = [];
    const andHierarchy = [];
    const andZone = [];
    const andStructureParameter = [];
    const andCompany = [];

    if (geoCoverage) {
      andZone.push({
        geo_coverage_nr_start: { [Op.lte]: parseInt(geoCoverage, 10) },
      });
      andZone.push({
        geo_coverage_nr_end: { [Op.gte]: parseInt(geoCoverage, 10) },
      });
    }

    andHierarchy.push({
      order_level: level.orderLevel,
      status: statusEnum.HIERARQUIA.ATIVO,
    });

    andStructure.push({ businessModelId: options.businessModelId });

    andStructure.push({ status: statusEnum.ESTRUTURA.ATIVO });

    andStructure.push({
      flagDeprecated: { [Op.not]: true },
    });

    andStructureParameter.push({
      blockFlag: { [Op.not]: true },
    });

    andCompany.push({
      companyId: options.companyId,
    });

    return Structure.findAll({
      attributes: [
        'structureUid',
        'countryId',
        'structureLevelId',
        'structureCode',
        'structureName',
        'parentStructureLevelId',
        'parentStructureCode',
      ],
      where: { [Op.and]: andStructure },
      include: [
        {
          required: true,
          model: Hierarchy,
          where: andHierarchy,
          include: [
            {
              model: Functions,
              required: false,
              include: [
                {
                  model: Roles,
                  required: true,
                },
              ],
            },
            {
              model: BusinessModel,
              attributes: [],
              required: true,
              include: [
                {
                  model: CountryCompany,
                  attributes: [],
                  required: true,
                  include: [
                    {
                      model: Company,
                      attributes: [],
                      required: true,
                      where: { [Op.and]: andCompany },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          required: true,
          model: Zones,
          attributes: [],
          include: [
            {
              model: GeoCoverageZones,
              attributes: [],
              required: true,
              where: andZone,
            },
          ],
        },
        {
          required: false,
          model: StructureParameter,
          where: { [Op.and]: andStructureParameter },
        },
      ],
    });
  }

  getStructureGeoCoverageDistrict({ geoCoverage }, level, options) {
    logger.debug('ExternalRepository.getStructureGeoCoverageDistrict');
    const andStructure = [];
    const andHierarchy = [];
    const andDistrict = [];
    const andStructureParameter = [];
    const andCompany = [];

    if (geoCoverage) {
      andDistrict.push({
        geo_coverage_nr_start: { [Op.lte]: parseInt(geoCoverage, 10) },
      });
      andDistrict.push({
        geo_coverage_nr_end: { [Op.gte]: parseInt(geoCoverage, 10) },
      });
    }

    andHierarchy.push({
      order_level: level.orderLevel,
      status: statusEnum.HIERARQUIA.ATIVO,
    });

    andStructure.push({ businessModelId: options.businessModelId });

    andStructure.push({ status: statusEnum.ESTRUTURA.ATIVO });

    andStructure.push({
      flagDeprecated: { [Op.not]: true },
    });

    andStructureParameter.push({
      blockFlag: { [Op.not]: true },
    });

    andCompany.push({
      companyId: options.companyId,
    });

    return Structure.findAll({
      attributes: [
        'structureUid',
        'countryId',
        'structureLevelId',
        'structureCode',
        'structureName',
        'parentStructureLevelId',
        'parentStructureCode',
      ],
      where: { [Op.and]: andStructure },
      include: [
        {
          required: true,
          model: Hierarchy,
          where: andHierarchy,
          include: [
            {
              model: Functions,
              required: false,
              include: [
                {
                  model: Roles,
                  required: true,
                },
              ],
            },
            {
              model: BusinessModel,
              attributes: [],
              required: true,
              include: [
                {
                  model: CountryCompany,
                  attributes: [],
                  required: true,
                  include: [
                    {
                      model: Company,
                      attributes: [],
                      required: true,
                      where: { [Op.and]: andCompany },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          required: true,
          model: District,
          attributes: [],
          include: [
            {
              model: GeoCoverageDistrict,
              required: true,
              attributes: [],
              where: andDistrict,
            },
          ],
        },
        {
          required: false,
          model: StructureParameter,
          where: { [Op.and]: andStructureParameter },
        },
      ],
    });
  }

  async getGeoCoverageFromStructure({ structureLevelId, structureCode }, options) {
    logger.debug('ExternalRepository.getGeoCoverageFromStructure');
    const [getHierarchy] = await this.getHierarchy(options);
    const hierarchy = getHierarchy.Hierarchies;
    const levelZone = hierarchy.find(h => h.hasZones);
    let structureRow = await this.getStructureOne({ structureLevelId, structureCode }, options);
    if (structureRow.count === 0) {
      return [];
    }
    let [structure] = structureRow.rows;
    if (levelZone.orderLevel !== structure.Hierarchy.orderLevel) {
      for (let i = hierarchy.length; i > 0; i -= 1) {
        if (hierarchy[i - 1].orderLevel < levelZone.orderLevel) {
          structureRow = await this.getStructureOne({
            structureLevelId: structure.parentStructureLevelId,
            structureCode: structure.parentStructureCode,
          }, options);
          [structure] = structureRow.rows;
          if (structure.Hierarchy.hasZones) break;
        }
      }
    }

    const district = await this.getGeoCoverageFromStructureDistrict({
      structureLevelId: structure.structureLevelId,
      structureCode: structure.structureCode,
    }, options);

    const zones = await this.getGeoCoverageFromStructureZones({
      structureLevelId: structure.structureLevelId,
      structureCode: structure.structureCode,
    }, options);

    const geoCoverageMap = new Map();
    const geoCoverage = [];
    district.map((districtMap) => {
      geoCoverageMap.set(
        districtMap.zipCodeDistrictUid,
        districtMap,
      );
    });
    zones.map((zone) => {
      geoCoverageMap.set(
        zone.zipCodeZoneUid,
        zone,
      );
    });
    geoCoverageMap.forEach(value => geoCoverage.push(value));
    return geoCoverage;
  }

  getGeoCoverageFromStructureDistrict({ structureLevelId, structureCode }, options) {
    logger.debug('ExternalRepository.getGeoCoverageFromStructureDistrict');
    const andStructure = [];
    if (structureLevelId) {
      andStructure.push({ structureLevelId });
    }
    if (structureCode) {
      andStructure.push({ structureCode });
    }
    andStructure.push({ businessModelId: options.businessModelId });

    andStructure.push({ status: statusEnum.ESTRUTURA.ATIVO });

    andStructure.push({
      flagDeprecated: { [Op.not]: true },
    });
    return GeoCoverageDistrict.findAll({
      include: [
        {
          model: District,
          required: true,
          include: [
            {
              model: Structure,
              required: true,
              where: { [Op.and]: andStructure },
            },
          ],
        },
      ],
    });
  }

  getGeoCoverageFromStructureZones({ structureLevelId, structureCode }, options) {
    logger.debug('ExternalRepository.getGeoCoverageFromStructureZones');
    const andStructure = [];
    if (structureLevelId) {
      andStructure.push({ structureLevelId });
    }
    if (structureCode) {
      andStructure.push({ structureCode });
    }
    andStructure.push({ businessModelId: options.businessModelId });

    andStructure.push({ status: statusEnum.ESTRUTURA.ATIVO });

    andStructure.push({
      flagDeprecated: { [Op.not]: true },
    });
    return GeoCoverageZones.findAll({
      include: [
        {
          model: Zones,
          required: true,
          include: [
            {
              model: Structure,
              required: true,
              where: { [Op.and]: andStructure },
            },
          ],
        },
      ],
    });
  }

  getOperacionalCycles({ dateStart, dateEnd }) {
    logger.debug('ExternalRepository.getOperacionalCycles');
    const andCycle = [];
    if (dateStart) {
      andCycle.push({
        dateStart: { [Op.gte]: dateStart },
      });
    }
    if (dateEnd) {
      andCycle.push({
        dateEnd: { [Op.lte]: dateEnd },
      });
    }
    return CycleGroup.findAll({
      where: { [Op.and]: andCycle },
      include: [
        {
          model: Cycle,
          required: true,
        },
      ],
    });
  }

  getOperacionalCyclesAll({ dateStart, dateEnd }) {
    logger.debug('ExternalRepository.getOperacionalCyclesAll');
    const andWhere = [];
    if (dateStart) {
      andWhere.push({
        dateStart: { [Op.gte]: dateStart },
      });
    }
    if (dateEnd) {
      andWhere.push({
        dateEnd: { [Op.lte]: dateEnd },
      });
    }
    return OperationalCycle.findAll({
      attributes: ['cycleCode', 'dateStart', 'dateEnd'],
      where: { [Op.and]: andWhere },
      group: ['cycleCode', 'dateStart', 'dateEnd'],
    });
  }

  async disableStructure({
    structureLevelId,
    structureCode,
    options,
  }) {
    logger.debug('ExternalRepository.disableStructure');
    // Validar se há pessoas associadas contra o BRM
    const peopleAssigned = await brmService.countAssignedByStructure({
      country: options.country,
      company: options.companyId,
      businessModelId: options.businessModelId,
      structureLevelId,
      structureCode,
    });
    // STRUCTURE_PEOPLE_DEPENDENCY_VIOLATION
    if (peopleAssigned.data.peopleCount > 0) {
      Exception.raise(errorDefinitions.STRUCTURE_PEOPLE_DEPENDENCY_VIOLATION);
    }
    let transaction;
    try {
      transaction = await db.transaction();
      const structure = await Structure
        .findOne({ where: { [Op.and]: [{ structureLevelId }, { structureCode }] }, raw: true });
      const uid = structure.structureUid;
      const newUid = uuid();
      // update actual version
      const structureVersion = structure.structureVersion + 1;
      await Structure.update({
        dateStart: new Date(),
        dateEnd: new Date(),
        structureVersion,
        status: statusEnum.ESTRUTURA.INATIVO,
        flagDeprecated: false,
        lastUpdatedBy: options.userId,
        updatedAt: new Date(),
      }, {
          where: { structureUid: uid },
          transaction,
        });
      await Structure.create(// create historic version
        {
          ...structure,
          structureUid: newUid,
          flagDeprecated: true,
        },
        { transaction },
      );
      // TODO: atualizar a versão nas dependências
      await Structure.update(
        {
          parentVersion: structureVersion,
        },
        { where: { parentStructureUid: uid } },
        { transaction },
      );
      await transaction.commit();
      return { success: true, message: 'OK' };
    } catch (err) {
      await transaction.rollback();
      return Exception.raise({
        ...errorDefinitions.UNKNOWN,
        detail: (err.message || err),
        stack: (err.stack || undefined),
      });
    }
  }

  async getStructureEndCycle({ dateEnd }, options) {
    logger.debug('ExternalRepository.getStructureEndCycle');
    const [businessModel] = await this.getHierarchy(options);
    const hierarchy = businessModel.Hierarchies;
    const hierarchyHasCalendar = hierarchy.filter(h => h.hasCalendar);
    const levelId = [];
    const levelUids = [];
    const levelParentUids = [];
    hierarchyHasCalendar.map((h) => {
      levelId.push(h.StructureLevel.structureLevelId);
      levelUids.push(h.structureLevelUid);
      levelParentUids.push(h.parentStructureLevelUid);
    });

    const query = `SELECT
              oc.structure_level, oc.structure_code, s.structure_name,
              oc.parent_structure_level, oc.parent_structure_code, p.structure_name as parent_structure_name,
              oc.operational_cycle as cycle, l1.structure_level_name, l2.structure_level_name as parent_structure_level_name
              FROM cmm.operational_cycle AS oc
              INNER JOIN cmm.structure as s ON (s.country = oc.country AND s.business_model = oc.business_model
              AND s.version = oc.version_structure AND s.structure_level = oc.structure_level AND s.structure_code = oc.structure_code
               AND s.flag_deprecated = false)
              INNER JOIN structure as p ON (
                 p.structure_uid = s.parent_structure_uid
              )
              INNER JOIN cmm.structure_level_types l1 ON l1.structure_level_uid IN (:levelUids)
              LEFT JOIN cmm.structure_level_types l2 ON l2.structure_level_uid IN (:levelParentUids)
              WHERE
              oc.country = :countryId AND
              oc.company_id = :companyId AND
              oc.business_model = :businessModelId AND
              oc.date_end = :dateEnd AND
              oc.structure_level IN (:levelId)`;
    const operationalCycle = await db.query(query, {
      type: db.QueryTypes.SELECT,
      replacements: {
        dateEnd,
        countryId: options.countryId,
        companyId: options.companyId,
        businessModelId: options.businessModelId,
        levelId,
        levelUids,
        levelParentUids,
      },
    });

    const count = `SELECT COUNT(*)
              FROM cmm.operational_cycle AS oc
              INNER JOIN cmm.structure as s ON (s.country = oc.country AND s.business_model = oc.business_model
              AND s.version = oc.version_structure AND s.structure_level = oc.structure_level AND s.structure_code = oc.structure_code
               AND s.flag_deprecated = false) INNER JOIN structure as p ON (
                 p.structure_uid = s.parent_structure_uid
              )
              INNER JOIN cmm.structure_level_types l1 ON l1.structure_level_uid IN (:levelUids)
              LEFT JOIN cmm.structure_level_types l2 ON l2.structure_level_uid IN (:levelParentUids)
              WHERE
              oc.country = :countryId AND
              oc.company_id = :companyId AND
              oc.business_model = :businessModelId AND
              oc.date_end = :dateEnd AND
              oc.structure_level IN (:levelId)`;
    const [countOperationalCycle] = await db.query(count, {
      type: db.QueryTypes.SELECT,
      replacements: {
        dateEnd,
        countryId: options.countryId,
        companyId: options.companyId,
        businessModelId: options.businessModelId,
        levelId,
        levelUids,
        levelParentUids,
        limit: options.limit,
        offset: options.offset,
      },
    });
    return {
      count: countOperationalCycle.count,
      rows: operationalCycle,
    };
  }

  async getCycleByYear({
    structureLevelId,
    structureCode,
    yearStart,
    yearEnd,
    cycleCode,
  }, options) {
    logger.debug('ExternalRepository.getStructureEndCycle');
    const andWhere = [];
    andWhere.push({
      countryId: options.countryId,
    });
    andWhere.push({
      companyId: options.companyId,
    });
    andWhere.push({
      businessModelId: options.businessModelId,
    });

    if (yearStart !== undefined) {
      const cycleYear = `${yearStart}00`;
      andWhere.push({
        cycleCode: { [Op.gte]: cycleYear },
      });
    }
    if (yearEnd !== undefined) {
      const cycleYear = `${yearEnd}99`;
      andWhere.push({
        cycleCode: { [Op.lte]: cycleYear },
      });
    }

    if (cycleCode !== undefined) {
      andWhere.push({
        cycleCode,
      });
    }

    if (yearStart === undefined && yearEnd === undefined && cycleCode === undefined) {
      andWhere.push({
        dateEnd: { [Op.gte]: new Date() },
      });
    }

    const generalCycles = await OperationalCycle.findAll({
      attributes: [
        [db.fn('MIN', db.col('date_start')), 'dateStart'],
        [db.fn('MAX', db.col('date_end')), 'dateEnd'],
        'cycleCode',
      ],
      where: { [Op.and]: andWhere },
      group: [
        'cycleCode',
      ],
    });
    const result = {};
    const cycleArr = [];
    await Promise.all(generalCycles.map(async (structureCycle) => {
      const xCycle = {
        dateStart: structureCycle.dateStart,
        dateEnd: structureCycle.dateEnd,
        cycleCode: structureCycle.cycleCode,
        subcycles: [],
      };
      const subcycles = await this.getSubCycleToCycleByYear({
        cycleCode: structureCycle.cycleCode,
      }, options);
      let dateStartCycle = moment(structureCycle.dateStart).format('YYYY-MM-DD');
      subcycles.map((subcycle) => {
        const dateEndCycle = moment(dateStartCycle).add('days', subcycle.qty_days).format('YYYY-MM-DD');
        const xSubcycle = {
          subcycleCode: subcycle.subcycle_code,
          dateStart: dateStartCycle,
          dateEnd: dateEndCycle,
        };
        xCycle.subcycles.push(xSubcycle);
        dateStartCycle = moment(dateEndCycle).add('days', 1).format('YYYY-MM-DD');
      });
      if (xCycle.subcycles.length > 0) {
        xCycle.subcycles[xCycle.subcycles.length - 1].dateEnd = moment(structureCycle.dateEnd).format('YYYY-MM-DD');
      }
      cycleArr.push(xCycle);
    }));
    result.general = cycleArr;
    if (structureLevelId !== undefined && structureCode !== undefined) {
      andWhere.push({
        structureLevelId,
      }, {
          structureCode: { [Op.in]: structureCode },
        });
      const cyclesByStructure = await OperationalCycle.findAll({
        attributes: ['structureLevelId', 'structureCode', 'dateStart', 'dateEnd', 'cycleCode'],
        where: { [Op.and]: andWhere },
      });
      const resp = [];
      await Promise.all(cyclesByStructure.map(async (cycleStructure) => {
        const xCycle = {
          cycleCode: cycleStructure.cycleCode,
          dateStart: cycleStructure.dateStart,
          dateEnd: cycleStructure.dateEnd,
          subcycles: [],
        };
        const subcycles = await this.getSubCycleToCycleByYear({
          cycleCode: cycleStructure.cycleCode,
        }, options);
        let dateStartCycle = moment(cycleStructure.dateStart).format('YYYY-MM-DD');
        subcycles.map((subcycle) => {
          const dateEndCycle = moment(dateStartCycle).add('days', subcycle.qty_days).format('YYYY-MM-DD');
          const xSubcycle = {
            subcycleCode: subcycle.subcycle_code,
            dateStart: dateStartCycle,
            dateEnd: dateEndCycle,
          };
          xCycle.subcycles.push(xSubcycle);
          dateStartCycle = moment(dateEndCycle).add('days', 1).format('YYYY-MM-DD');
        });
        if (xCycle.subcycles.length > 0) {
          xCycle.subcycles[xCycle.subcycles.length - 1].dateEnd = moment(cycleStructure.dateEnd).format('YYYY-MM-DD');
        }
        const index = resp.findIndex(f => f.structureLevelId === cycleStructure.structureLevelId
          && f.structureCode === cycleStructure.structureCode);
        if (index > -1) {
          resp[index].cycles.push(xCycle);
        } else {
          const s = {
            structureLevelId: cycleStructure.structureLevelId,
            structureCode: cycleStructure.structureCode,
            cycles: [],
          };
          s.cycles.push(xCycle);
          resp.push(s);
        }
      }));
      result.structures = resp;
    }
    return result;
  }

  async getSubCycleToCycleByYear({
    cycleCode,
  }, options) {
    logger.debug('ExternalRepository.getSubCycleToCycleByYear');
    const query = `SELECT op.operational_cycle, sc.subcycle_code, sc.qty_days FROM operational_cycle op
      INNER JOIN "structure" st ON (st.structure_level = op.structure_level AND
                                    st.structure_code = op.structure_code AND
                                    st.business_model = op.business_model
                                    and st.country = op.country)
      INNER JOIN structure_group sg on sg.structure_uid = st.structure_uid
      INNER JOIN cycle_group cg on cg.cycle_group_uid = sg.cycle_group_uid
      INNER JOIN cycles c on c.cycle_uid = cg.cycle_uid AND c.operational_cycle = :cycleCode
      INNER JOIN subcycle sc on sc.cycle_uid = c.cycle_uid
      WHERE op.business_model = :businessModelId AND op.country = :countryId
            AND op.company_id = :companyId AND op.operational_cycle = :cycleCode
      GROUP BY op.business_model, op.operational_cycle, sc.subcycle_code, sc.qty_days`;
    const subcycles = await db.query(query, {
      type: db.QueryTypes.SELECT,
      replacements: {
        countryId: options.countryId,
        companyId: options.companyId,
        businessModelId: options.businessModelId,
        cycleCode,
      },
    });
    return subcycles;
  }

  async getStructureByCycle({
    structureLevelId,
    orderLevel,
    cycleCode,
    cycleCodeStart,
    cycleCodeEnd,
    dateStart,
    dateEnd,
  }, options) {
    logger.debug('ExternalRepository.getStructureEndCycle');
    let customWhere = '';
    if (orderLevel !== undefined) {
      const [businessModel] = await this.getHierarchy(options);
      const [hierarchyOrderLevel] = businessModel.Hierarchies
        .filter(h => h.orderLevel === orderLevel);
      if (!hierarchyOrderLevel) {
        return [];
      }
      customWhere += ` AND oc.structure_level = ${hierarchyOrderLevel.structureLevelId}`;
    }

    if (structureLevelId !== undefined) {
      customWhere += ` AND oc.structure_level = ${structureLevelId}`;
    }

    if (cycleCodeStart !== undefined) {
      customWhere += ` AND oc.operational_cycle >= ${cycleCodeStart}`;
    }

    if (cycleCodeEnd !== undefined) {
      customWhere += ` AND oc.operational_cycle <= ${cycleCodeEnd}`;
    }

    if (cycleCode) {
      customWhere += ` AND oc.operational_cycle = ${cycleCode}`;
    }

    if (dateStart !== undefined) {
      customWhere += ` AND oc.date_start >= '${dateStart}'`;
    }

    if (dateEnd !== undefined) {
      customWhere += ` AND oc.date_end <= '${dateEnd}'`;
    }

    if (cycleCode === undefined && dateStart === undefined && dateEnd === undefined &&
      cycleCodeEnd === undefined && cycleCodeStart === undefined) {
      customWhere += ' AND oc.date_end >= NOW() ';
    }

    const query = `SELECT
              oc.structure_level, sl.structure_level_name, oc.structure_code, s.structure_name,
              psl.structure_level as parent_structure_level, psl.structure_level_name as parent_structure_level_name,
              p.parent_structure_code, p.structure_name as parent_structure_name
              FROM cmm.operational_cycle AS oc
              INNER JOIN cmm.structure as s ON (s.country = oc.country AND s.business_model = oc.business_model
              AND s.version = oc.version_structure AND s.structure_level = oc.structure_level AND s.structure_code = oc.structure_code
               AND s.flag_deprecated = false)
              INNER JOIN structure_level_types_model as h1 ON (
                 h1.hierarchy_uid = s.hierarchy_uid
              )
              INNER JOIN structure_level_types as sl ON (
                 sl.structure_level_uid = h1.structure_level_uid
              )
              LEFT OUTER JOIN structure as p ON (
                p.structure_uid = s.parent_structure_uid
              )
              LEFT OUTER JOIN structure_level_types_model as h2 ON (
                 h2.hierarchy_uid = p.hierarchy_uid
              )
              LEFT OUTER JOIN structure_level_types as psl ON (
                 psl.structure_level_uid = h2.structure_level_uid
              )
              WHERE
              oc.country = :countryId AND
              oc.company_id = :companyId AND
              oc.business_model = :businessModelId ${customWhere}
              GROUP BY
              oc.structure_level, sl.structure_level_name, oc.structure_code, s.structure_name,
              psl.structure_level, p.parent_structure_code, psl.structure_level_name,
              p.structure_name`;
    const operationalCycle = await db.query(query, {
      type: db.QueryTypes.SELECT,
      replacements: {
        countryId: options.countryId,
        companyId: options.companyId,
        businessModelId: options.businessModelId,
      },
    });
    return operationalCycle;
  }

  async getGeoStructureTree({ geoStructureCode, geoStructureDescription }) {
    logger.debug('ExternalRepository.getGeoStructureTree');

    const geoStructureTree = [];
    let params = {};
    if (geoStructureCode || geoStructureDescription) {
      params = {
        geoStructureCode,
        geoStructureDescription,
      };
    } else {
      params = { parentGeoStructureUid: null };
    }
    if (params !== {}) {
      const response = await this.getGeoStructure(params);
      if (response) {
        for (let index = 0; index < response.length; index += 1) {
          const item = response[index].get();
          let parentUid = item.parentGeoStructureUid;
          item.parentTree = [];
          const next = await this.getGeoStructure({
            parentGeoStructureUid: item.geoStructureUid,
          });
          item.nextLevel = next.map(geo => ({
            geoStructureCode: geo.geoStructureCode,
            geoStructureDescription: geo.geoStructureDescription,
          }));
          item.geoStructureUid = undefined;
          item.parentGeoStructureUid = undefined;
          while (parentUid !== null && parentUid !== undefined) {
            let geoStructure = await this.getGeoStructure({
              geoStructureUid: parentUid,
            });
            [geoStructure] = geoStructure;
            if (geoStructure) {
              parentUid = geoStructure.parentGeoStructureUid;
              item.parentTree.push({
                geoStructureCode: geoStructure.geoStructureCode,
                geoStructureDescription: geoStructure.geoStructureDescription,
              });
            }
          }
          geoStructureTree.push(item);
        }
      }
    }

    return geoStructureTree;
  }

  async getGeoStructure({
    geoStructureUid,
    geoStructureCode,
    geoStructureDescription,
    parentGeoStructureUid,
  }) {
    logger.debug('ExternalRepository.getGeoStructure');
    const andGeoStructure = [];

    if (geoStructureUid) {
      andGeoStructure.push({
        geoStructureUid,
      });
    }
    if (parentGeoStructureUid !== undefined) {
      andGeoStructure.push({
        parentGeoStructureUid,
      });
    }
    if (geoStructureCode) {
      andGeoStructure.push({
        geoStructureCode,
      });
    }
    if (geoStructureDescription) {
      andGeoStructure.push({
        geoStructureDescription: { [Op.iLike]: `%${geoStructureDescription}%` },
      });
    }
    return GeoStructureParent.findAll({
      where: { [Op.and]: andGeoStructure },
    });
  }

  getFunctions(options) {
    logger.debug('ExternalRepository.getFunctions');
  }

  async getStructuresAssignments({
    cityUid, geoCoverage, description, geoCoverageType,
  }) {
    logger.debug('ExternalRepository.getStructuresAssignments');
    const parallel = [];
    const andZones = [];
    const andGeoCoverage = [];
    const whereCity = cityUid ? { cityUid } : cityUid;
    const includeZone = [];
    const includeDistrict = [];

    if (geoCoverage) {
      andGeoCoverage.push({
        geo_coverage_nr_start: { [Op.lte]: parseInt(geoCoverage, 10) },
      });
      andGeoCoverage.push({
        geo_coverage_nr_end: { [Op.gte]: parseInt(geoCoverage, 10) },
      });
      includeZone.push({
        model: GeoCoverageZones,
        attributes: ['geoCoverageStart', 'geoCoverageEnd', 'zipCodeZoneUid'],
        require: true,
        where: { [Op.and]: andGeoCoverage },
      });
      includeDistrict.push({
        model: GeoCoverageDistrict,
        attributes: ['geoCoverageStart', 'geoCoverageEnd', 'zipCodeDistrictUid'],
        require: true,
        where: { [Op.and]: andGeoCoverage },
      });
    }

    if (description) {
      const orWhere = [];
      orWhere.push({
        zoneCode: { [Op.iLike]: `%${description}%` },
      });
      orWhere.push({
        zoneName: { [Op.iLike]: `%${description}%` },
      });
      andZones.push({ [Op.or]: orWhere });
    }

    if (geoCoverageType === '1') {
      includeZone.push({
        model: StatesCity,
        required: true,
        attributes: ['cityName'],
        where: whereCity,
      });
      includeDistrict.push({
        model: StatesCity,
        required: true,
        attributes: ['cityName'],
        where: whereCity,
      });
    }

    parallel.push(Structure.findAll({
      include: [
        {
          model: StructureParent,
          required: false,
        },
        {
          model: Zones,
          required: true,
          through: StructureZones,
          attributes: ['zoneName', 'zoneUid', 'zoneCode'],
          where: { [Op.and]: andZones },
          include: includeZone,
        },
      ],
    }));
    parallel.push(Structure.findAll({
      include: [
        {
          model: StructureParent,
          required: false,
        },
        {
          model: District,
          required: true,
          through: StructureDistrict,
          attributes: ['districtDescription', 'districtUid'],
          where: { districtDescription: { [Op.iLike]: `%${(description || '')}%` } },
          include: includeDistrict,
        },
      ],
    }));
    const results = await Promise.all(parallel);
    const ret = [];
    results.map(response => response.map((item) => {
      const [xItem] = item.Zones || item.Districts;
      let xZipCode;
      if (xItem.GeoCoverageZones) {
        [xZipCode] = xItem.GeoCoverageZones;
      }
      if (xItem.GeoCoverageDistrict) {
        [xZipCode] = xItem.GeoCoverageDistrict;
      }
      ret.push({
        recordType: (xItem.zoneUid) ? 'Z' : 'D',
        recordFk: xItem.zoneUid || xItem.districtUid,
        cityName: (xItem.StatesCity) ? xItem.StatesCity.cityName : undefined,
        zoneCode: xItem.zoneCode || '',
        description: xItem.zoneName || xItem.districtDescription,
        geoCoverageStart: (xZipCode) ? xZipCode.geoCoverageStart : undefined,
        geoCoverageEnd: (xZipCode) ? xZipCode.geoCoverageEnd : undefined,
        structureLevelId: item.structureLevelId,
        structureCode: item.structureCode,
        structureName: item.structureName,
        parentStructureLevelId: item.StructureParent.structureLevelId,
        parentStructureCode: item.StructureParent.structureCode,
        parentStructureName: item.StructureParent.structureName,
      });
    }));
    return ret.sort((a, b) => (a.description < b.description ? -1 : 1));
  }
}

module.exports = ExternalRepository;
