import express from 'express';
import { indexPage, messagesPage, addMessage } from '../controllers';

const indexRouter = express.Router();

indexRouter.get('/', indexPage);
/**
 * add the get messages endpoint
 */
indexRouter.get('/messages', messagesPage);
/**
 * post new messages endpoint
 */
indexRouter.post('/messages', addMessage);

export default indexRouter;
