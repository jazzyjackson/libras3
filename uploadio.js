#!/usr/bin/env node
/******** UNTESTED, SPECULATIVE ********/
// streaming upload, good for large files up to 5GB
// using stdin as binary data stream
// parameters accepted as command line argument
// HTTP POST request to spiders/uploadio.js?args={Bucket, Key, ContentType...}  and Request Body set to bytes
const ini = require('ini')
const util = require('util')
const buffer = require('buffer')
const fs = require('fs')
const AWS = require('aws-sdk')

var config = ini.parse(fs.readFileSync((process.env['APPROOT'] || '.') + '/serverbase.cfg', 'utf-8'))
Object.assign(process.env, config.s3)
var s3 = new AWS.S3()

var params = JSON.parse(process.argv[2])

Object.assign(params, {Body: process.stdin})

// suppose it might be interesting to md5 hash it, count the time it takes to upload, or just return whatever amazon returns
s3.upload(params, (err,data) => {
    if(err) console.error(err)
    else console.log("success")
})
