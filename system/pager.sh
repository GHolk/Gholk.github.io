#!/bin/sh

text_path=$1
html_path=$2

if [ -e $html_path ]
then 
    node updateHTML.js $html_path
    change_log=$(true | vipe)
    if [ $(echo "$change_log" | wc -l) -gt 1 ]
    then
        node update-to-atom.js $html_path "$change_log"
    else
        git diff $text_path | node update-to-atom.js $html_path "$change_log"
    fi
else
    cp template.html $html_path
    node add-to-atom.js $html_path
    node updateRel.js $html_path
fi

commit_message="[text] $(basename -s .txt $text_path | sed 's/-/ /g') $change_log"
git commit -a -m "$commit_message" $text_path $html_path
