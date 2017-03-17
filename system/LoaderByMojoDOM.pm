#!/usr/bin/env perl

package LoaderByMojoDOM;

use strict;
use warnings;

use Mojo::DOM;
use File::Slurp;
use POSIX qw(strftime);

sub load_file {
    my $filename = shift;
    my $html = read_file($filename);
    my $dom = Mojo::DOM->new($html);
    return $dom;
}

my $dom = load_file($ARGV[$#ARGV]);

sub date {
    $dom->at('meta[name=date]')->attr('content');
}

sub main {
    $dom->at('main')->content;
}

sub title {
    $dom->title;
}

"perl module suck";
