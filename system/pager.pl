#!/usr/bin/perl

use strict;
use warnings;

my %filename = (
    template => "system/template.html"
);

my %text = (
    template => do {
    open(my $fh, $filename{'template'}) or
        die "can't open html template: $filename{'template'}\n$!";

    local $/ = undef;
    <$fh>;
    }
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
}

my %meal = (
    main => 'THE MAIN'
);

template_engine(\%meal);

