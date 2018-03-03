#!/usr/bin/env node

/*
Input object is {Bucket, From, To}

Lists everything with 'from' as a prefix, 
downloads each object into the directory prescribed by 'To'
*/

const ini = require('ini')
const util = require('util')
const path = require('path')
const fs = require('fs')
const AWS = require('aws-sdk')

var config = ini.parse(fs.readFileSync((process.env['APPROOT'] || '.') + '/serverbase.cfg', 'utf-8'))
process.env.AWS_ACCESS_KEY_ID = config.s3.AWS_ACCESS_KEY_ID
process.env.AWS_SECRET_ACCESS_KEY = config.s3.AWS_SECRET_ACCESS_KEY
// Object.assign(process.env, config.s3)
var s3 = new AWS.S3()
// this is a little clunky because the entire file text is going to be wrapped in a single JSON object piped to stdin
// so we collect the chunks, parse the result, and only then upload to Amazon
// it would be quite nice to just pass process.stdin to the upload function,
// but I need to collect Bucket and Key name from client as well
// it would be pretty easy to pass keyname as args (process.argv[1]) and then pipe body
// and I think that's a better way to handle it, but would be an inconsistent API
// involving sticking parameters in the request URL instead of the options object of fetch
// params better be {Bucket, From, To}
// params should be {Bucket, Prefix, MaxKey}
var params = {
    Bucket: config.s3.BUCKET_NAME,
    Prefix: config.s3.PREFIX,
    MaxKeys: 10
}
console.log(params)
process.argv.slice(2).forEach(arg => {
    s3.listObjectsV2(params, function(err, data){
        if(err) process.exit(console.error(err))
        // would be nice to put a guard here, a default MaxKeys, just do 10 files by default, or else you could accidently fill your disk downloading a gigabyte of crap
        data.Contents.forEach(result => {
            var objParam = {
                Bucket: params.Bucket,
                Key: result.Key 
            }
            console.log(objParam)
            // s3.getObject(objParam, (err,data) => {
            //     if(err) console.error(err)
            //     else fs.writeFile(newFilePath, data.Body)
            // })
        })
    })
})


