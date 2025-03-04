#!/bin/sh

HOST=ftp.jc-apps.fr
USER=jc-ap2399566
PASSWORD='t5J72Z9xe8' # Take care of $,%, etc. with single quoted String
DATE=$(date +%Y%m%d_%H%M)


ftp -inv $HOST <<EOF
user $USER $PASSWORD

cd SessionCoach

rename Admin Admin-$DATE
mkdir Admin
cd Admin
lcd dist
mput index.html
mput config.json

mkdir pages
lcd pages
cd pages
mput *.*
cd ..
lcd ..

mkdir assets
lcd assets
cd assets
mput *.*

mkdir i18n
lcd i18n
cd i18n
mput *.*
cd ..
lcd ..


mkdir metadata
lcd metadata
cd metadata
mput *.*
cd ..
lcd ..

bye
EOF

exit
