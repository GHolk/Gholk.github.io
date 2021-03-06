#!/bin/sh

add_style="$1"
html_path="$2"
text_path=../text/$(basename -s .html $html_path).txt

if [ $add_style = "append" ]
then
    if [ -t 0 ]
    then
        change_log=$(true | vipe)
    else
        change_log=$(cat)
    fi
    
    if [ $(echo "$change_log" | wc -l) -gt 1 ]
    then
        node update-to-atom.js $html_path "$change_log"
    else
        git diff $text_path | node update-to-atom.js $html_path "$change_log"
    fi
elif [ $add_style = "create" ]
then
    node add-to-atom.js $html_path
else
    echo "usage:
    ./$0 create path/to.html # add whole article
    ./$0 append path/to.html # add update log" >&2
    exit 22
fi


commit_message="[text] $(basename -s .txt $text_path | sed 's/-/ /g') $change_log"
git add $text_path $html_path ../atom.xml template.html list.txt
git commit -am "$commit_message"
