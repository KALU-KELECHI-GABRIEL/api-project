import express from 'express';
import { Auth } from '../middleware';
import { Enrollment } from '../controllers';

const enrollmentsRouter = express.Router();

/**
GET ALL ENROLLMENTS FOR A COURSE ADMIN
*/
enrollmentsRouter.get('/users/:courseId', Auth.verifyAdmin, Enrollment.getEnrollments);
/**
GET ALL ENROLLMENTS FOR A USER USER
*/
enrollmentsRouter.get('/courses/:userId', Auth.verifyToken, Enrollment.getEnrollments);
/**
 * add the enroll for course endpoint
 */
enrollmentsRouter.post('/', Auth.verifyToken, Enrollment.enroll);
/**
 * add the enroll for course endpoint
 */
enrollmentsRouter.post('/:userId/:courseId', Auth.verifyAdmin, Enrollment.updateEnrollment);
/**
 * cancel an enrollment
 */
enrollmentsRouter.get('/:userId/:courseId', Auth.verifyToken, Enrollment.cancelEnrollment);
/**
 * Course Detail
 */
enrollmentsRouter.get('/detail/:userId/:courseId', Auth.verifyToken, Enrollment.courseDetail);

export default enrollmentsRouter;
