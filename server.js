const Hapi = require('hapi')
const xmlbuilder = require('xmlbuilder')

// When to say what
const entrySayActionXMl = xmlbuilder
  .create('Response')
  .ele('GetDigits', { timeout: '30', finishOnKey: '#', callbackURL: '' })
  .ele(
    'Say',
    { voice: 'woman' },
    'Hi, welcome to the Africas Talking Freelance Developer Program demo app. We have a little question for you. How old is Africas Talking? Dial in your guess and press hash'
  )
  .end({ pretty: true })

const successSayActionXMl = xmlbuilder
  .create('Response')
  .ele(
    'Say',
    { voice: 'woman' },
    'Awesome! You got it right! Africas Talking has been around for almost a decade!'
  )
  .end({ pretty: true })

const errorHighSayActionXML = xmlbuilder
  .create('Response')
  .ele(
    'Say',
    { voice: 'woman' },
    'Hi, sorry, thats not quite it. Guess a little lower. Call back to try again. Goodbye.'
  )
  .end({ pretty: true })

const errorLowSayActionXML = xmlbuilder
  .create('Response')
  .ele(
    'Say',
    { voice: 'woman' },
    'Hi, sorry, thats not quite it. Guess a little higher. Call back to try again. Goodbye.'
  )
  .end({ pretty: true })

const errorSayActionXML = xmlbuilder
  .create('Response')
  .ele(
    'Say',
    { voice: 'woman' },
    'Hi, sorry, thats not quite it. Something is wrong with the input you provided. Call back to try again. Goodbye.'
  )
  .end({ pretty: true })

const init = async () => {
  const server = Hapi.Server({
    port: 3000,
    host: 'localhost'
  })

  server.route({
    method: 'POST',
    path: '/',
    handler: async (req, h) => {
      callAction = entrySayActionXMl
      return h.response(callAction)
    }
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: async (req, h) => {
      return h.response('Everything is okay').code(201)
    }
  })

  server.route({
    method: 'POST',
    path: '/voice/say',
    handler: async (req, h) => {
      try {
        digits = parseInt(req.payload.dtmfDigits)
        // Adding checks and tasks
        if (digits == 9) {
          return h.response(successSayActionXMl)
        } else if (digits < 9) {
          return h.response(errorLowSayActionXML)
        } else if (digits > 9) {
          return h.response(errorHighSayActionXML)
        } else {
          return h.response(errorSayActionXML)
        }
      } catch (e) {
        h.response(e).code(500)
      }
    }
  })

  await server.start()
  console.log(`Server running on port: ${server.info.uri}`)
}

process.on('unhandledRejection', error => {
  console.log(`Houston, we have a problem: ${error}`)
  process.exit(1)
})

init()
