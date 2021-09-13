const express = require('express');
const app = express();
const port = 8888;


//router handler
app.get('/', (req, res) => {
  const data = {
    name: 'Michael',
    isAwesome: true,
  };

  res.json(data);
});

app.get('/awesome-generator', (req, res) => {
  const { name, isAwesome } = req.query;
  res.send(`${name} is ${JSON.parse(isAwesome) ? 'really' : 'not'} awesome`);
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});



// every route in express is writen like this:
// app.METHED(PATH, HANDLER);

