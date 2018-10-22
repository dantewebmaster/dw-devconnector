const logger = require('../../helpers/logger');
const models = require('../models');
const uuid = require('uuid/v1');
const { Exception, errorDefinitions } = require('../../helpers/errors');

const db = models.sequelize;
const { Op } = models.sequelize;

const {
  User,
} = models;

class UsersRepository {

  async create(data) {
    logger.debug('UsersRepository.create');
    let transaction;
    try {
      transaction = await db.transaction();
      const newUid = uuid();
      data.users.userUid = newUid;
      await User.create(data.users, { transaction });
      await transaction.commit();
      return data.users;
    } catch (err) {
      await transaction.rollback();
      return Exception.raise({
        ...errorDefinitions.UNKNOWN,
        detail: err.message,
        stack: err.stack,
      });
    }
  }

  async getUsers({ userName }, options) {
    logger.debug('UsersRepository.getUsers');
    const andUsers = [];

    if (userName) {
      const orWhere = [];
      orWhere.push({
        userName: { [Op.iLike]: `%${userName}%` },
      });
      andUsers.push({ [Op.or]: orWhere });
    }

    return User.findAll({
      // limit: options.limit,
      // offset: options.offset,
      attributes: ['userUid', 'firstName', 'city'],
      // where: { [Op.and]: andUsers },
      // order: [
      //   ['firstName', 'ASC'],
      // ],
    });
  }

  getByUid({ userUid }) {
    logger.debug('UsersRepository.getByUid');
    const andUsers = [];
    if (userUid) {
      andUsers.push({ userUid });
    }

    return User.findAll({
      where: { [Op.and]: andUsers },
    });
  }

  async delete({ userUid }) {
    logger.debug('UsersRepository.delete');
    const andUser = [];
    if (userUid) {
      andUser.push({ userUid });
    }
    let transaction;
    try {
      transaction = await db.transaction();
      await User.destroy({
        transaction,
        where: { [Op.and]: andUser },
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      Exception.raise({
        ...errorDefinitions.UNKNOWN,
        detail: (err.message || err),
        stack: (err.stack || undefined),
      });
    }
  }

  async existUserName({ userName, userUid }) {
    logger.debug('UsersRepository.existUser');
    const andCondition = [];

    if (userUid) {
      andCondition.push({
        userUid: { [Op.ne]: userUid },
      });
    }

    if (userName) {
      andCondition.push({
        userName: { [Op.iLike]: `${userName}` },
      });
    }

    const exists = await User.count({
      where: { [Op.and]: andCondition },
    }) > 0;

    logger.debug('Name Exists: ', exists);

    return exists;
  }

  async existUser({ userUid }) {
    logger.debug('UsersRepository.existUser');
    const exists = await User.count({
      where: { userUid },
    });
    logger.debug(`${userUid} User Exists: `, exists);
    return exists > 0;
  }

}

module.exports = UsersRepository;
