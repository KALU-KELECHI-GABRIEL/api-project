import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { dbHelper, sendEmail } from '../helper/index';
import Model from '../models/model';

const usersModel = new Model('users');

export const User = {
  /**
  * Create a User
  * @param (object) req
  * @param (object) res
  * @returns (object) user object
  */
  async create(req, res) {
    const {
      email, firstName, lastName, password, phoneNumber, role
    } = req.body;
    if (!email || !password || !firstName || !lastName || !role || !phoneNumber) {
      return res.status(400).send({
        message: 'Some Form values are missing'
      });
    }
    if (!dbHelper.isValidEmail(email)) {
      return res.status(400).send({ message: 'Please enter a valid email address' });
    }
    if (!dbHelper.isValidPhone(phoneNumber)) {
      return res.status(400).send({ message: 'Please enter a valid Phone Number' });
    }

    const hashPassword = dbHelper.hashPassword(password);
    const mailCOntent = {
      email,
      subject: `EDUNESIS ACCOUNT CREATED FOR ${firstName} ${lastName}`,
      message: `Hi ${firstName},\nyour Edunesis account has been created. Do login with this email address and your set password, password: ${password}\n Login here: ${process.env.CLIENT_URL}/login`,
    };
    const columns = 'id, email, first_name, last_name, password, phone_number, role, active, created_date, modified_date';
    const values = `'${uuidv4()}', '${email}', '${firstName}', '${lastName}', '${hashPassword}', '${phoneNumber}', '${role}', 'true', '${moment(new Date())}', '${moment(new Date())}'`;
    try {
      const data = await usersModel.insertWithReturn(columns, values);
      const token = dbHelper.generateToken(data.rows[0]);
      const feedback = await sendEmail.mailSender(mailCOntent);
      return res.status(200).send({
        message: feedback.message,
        result: data.rows,
        token
      });
    } catch (err) {
      if (err.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).json({ error: err });
    }
  },

  /**
   * Login
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  async login(req, res) {
    // console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        message: 'Some values are missing'
      });
    }
    if (!dbHelper.isValidEmail(req.body.email)) {
      return res.status(400).send({
        message: 'Please enter a valid email address'
      });
    }

    const columns = '*';
    const clause = ` WHERE email = '${email}'`;
    try {
      const data = await usersModel.select(columns, clause);
      if (!data.rows[0]) {
        return res.status(400).send({ message: 'The email you provided is incorrect' });
      }
      if (!dbHelper.comparePassword(data.rows[0].password, password)) {
        return res.status(400).send({ message: 'The password you provided is incorrect' });
      }
      const token = dbHelper.generateToken(data.rows[0].id);
      return res.status(200).send({
        token,
        message: `Welcome back ${data.rows[0].first_name} ${data.rows[0].last_name}`
      });
    } catch (err) {
      return res.status(400).send({
        error: err,
        message: 'Something went wrong, try again.'
      });
    }
  },
  /**
   * Get all users in database
   * @param {} req
   * @param {object} res
   * @returns {object} users object
   */
  async getUsers(req, res) {
    const columns = '*';
    // const clause = `WHERE email = ${email}`;
    try {
      const data = await usersModel.select(columns);
      if (!data.rows[0]) {
        return res.status(400).send({ message: 'No records found' });
      }

      return res.status(200).send({
        result: data.rows,
        message: 'Users list returned'
      });
    } catch (err) {
      return res.status(400).send({
        error: err,
        message: 'Something went wrong, try again.'
      });
    }
  }
};
