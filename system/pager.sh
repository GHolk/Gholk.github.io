#!/bin/sh

html_path=$1

if [ -e $html_path ]
then 
    cp template.html $html_path
    node updateHTML.js $html_path
    echo "# to commit change:"
    echo "./update-atom.sh -a $html_path"
else
    node updateHTML.js $html_path
    echo "# to commit change:"
    echo "./update-atom.sh -c $html_path"
fi

