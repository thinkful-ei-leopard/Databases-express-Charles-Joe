function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_KEY
    const authToken = req.get('Authorization')

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'unauthorized request'})
    }

    next()
}


const addresses = [];

app.get('/address', (req, res) => {
    res.json(addresses)
})


app.post('/address', validateBearerToken, (req, res) => {
    const {
        firstName,
        lastName,
        address1,
        address2='no info',
        city,
        state,
        zip
      } = req.body


      if(!firstName || !lastName || !address1 || !city || !state || !zip) {
          return res
                    .status(400)
                    .send('all fields required except address2')
      }


      if(state.length !== 2) {
          return res
                .status(400)
                .send('state must only be 2 characters in length ex: CA, IL')
      }

      if(zip.length !== 5) {
          return res
                .status(400)
                .send('zip code must be 5 characters in length')
      }

      const id = uuid();
      const newAddress = {
          id,
          firstName,
          lastName,
          address1,
          address2,
          city,
          state,
          zip
      }

      addresses.push(newAddress)

    res
      .status(201)
      .location(`http:localhost:8000/address/${id}`)
      .json({id: id})
})

app.delete('/address/:id', validateBearerToken, (req, res) => {
    const indexOfAddress = addresses.findIndex(e => e.id === req.params.id)
    addresses.splice(indexOfAddress, 1)

    res
        .status(204)
        .end();
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.log(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})