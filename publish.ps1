yarn build
pushd .\build
aws s3 sync . s3://alterscript.io --delete --acl public-read
popd