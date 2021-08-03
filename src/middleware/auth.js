// import { log } from 'debug';
import jwt from 'jsonwebtoken';
import Model from '../models/model';
import { secret } from '../settings';

const usersModel = new Model('users');

export const Auth = {
  /**
   * Verify Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(400).send({
        message: 'Token is not provided'
      });
    }
    console.log(token);
    try {
      const decoded = await jwt.verify(token, secret);
      const columns = '*';
      const clause = ` WHERE id = '${decoded.userId}'`;
      const data = await usersModel.select(columns, clause);
      console.log(data);
      if (!data.rows[0]) {
        return res.status(400).send({
          message: 'The token you provided is invalid'
        });
      }
      req.user = { id: decoded.userId };
      return next();
    } catch (error) {
      return res.status(401).send({
        error,
        message: 'You are not authorized'
      });
    }
  },
  /**
   * Verify Administrator
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  async verifyAdmin(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(400).send({
        message: 'Token is not provided'
      });
    }
    try {
      const decoded = await jwt.verify(token, secret);
      const columns = '*';
      const clause = ` WHERE id = '${decoded.userId}'`;
      const data = await usersModel.select(columns, clause);
      if (data.rows[0].role !== 'Administrator') {
        return res.status(400).send({
          message: 'The token you provided is not valid for an Administrator'
        });
      }
      req.user = { id: decoded.userId };
      return next();
    } catch (error) {
      return res.status(401).send({
        error,
        message: 'You are not authorized'
      });
    }
  }
};
