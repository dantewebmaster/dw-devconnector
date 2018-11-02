const logger = require('../../helpers/logger');
const models = require('../models');
const uuid = require('uuid/v1');
const { Exception, errorDefinitions } = require('../../helpers/errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');

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

  async loginUser(data) {
    logger.debug('UsersRepository.loginUser');

    const errors = {};
    let response;

    const user = await User.findOne({
      where: {
        email: data.email
      },
      attributes: ['userUid', 'email', 'name', 'password']
    });

    // Check for user
    if (!user) {
      errors.email = 'User not found'
      return res.status(404).json(errors);
    }

    // Check password
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (isMatch) {
      // JWT Payload
      const payload = {
        userUid: user.userUid,
        name: user.name,
        avatar: user.avatar
      }

      // Sign Token
      await jwt.sign(
        payload,
        keys.secretOrKey,
        { expiresIn: 3600 },
        (err, token) => {
          return response = {
            success: true,
            token: 'Bearer ' + token
          }
        }
      );
    } else {
      errors.password = 'Password incorrect';
      return errors;
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
      attributes: ['userUid', 'name', 'email', 'avatar', 'password', 'createdAt', 'lastUpdatedAt'],
      where: { [Op.and]: andUsers },
      order: [
        ['name', 'ASC'],
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
