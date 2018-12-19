import _ from 'lodash';
import http from 'utils/http';

class ZonesApi {

  static getAll(params) {
    let config = {};

    if (params.state) {
      config = _.merge(
        config,
        {
          params: {
            ['state-id']: params.state
          }
        }
      )
    }

    if (params.city) {
      config = _.merge(
        config,
        {
          params: {
            ['city-uid']: params.city
          }
        }
      )
    }

    if (params.geoCoverage) {
      config = _.merge(
        config,
        {
          params: {
            ['geo-coverage']: params.geoCoverage
          }
        }
      )
    }

    if (params.search) {
      config = _.merge(
        config,
        {
          params: {
            ['zone-name']: params.search
          }
        }
      )
    }

    if (params.zoneCode) {
      config = _.merge(
        config,
        {
          params: {
            ['zone-code']: params.zoneCode
          }
        }
      )
    }

    return new Promise((resolve, reject) => {
      http.get(`${process.env.API}/zones`, null, config)
        .then(function(res) {
          if (res.status === 204)
            resolve({});

          resolve([...res.data]);
        })
        .catch((err) => {
          reject({ ...err });
        });
    });
  }

  static getZone(uuid) {
    return new Promise((resolve, reject) => {
      http.get(`${process.env.API}/zones/uuid/${uuid}`, null)
        .then(function(res) {
          if (res.status === 204)
            resolve({});

          resolve({ ...res.data[0] });
        })
        .catch((err) => {
          reject({ ...err });
        });
    });
  }

  static getDistrict(uuid) {
    return new Promise((resolve, reject) => {
      http.get(`${process.env.API}/district/uuid/${uuid}`, null)
        .then(function(res) {
          if (res.status === 204)
            resolve({});

          resolve({ ...res.data[0] });
        })
        .catch((err) => {
          reject({ ...err });
        });
    });
  }

  static postZone(zones) {
    return new Promise((resolve, reject) => {
      http.post(`${process.env.API}/zones`, zones)
        .then(function(res) {
          if (res.status === 204)
            resolve({});

          resolve({ ...res.data });
        })
        .catch((err) => {
          reject({ ...err });
        });
    });
  }

  static patchZone(zones) {
    return new Promise((resolve, reject) => {
      http.patch(`${process.env.API}/zones/uuid/${zones.zoneUid}`, zones)
        .then(function(res) {
          if (res.status === 204)
            resolve({});

          resolve({ ...res.data });
        })
        .catch((err) => {
          reject({ ...err });
        });
    });
  }

  static deleteZone(uuid) {
    return new Promise((resolve, reject) => {
      http.delete(`${process.env.API}/zones/uuid/${uuid}`, null)
        .then(function(res) {
          if (res.status === 204)
            resolve({});

          resolve({ ...res.data });
        })
        .catch((err) => {
          reject({ ...err });
        });
    });
  }

  static getUfs() {
    return new Promise((resolve, reject) => {
      http.get(`${process.env.API}/zones/uf`, null)
        .then(res => {
          if (res.status === 204)
            resolve([]);

          resolve([...res.data]);
        })
        .catch((err) => {
          reject({ ...err });
        });
    });
  }

  static getCities(uf) {
    let config = {
      params: {
        state: uf
      }
    };

    return new Promise((resolve, reject) => {
      http.get(`${process.env.API}/zones/cities`, null, config)
        .then(res => {
          if (res.status === 204)
            resolve([]);

          resolve([...res.data]);
        })
        .catch((err) => {
          reject({ ...err });
        });
    });
  }

  static getAssignmentsStructure(uuid, actualList, geoCoverageList) {
    let config = {
      params: {
        _limit: 10,
        _offset: 0,
      }
    };

    if (actualList)
      config.params['actual-list'] = actualList;

    if (geoCoverageList)
      config.params['geo-coverage-list'] = geoCoverageList;

    return new Promise((resolve, reject) => {
      http.get(`${process.env.API}/zones/districts/assignments/${uuid}`, null, config)
        .then(res => {
          if (res.status === 204) {
            resolve([]);
          }
          resolve([...res.data]);
        })
        .catch((err) => {
          reject({ ...err });
        });
    });
  }

  static getAssignmentsGeoCoverage(config) {
    let defaultConfig = {
      params: {
        _limit: 10,
        _offset: 0,
      }
    };

    const mergedConfig = _.merge(defaultConfig, config);

    if (config.cityUid)
      defaultConfig.params['city-uid'] = config.cityUid;

    if (config.search)
      defaultConfig.params['description'] = config.search;

    if (config.geoCoverage)
      defaultConfig.params['geo-coverage'] = config.geoCoverage;

    if (config.geoCoverageList)
      defaultConfig.params['geo-coverage-list'] = config.geoCoverageList;

    return new Promise((resolve, reject) => {
      http.get(`${process.env.API}/zones/districts/assignments/${config.uuid}`, null, mergedConfig)
        .then(res => {
          if (res.status === 204) {
            resolve([]);
          }
          resolve([...res.data]);
        })
        .catch((err) => {
          reject({ ...err });
        });
    });
  }

  static setAssignments(uuid, payload) {

    return new Promise((resolve, reject) => {
      http.post(`${process.env.API}/zones/districts/assignments/${uuid}`, payload)
        .then(res => {
          if (res.status === 204) {
            resolve([]);
          }
          resolve([...res.data]);
        })
        .catch((err) => {
          reject({ ...err });
        });
    });
  }

  static getBusinessModels() {
    return new Promise((resolve, reject) => {
      http.get(`${process.env.API}/businessModel`)
        .then(res => {
          if (res.status === 204)
            resolve([]);

          resolve([...res.data]);
        })
        .catch(err => {
          reject({ ...err });
        });
    });
  }

  static getStructureLevels(businessModelUid) {
    return new Promise((resolve, reject) => {
      http.get(`${process.env.API}/hierarchyLevel/get-hierarchy/${businessModelUid}`)
        .then((res) => {
          let [result] = res.data;
          if (((result || {}).hierarchies || []).length === 0) {
            result = []
          } else {
            result = result.hierarchies;
          }
          resolve([...result]);
        })
        .catch((er) => {
          reject({ ...er });
        });
    });
  }

  static getStructures(businessModelId, config) {
    const defaultConfig = {
      params: {
        _limit: 10,
        _offset: 0,
      },
    };

    const mergedConfig = _.merge(defaultConfig, config);

    return new Promise((resolve, reject) => {
      http.get(`${process.env.API}/structures/${businessModelId}`, null, mergedConfig)
        .then(res => {
          if (res.status === 204)
            resolve([]);

          resolve([...res.data]);
        })
        .catch(err => {
          reject({ ...err });
        });
    });
  }

  static getGeoStructures(config) {
    let defaultConfig = {
      params: {
        _limit: config.params._limit || 10,
        _offset: config.params._offset || 0,
      }
    };

    if (config.geoStructureId)
      defaultConfig.params['geo-structure-uid'] = config.geoStructureId;

    if (config.geoStructureCode)
      defaultConfig.params['geo-structure-code'] = parseInt(config.geoStructureCode);

    if (config.geoStructureDescription)
      defaultConfig.params['geo-structure-description'] = config.geoStructureDescription;

    return new Promise((resolve, reject) => {
      http.get(`${process.env.API}/zones/geo-structure-tree`, null, defaultConfig)
        .then(res => {
          if (res.status === 204)
            resolve([]);

          resolve([...res.data]);
        })
        .catch(err => {
          reject({ ...err });
        });
    });
  }

  static async exportGeoStructures(config) {
    let pagination = { ...config };
    let partial = await ZonesApi.getGeoStructures(pagination);
    let payload = [];
    const pageSize = 5;
    do {
      payload = [...payload, ...partial];
      pagination.params._offset += pageSize;
      partial = await ZonesApi.getGeoStructures(config)
        .catch(() => console.log('Deu ruim...'));// eslint-disable-line
    } while ((partial || []).length > 0);
    return payload;
  }
  cancelExportGeoStructures() {
    this.canceledExportGeoStructures = true;
  }

  static bulkGeoStructure(payload) {
    return new Promise((resolve, reject) => {
      http.post(`${process.env.API}/zones/geo-structure-tree`, payload)
        .then(res => {
          if (res.status === 204) {
            resolve([]);
          }
          resolve({ ...res.data });
        })
        .catch((err) => {
          reject({ ...err });
        });
    });
  }
}

export default ZonesApi;
