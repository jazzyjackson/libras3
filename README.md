# libras3
A standalone self-serve file explorer for S3 buckets

Includes a class prototype override for the LibraryBlock of Mixininterface to allow handling of s3 buckets within a file manager interface.

Includes a number of node executables that take a JSON options object as their only argument - on argv[1], so execute the file directly, do not call 'node x.js'

Merges options object with config variables set in $APP_HOME/server.cfg

Still allows environment variables or IAM role to dictate permission to access s3 services.

Tools that report metadata return a JSON object
Tools that return raw data (getObject) writes the raw bytes to stdout. Sets the content type header if it can... maybe based on extension.

------

## You can POST a file to S3:

All the programs here are designed to take JSON object on stdin to provide all arguments

This is convenient for web API: just use JSON body in your fetch, like:
```js
fetch('/Users/colton.jackson/utilitybot/spiders/libras3/listObjects.js',{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({Key: 'some/path', Bucket: 'someBucket'})
})
```

And Key and Bucket will be read into the params object inside each script.

upload, listObjects, and getSignedUrl are thin wrappers around the named s3 aws sdk functions

downloadio takes {Bucket, Key} as input and the object text is the output (the buffer is written to stdout) so if made as a web request, you'll get the object contents

as a serverside script, this allows you to redirect the output to a file like so:
```sh
echo '{"Bucket":"bucket-name", "Key":"object/path/name.txt"}' | ./downloadio.js > newfile.txt
```

bulkDownload takes {Bucket, From, To} and downloads all the files with the pathname 'From' and writes them to 'To', appending each key name with 'To'
## You can get a signed URL by POST /libras3/signURL.js?args=thewholepathyouwanttodownload

## You can get the contents of a bucket: /libras3/lsbucket.js?args=thebucketyouwantthecontentsof

