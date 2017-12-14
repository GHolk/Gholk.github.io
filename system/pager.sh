#!/bin/sh

html_path=$1

if [ -e $html_path ]
then exist_old_html=1
fi

if ! [ $exist_old_html ]
then cp template.html $html_path
fi

node updateHTML.js $html_path
node addToIndex.js $html_path
node add-to-atom.js $html_path

if ! [ $exist_old_html ]
then node updateRel.js $html_path
fi

