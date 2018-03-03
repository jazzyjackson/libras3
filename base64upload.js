#!/usr/bin/env node
const ini = require('ini')
const util = require('util')
const buffer = require('buffer')
const fs = require('fs')
const AWS = require('aws-sdk')

var config = ini.parse(fs.readFileSync((process.env['APPROOT'] || '.') + '/serverbase.cfg', 'utf-8'))
Object.assign(process.env, config.s3)
var s3 = new AWS.S3()
// this is a little clunky because the entire file text is going to be wrapped in a single JSON object piped to stdin
// so we collect the chunks, parse the result, and only then upload to Amazon
// it would be quite nice to just pass process.stdin to the upload function,
// but I need to collect Bucket and Key name from client as well
// it would be pretty easy to pass keyname as args (process.argv[1]) and then pipe body
// and I think that's a better way to handle it, but would be an inconsistent API
// involving sticking parameters in the request URL instead of the options object of fetch
var buffers = []
process.stdin.on('data', data => buffers.push(data))
process.stdin.on('end', () => {
    var params = JSON.parse(Buffer.concat(buffers).toString())
    // convert body to buffer
    params.Body = new Buffer(params.Body, 'base64')
    // params better be {Bucket, Key, Body}
    s3.upload(params, (err,data) => {
        if(err) console.error(JSON.stringify({error: err}))
        else console.log(JSON.stringify({status: 'ok', data }))
        process.exit()
    })
})
