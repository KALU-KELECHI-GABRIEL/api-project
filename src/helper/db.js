import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { isValidPhoneNumber } from 'libphonenumber-js';
import * as EmailValidator from 'email-validator';

import { secret } from '../settings';

export const dbHelper = {
  /**
  * hash password method
  * @param (string) password
  * @returns (string) returns hashed password
  */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },
  /**
  * Compare password method
  * @param (string) hashpassword
  * @param (string) password
  * @returns (Boolean) returns true or false
  */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  /**
  * isValidEmail helper method
  * @param (string) email
  * @returns (Boolean) returns true or false
  */
  isValidEmail(email) {
    return EmailValidator.validate(email);
  },
  /**
  * isValidPhone helper method
  * @param (string) phone
  * @returns (Boolean) returns true or false
  */
  isValidPhone(phoneNumber) {
    if (isValidPhoneNumber(phoneNumber, 'NG') || isValidPhoneNumber(phoneNumber, 'GH')) {
      return true;
    }
    return false;
  },
  /**
  * Generate token method
  * @param (string) id
  * @returns (String) returns token
  */
  generateToken(person) {
    const token = jwt.sign({
      userId: person.id,
      firstName: person.first_name,
      lastName: person.last_name,
      email: person.email,
      role: person.role,
      phoneNumber: person.phone_number
    },
    secret, { expiresIn: '3d' });
    return token;
  }
};
