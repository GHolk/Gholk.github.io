#!/bin/sh

html_path=$1

if [ -e $html_path ]
then 
    cp template.html $html_path
fi
node updateHTML.js $html_path

