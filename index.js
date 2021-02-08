const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/key.js');

const app = express()
const port = 5000

const { Client: Client6 } = require(config.elastic_version)
const client = new Client6({ node: {
  url: new URL(config.elastic_address[config.elastic_version]),
  headers: { 'custom': 'headers' },
  auth: {
    username: config.default_elastic_id,
    password: config.default_elastic_password
  }
} })

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!!!!!!!!!!!')
})

app.post('/register', (req, res) => {
  //회원가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣는다.
  var qObj = req.body;
  console.log(qObj);

  run(qObj);

  res.status(200).json({
    qObj: qObj
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

async function run({searchword,fieldname}) {
  await client.index({
    index: 'mariatest',
    type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
    body: {
      name: searchword,
      lastname: fieldname
    }
  })
}

run().catch(console.log);