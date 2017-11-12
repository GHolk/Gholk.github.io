#!/bin/sh

text_files="../text/*.txt"

egrep -oh '^#[^ ]+$$' $text_files  \
    | sort \
    | uniq -c \
    | sort -nr
