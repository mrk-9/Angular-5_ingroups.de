// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //serverUrl: 'http://localhost:4200',
  serverUrl: 'http://localhost/ingroupstom/api/public',
  apiUrl: 'http://localhost/ingroupstom/api/public/api',

  PUSHER_APP_KEY: '94252f3d48a1de771d1a',
  PUSHER_APP_CLUSTER: 'ap1',
  
  googleMapApiKey: 'AIzaSyAs3JOLbnldgNbUa7RKmbXoQvjqgxbYqPM'
};
