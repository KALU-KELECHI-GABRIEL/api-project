import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { dbHelper, sendEmail } from '../helper/index';
import Model from '../models/model';

const enrollmentsModel = new Model('enrollments');

export const Enrollment = {
  /**
  * Enroll for a course
  * @param (object) req
  * @param (object) res
  * @returns (object) user object
  */
  async enroll(req, res) {
    const {
      userId, courseId
    } = req.body;
    console.log(req.body);
    if (!userId || !courseId) {
      return res.status(400).send({
        message: 'Some Form values are missing'
      });
    }

    const columns = 'user_id, course_id, paid, delivered, date_enroled';
    const values = ` '${userId}', '${courseId}', 'false', 'false', '${moment(new Date())}'`;
    try {
      const data = await enrollmentsModel.insertWithReturn(columns, values);
      return res.status(200).send({
        result: data.rows,
        message: 'You  successfully Enroled for this course'
      });
    } catch (err) {
      if (err.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'you have already beign enroled for this course' });
      }
      return res.status(400).json({ error: err });
    }
  },
  /**
  * Update Enrollment to paid or delivered
  * @param (object) req
  * @param (object) res
  * @returns (object) user object
  */
  async updateEnrollment(req, res) {
    const { courseId, userId } = req.params;
    const {
      delivered, paid
    } = req.body;
    // console.log(req.body, req.params);

    if ((!delivered && !paid) || (delivered && paid)) {
      return res.status(400).send({
        message: 'form has no values or form has both paid and delivered fields'
      });
    }
    let update = '';
    if (delivered) {
      update += `\n SET delivered = '${delivered}'`;
      const setDelivered = (delivered === 'true');
      if (setDelivered) {
        update += `, date_delivered = '${moment(new Date())}'`;
      }
    }
    if (paid) {
      update += `\n SET paid='${paid}'`;
      const setPaid = (paid === 'true');
      if (setPaid) {
        update += `, date_paid = '${moment(new Date())}'`;
      }
    }
    const clause = ` \n WHERE user_id = '${userId}'\n AND course_id = '${courseId}' RETURNING *`;
    try {
      const data = await enrollmentsModel.updateWithReturn(update, clause);
      // console.log(data);
      return res.status(200).send({
        result: data.rows[0],
        message: 'updated Successfully'
      });
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  },
  /**
  * Get all enrollments based on role
  * @param (object) req
  * @param (object) res
  * @returns (object) user object
  */
  async getEnrollments(req, res) {
    const { courseId, userId } = req.params;
    if (!userId && !courseId) {
      return res.status(400).send({
        message: 'Endpoint is not valid'
      });
    }
    let message = '';
    let columns = '';
    let clause = '';
    if (courseId) {
      columns = ' * ';
      clause = ` INNER JOIN courses ON enrollments.course_id = courses.id
                 INNER JOIN users ON enrollments.user_id = users.id
                 WHERE course_id = ${courseId}   `;
      message = 'Enrolled students listed';
    }
    if (userId) {
      columns = ' * ';
      clause = ` INNER JOIN courses ON enrollments.course_id = courses.id
                 INNER JOIN users ON enrollments.user_id = users.id
                 WHERE user_id = '${userId}'   `;
      message = 'Enrolled courses listed';
    }
    try {
      const data = await enrollmentsModel.select(columns, clause);
      return res.status(200).send({
        result: data.rows,
        message
      });
    } catch (err) {
      if (err.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'some error encountered' });
      }
      return res.status(400).json({ error: err });
    }
  },

  /**
  * Cancel an Enrollment to a course
  * @param (object) req
  * @param (object) res
  * @returns (object) user object
  */
  async cancelEnrollment(req, res) {
    const { courseId, userId } = req.params;

    console.log(req.params);
    if (!courseId && !userId) {
      return res.status(400).send({
        message: 'endpoint not valid'
      });
    }
    const columns = ' * ';
    let clause = ` INNER JOIN courses ON enrollments.course_id = courses.id
               INNER JOIN users ON enrollments.user_id = users.id
               WHERE user_id = '${userId}' AND course_id = ${courseId}  `;
    const course = await enrollmentsModel.select(columns, clause);
    // console.log(course.rows[0]);
    if ((course.rows[0].paid === false) && (course.rows[0].delivered === false)) {
      clause = ` \n WHERE user_id = '${userId}' AND course_id = '${courseId}' RETURNING *`;
      try {
        const data = await enrollmentsModel.delete(clause);
        return res.status(200).send({
          result: data.rows[0],
          message: 'Course Enrollment has been cancelled Successfully'
        });
      } catch (err) {
        if (err.routine === '_bt_check_unique') {
          return res.status(400).send({ message: 'Course with that title already exist' });
        }
        return res.status(400).json({ error: err });
      }
    }
    return res.status(200).send({ message: 'Cannot Cancel an already paid Course' });
  },
  /**
  * Cancel an Enrollment to a course
  * @param (object) req
  * @param (object) res
  * @returns (object) user object
  */
  async courseDetail(req, res) {
    const { courseId, userId } = req.params;

    // console.log(req.params);
    if (!courseId && !userId) {
      return res.status(400).send({
        message: 'endpoint not valid'
      });
    }
    const columns = ' * ';
    const clause = ` INNER JOIN courses ON enrollments.course_id = courses.id
               INNER JOIN users ON enrollments.user_id = users.id
               WHERE user_id = '${userId}' AND course_id = ${courseId}  `;
    try {
      const data = await enrollmentsModel.select(columns, clause);
      return res.status(200).send({
        result: data.rows[0],
        message: 'Course detail'
      });
    } catch (err) {
      if (err.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'Try again later' });
      }
      return res.status(400).json({ error: err });
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
      const data = await enrollmentsModel.select(columns);
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
