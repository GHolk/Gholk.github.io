#!/bin/sh

add_style="$1"
html_path="$2"
text_path=../text/$(basename -s .html $html_path).txt

if [ $add_style = "-a" ]
then
    change_log=$(true | vipe)
    if [ $(echo "$change_log" | wc -l) -gt 1 ]
    then
        node update-to-atom.js $html_path "$change_log"
    else
        git diff $text_path | node update-to-atom.js $html_path "$change_log"
    fi
elif [ $add_style = "-c" ]
then
    node add-to-atom.js $html_path
else
    echo "argument:
    -a add update log
    -c add whole article log" >&2
    exit 22
fi


commit_message="[text] $(basename -s .txt $text_path | sed 's/-/ /g') $change_log"
git add $text_path $html_path ../atom.xml template.html
git commit -m "$commit_message"
