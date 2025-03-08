#!/bin/sh

HOST=ftp.jc-apps.fr
USER=jc-ap2399566
PASSWORD='t5J72Z9xe8' # Take care of $,%, etc. with single quoted String
DATE=$(date +%Y%m%d_%H%M)


ftp -inv $HOST <<EOF
user $USER $PASSWORD

cd SessionCoach

rename App App-$DATE
mkdir App
cd App
lcd dist
mput index.html

mkdir assets
lcd assets
cd assets
mput *.*

mkdir img
lcd img
cd img
mput *.*

bye
EOF

exit
