import fs from 'fs';
import https from 'https';
import app from './app';

const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || 'localhost';
const httpsKeyFile = process.env.HTTPS_KEY_FILE;
const httpsCertFile = process.env.HTTPS_CERT_FILE;

if (httpsKeyFile && httpsCertFile) {
  const server = https.createServer(
    {
      key: fs.readFileSync(httpsKeyFile),
      cert: fs.readFileSync(httpsCertFile)
    },
    app
  );

  server.listen(port, host, () => {
    console.log(`cv-standardizer backend listening on https://${host}:${port}`);
  });
} else {
  app.listen(port, host, () => {
    console.log(`cv-standardizer backend listening on http://${host}:${port}`);
  });
}
