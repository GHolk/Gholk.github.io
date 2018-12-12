#!/bin/sh

html_path=$1

if [ -e $html_path ]
then 
    node updateHTML.js $html_path
    echo "# to commit change:"
    echo "./update-atom.sh append $html_path"
else
    cp template.html $html_path
    node updateHTML.js $html_path
    node updateRel.js $html_path
    echo "# to commit change:"
    echo "./update-atom.sh create $html_path"
fi

