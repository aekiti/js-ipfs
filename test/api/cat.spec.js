/* eslint-env mocha */
/* globals apiClients */
'use strict'

const expect = require('chai').expect
const isNode = require('detect-node')
const fs = require('fs')
const streamifier = require('streamifier')

const path = require('path')
const streamEqual = require('stream-equal')

let testfile
let testfileBig

testfile = fs.readFileSync(path.join(__dirname, '/../testfile.txt'))
testfileBig = fs.readFileSync(path.join(__dirname, '/../15mb.random'))

describe('.cat', () => {
  it('cat', (done) => {
    apiClients.a
      .cat('Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP', (err, res) => {
        expect(err).to.not.exist

        let buf = ''
        res
          .on('error', (err) => {
            expect(err).to.not.exist
          })
          .on('data', (data) => {
            buf += data
          })
          .on('end', () => {
            expect(buf).to.be.equal(testfile.toString())
            done()
          })
      })
  })

  it('cat BIG file', (done) => {
    if (!isNode) {
      return done()
    }

    apiClients.a.cat('Qme79tX2bViL26vNjPsF3DP1R9rMKMvnPYJiKTTKPrXJjq', (err, res) => {
      expect(err).to.not.exist

      // Do not blow out the memory of nodejs :)
      const bigStream = streamifier.createReadStream(testfileBig)
      streamEqual(res, bigStream, (err, equal) => {
        expect(err).to.not.exist
        expect(equal).to.be.true
        done()
      })
    })
  })

  describe('promise', () => {
    it('cat', (done) => {
      return apiClients.a.cat('Qma4hjFTnCasJ8PVp3mZbZK5g2vGDT4LByLJ7m8ciyRFZP')
        .then((res) => {
          let buf = ''
          res
            .on('error', (err) => {
              throw err
            })
            .on('data', (data) => {
              buf += data
            })
            .on('end', () => {
              expect(buf).to.be.equal(testfile.toString())
              done()
            })
        })
    })
  })
})