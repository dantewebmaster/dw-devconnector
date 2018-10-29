const logger = require('../../helpers/logger');
const UsersRepository = require('../repositories/UsersRepository');
const usersTransformer = require('../../helpers/transformers/usersTransformer');
const validations = require('../../helpers/validations');
const { Exception, errorDefinitions } = require('../../helpers/errors');

const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const keys = require('../../../config/keys');

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

  async registerUser() {
    logger.debug('UsersBO.registerUser');
    const data = await this.getDataFromParams(true);

    // Add avatar to the user
    data.user.avatar = await this.getAvatar(data.user.email);
    // Hash password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(data.user.password, salt, (err, hash) => {
        if (err) throw err;
        data.user.password = hash;
      });
    });

    return this.usersRepository.registerUser(data, this.options);
  }

  async getAvatar(email) {
    const avatar = gravatar.url(email, {
      s: '200', // Size
      r: 'pg',  // Rating
      d: 'mm'   // Default
    });
    return avatar;
  }

  async loginUser() {
    logger.debug('UsersBO.loginUser');

    // const { errors, isValid } = validateLoginInput(req.body);
    // Check Validation
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }

    const data = await this.getDataFromParams(false);

    const email = data.user.email;
    const password = data.user.password;

    User.findOne({ email })
      .then(user => {
        // Check for user
        if (!user) {
          errors.email = 'User not found'
          return res.status(404).json(errors);
        }

        // Check password
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              // User matched

              const payload = { userId: user.userUid, name: user.name, avatar: user.avatar } // JWT Payload

              // Sign Token
              jwt.sign(
                payload,
                keys.secret,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: 'Bearer ' + token
                  });
                });
            } else {
              errors.password = 'Password incorrect';
              return res.status(400).json(errors);
            }
          });
      });
  }

  async getDataFromParams(isNew) {
    const data = {
      user: {
        userUid: (this.params.userUid || {}).value,
        ...this.params.body.value || {},
      },
    };

    if (isNew) {
      const currentDate = new Date;
      Object.assign(data.user, {
        createdAt: currentDate,
      });
    }

    await this.validateInput(data.user);
    return data;
  }

  async validateInput(input) {
    const criteria = {
      userUid: input.userUid,
      email: input.email,
    };

    const userDuplicated = await this.usersRepository.existUser(
      { ...criteria, email: input.email },
      this.options,
    );

    if (userDuplicated) {
      Exception.raise(errorDefinitions.USER_ALREADY_EXISTS);
    }
  }

  async getUsers() {
    logger.debug('UsersBO.getUsers');
    const criteria = {};
    const data = await this.usersRepository.getUsers(criteria, this.options);
    return data;
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
