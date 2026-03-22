import app from './app';

const port = Number(process.env.PORT || 8787);

app.listen(port, () => {
  console.log(`cv-standardizer backend listening on ${port}`);
});
