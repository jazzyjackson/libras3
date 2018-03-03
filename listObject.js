#!/usr/bin/env node
const ini = require('ini')
const util = require('util')
const fs = require('fs')
const AWS = require('aws-sdk')

var config = ini.parse(fs.readFileSync((process.env['APPROOT'] || '.') + '/serverbase.cfg', 'utf-8'))
process.env.AWS_ACCESS_KEY_ID = config.s3.AWS_ACCESS_KEY_ID
process.env.AWS_SECRET_ACCESS_KEY = config.s3.AWS_SECRET_ACCESS_KEY
// Object.assign(process.env, config.s3)
var s3 = new AWS.S3()

process.stdin.on('data', line => {
    let params = JSON.parse(line.toString())
    // params should be {Bucket, Prefix, MaxKey}
    s3.listObjectsV2(params, function(err, data){
        if(err) return process.stderr.write(util.inspect(err), () => process.exit())
        else process.stdout.write(JSON.stringify(data.Contents), () => process.exit())
    })
})
