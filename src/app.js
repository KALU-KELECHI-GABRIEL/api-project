import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import coursesRouter from './routes/courses';
import enrollmentsRouter from './routes/enrollments';
// import bodyParser from 'body-parser';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json())
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );
app.use(cookieParser());
app.use(cors());
app.use('/v1', indexRouter);
app.use('/v1/users', usersRouter);
app.use('/v1/courses', coursesRouter);
app.use('/v1/enrollments', enrollmentsRouter);
app.use((err, req, res) => {
  res.status(400).json({ error: err.stack });
});
export default app;
