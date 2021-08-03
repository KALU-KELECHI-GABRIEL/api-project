import { pool } from '../models/pool';
import {
  insertMessages,
  dropMessagesTable,
  createUsersTable,
  createCoursesTable,
  createMessageTable,
  createCourseEnrollmentTable,
} from './queries';

export const executeQueryArray = async arr => new Promise(resolve => {
  const stop = arr.length;
  arr.forEach(async (q, index) => {
    await pool.query(q);
    if (index + 1 === stop) resolve();
  });
});

export const dropTables = () => executeQueryArray([ dropMessagesTable ]);
export const createTables = () => executeQueryArray([
  createMessageTable, createCoursesTable, createUsersTable, createCourseEnrollmentTable ]);
// export const createUserTables = () => executeQueryArray([ createMessageTable ]);
// export const createCourseTables = () => executeQueryArray([ createMessageTable ]);
export const insertIntoTables = () => executeQueryArray([ insertMessages ]);
