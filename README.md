# libras3
A standalone self-serve file explorer for S3 buckets

Includes a class prototype override for the LibraryBlock of Mixininterface to allow handling of s3 buckets within a file manager interface.

Includes a number of node executables that take a JSON options object as their only argument - on argv[1], so execute the file directly, do not call 'node x.js'

Merges options object with config variables set in $APP_HOME/server.cfg

Still allows environment variables or IAM role to dictate permission to access s3 services.

Tools that report metadata return a JSON object
Tools that return raw data (getObject) writes the raw bytes to stdout. Sets the content type header if it can... maybe based on extension.


