export const createMessageTable = `
DROP TABLE IF EXISTS messages;
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR DEFAULT '',
  message VARCHAR NOT NULL
  )
  `;

export const insertMessages = `
INSERT INTO messages(name, message)
VALUES ('chidimo', 'first message'),
      ('orji', 'second message')
`;

export const createUsersTable = `
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id UUID NOT NULL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(150) NOT NULL,
  role VARCHAR(128) NOT NULL,
  phone_number VARCHAR(150) NOT NULL,
  active BOOLEAN NOT NULL,
  gender VARCHAR(30),
  created_date TIMESTAMP,
  modified_date TIMESTAMP
  )
  `;

export const createCoursesTable = `
DROP TABLE IF EXISTS courses;
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  detail TEXT NOT NULL,
  price MONEY NOT NULL,
  instructor TEXT NOT NULL,
  created_date TIMESTAMP,
  modified_date TIMESTAMP
  )
  `;

export const createCourseEnrollmentTable = `
DROP TABLE IF EXISTS enrollments;
CREATE TABLE IF NOT EXISTS enrollments (
  user_id   UUID REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
  course_id  int REFERENCES courses (id) ON UPDATE CASCADE,
  paid BOOLEAN NOT NULL,
  delivered BOOLEAN NOT NULL,
  date_enroled TIMESTAMP,
  date_delivered TIMESTAMP,
  date_paid TIMESTAMP,
  CONSTRAINT course_enrollment_pkey PRIMARY KEY (user_id, course_id)  -- explicit pk
  )
  `;
export const dropMessagesTable = 'DROP TABLE messages';
