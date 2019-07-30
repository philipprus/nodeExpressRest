import config, { KnownConfigKey } from './utils/config';
import { app } from './app';

config.init();
const port = +config.get(KnownConfigKey.ServerPort, '3002');
app.set('port', port);


const server = app.listen(app.get('port'), () => {
  console.log(
    ' App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env'),
  );
  console.log(' Press CTRL-C to stop\n');
});