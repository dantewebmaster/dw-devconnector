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

  async registerUser(data) {
    logger.debug('UsersRepository.registerUser');
    let transaction;
    try {
      transaction = await db.transaction();
      const newUid = uuid();
      data.user.userUid = newUid;
      await User.create(data.user, { transaction });
      await transaction.commit();
      return data.user;
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
      limit: options.limit,
      offset: options.offset,
      attributes: ['userUid', 'email', 'firstName', 'lastName', 'avatar', 'address', 'city'],
      where: { [Op.and]: andUsers },
      order: [
        ['firstName', 'ASC'],
      ],
    });
  }

  getByUid({ userUid }) {
    logger.debug('UsersRepository.getByUid');
    const andUsers = [];
    if (userUid) {
      andUsers.push({ userUid });
    }

    return User.findOne({
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

  async existUser({ userUid, email }) {
    logger.debug('UsersRepository.existUser');
    const andCondition = [];

    if (userUid) {
      andCondition.push({
        userUid: { [Op.ne]: userUid },
      });
    }

    if (email) {
      andCondition.push({
        email: { [Op.eq]: email },
      });
    }

    const exists = await User.count({
      where: { [Op.and]: andCondition },
    }) > 0;

    logger.debug('Name Exists: ', exists);

    return exists;
  }

}

module.exports = UsersRepository;
