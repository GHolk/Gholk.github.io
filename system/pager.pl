#!/usr/bin/perl

use strict;
use warnings;

use File::Basename qw(dirname);
use Cwd  qw(abs_path);
use lib dirname abs_path $0;
use Meta;

my %filename = (
    template => "template.html",
    html => $ARGV[0],
);

sub template_engine {

    my $meal_ref = shift;
    my %meal = %{$meal_ref};
    #, %filename = %{$filename_ref};

    open my $template_fh, $filename{'template'} or
        die "can't open html template: $filename{'template'}\n$!";

    while (<$template_fh>) {
        s/\{\{(.*)\}\}/$meal{$1}/g;
        print;
    }

    close $template_fh;
}

my %meal = %{Meta::parse($filename{html})};
$meal{main} = 'this is main';

template_engine(\%meal);

