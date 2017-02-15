#!/usr/bin/perl

use strict;
use warnings;

use File::Basename qw(dirname);
use Cwd  qw(abs_path);
use lib dirname abs_path $0;
use Meta;
use Text::Markdown;

my %filename = (
    template => "template.html",
    html => $ARGV[1],
    text => $ARGV[0],
);

my %meal;
my $meal_ref = \%meal;

Meta::parse_html($filename{html}, $meal_ref) if -e $filename{html};
Meta::parse_text($filename{text}, $meal_ref);

template_engine($filename{template}, \%meal);

sub template_engine {

    my ($filename, $meal_ref) = @_;
    my %meal = %{$meal_ref};

    open my $template_fh, $filename or
        die "can't open html template: $filename\n$!";

    while (<$template_fh>) {
        s/\{\{(.*)\}\}/$meal{$1}/g;
        print;
    }

    close $template_fh;
}

