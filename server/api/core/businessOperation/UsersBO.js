const logger = require('../../helpers/logger');
const UsersRepository = require('../repositories/UsersRepository');
const usersTransformer = require('../../helpers/transformers/usersTransformer');
const validations = require('../../helpers/validations');
const { Exception, errorDefinitions } = require('../../helpers/errors');

const Dependency = {
  UsersRepository,
  usersTransformer,
};

class UsersBO {
  constructor(params) {
    this.usersRepository = new Dependency.UsersRepository();
    // set param for general use
    this.params = params;
    // set options general options
    this.options = {
      limit: (params._limit || { _limit: 200 }).value,
      offset: (params._offset || { _offset: 0 }).value,
    };
  }

  async getUsers() {
    logger.debug('UsersBO.getUsers');
    const criteria = {};
    const data = await this.usersRepository.getUsers(criteria, this.options);
    return Dependency.usersTransformer
      .transform(data);
  }

  async getByUid() {
    logger.debug('UsersBO.getByUid');
    validations.isUUID(this.params.uuid.value, 'user');
    const criteria = {
      userUid: this.params.uuid.value,
    };
    const data = await this.usersRepository.getByUid(criteria, this.options);
    return data;
  }

  async delete() {
    logger.debug('UsersBO.delete');
    validations.isUUID(this.params.uuid.value, 'user');
    const criteria = {
      userUid: this.params.uuid.value,
    };
    const exists = await this.usersRepository.existUser(criteria);
    if (!exists) {
      Exception.raise(errorDefinitions.USER_NOT_FOUND);
    }
    // send to repository and get results
    return this.usersRepository.delete(criteria, this.options);
  }
}

module.exports = UsersBO;
