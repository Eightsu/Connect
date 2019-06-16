
//Imports
const express = require('express');

//Declarations
const app = express();

// environment Variables
const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => res.send('API RUNNING'));

app.listen(PORT, () => {
	console.log(` coming in hot @ ${PORT}`);
});