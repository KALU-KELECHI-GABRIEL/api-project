import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { dbHelper, sendEmail } from '../helper/index';
import Model from '../models/model';

const coursesModel = new Model('courses');

export const Course = {
  /**
  * Create a course
  * @param (object) req
  * @param (object) res
  * @returns (object) user object
  */
  async create(req, res) {
    const {
      title, detail, price, instructor
    } = req.body;
    console.log(req.body);
    if (!title || !detail || !price || !instructor) {
      return res.status(400).send({
        message: 'Some Form values are missing'
      });
    }
    const columns = 'title, detail, price, instructor, created_date, modified_date';
    const values = ` '${title}', '${detail}', '${price}', '${instructor}', '${moment(new Date())}', '${moment(new Date())}'`;
    try {
      const data = await coursesModel.insertWithReturn(columns, values);
      return res.status(200).send({
        result: data.rows,
        message: `Course ${title} has been added to Courses`
      });
    } catch (err) {
      if (err.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'Course with that title already exist' });
      }
      return res.status(400).json({ error: err });
    }
  },

  /**
  * Update a course
  * @param (object) req
  * @param (object) res
  * @returns (object) user object
  */
  async update(req, res) {
    const { id } = req.params;
    const {
      title, detail, price, instructor
    } = req.body;
    console.log(req.body, id);
    if (!title || !detail || !price || !instructor) {
      return res.status(400).send({
        message: 'Some Form values are missing'
      });
    }
    // const columns = 'title, detail, price, instructor, created_date, modified_date';
    const values = ` '${title}', '${detail}', '${price}', '${instructor}', '${moment(new Date())}', '${moment(new Date())}'`;
    const update = ` SET title='${title}', detail = '${detail}', price = '${price}', instructor = '${instructor}', modified_date = '${moment(new Date())}'`;
    const clause = ` \n WHERE id = ${id} RETURNING *`;
    try {
      const data = await coursesModel.updateWithReturn(update, clause);
      return res.status(200).send({
        result: data.rows[0],
        message: `Course ${title} has been updated Successfully`
      });
    } catch (err) {
      if (err.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'Course with that title already exist' });
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
  async getCourses(req, res) {
    const columns = '*';
    // const clause = `WHERE email = ${email}`;
    try {
      const data = await coursesModel.select(columns);
      if (!data.rows[0]) {
        return res.status(200).send({ message: 'No records found' });
      }

      return res.status(200).send({
        result: data.rows,
        message: 'Courses list returned'
      });
    } catch (err) {
      return res.status(400).send({
        error: err,
        message: 'Something went wrong, try again.'
      });
    }
  }
};
