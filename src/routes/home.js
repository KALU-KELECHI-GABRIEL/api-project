import express from 'express';
import { modifyMessage, performAsyncAction } from '../middleware';
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
indexRouter.post('/messages', modifyMessage, performAsyncAction, addMessage);

export default indexRouter;
