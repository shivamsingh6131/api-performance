import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import logger from './utils/helpers/logger';

//Load all Env data from config file.
require('./config/config');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//adding routes
routes(app);

const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log(`${process.env.NODE_ENV || 'dev'} Server is running on http://localhost:${PORT}`);
  logger.info(`${process.env.NODE_ENV || 'dev'} Server is running on http://localhost:${PORT}`);
});
export default app;
