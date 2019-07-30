import express from 'express';
import cors from 'cors';
import expressWinston from 'express-winston';
import { joiError } from './utils/error';
import controllers from './controllers';
import { createExpressWinstonOptions } from './utils/logger';
import error from './middleware/error';
import { initPassport } from './utils/passport';

initPassport();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// express-session
// app.use(session({
//   resave:true,
//   saveUninitialized:true,
//   secret:SESSION_SECRET,
//   store:newMongoStore({
//     url:mongoUrl,
//     autoReconnect:true
//   }),
// }));
// app.use(passport.initialize());
// app.use(passport.session());


controllers.forEach(o => app.use(`/api${o.prefix}`, o.router));

app.use(joiError);

// app.use(expressWinston.errorLogger(createExpressWinstonOptions());

app.use(error);

export {
  app,
};
