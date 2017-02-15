#!/usr/bin/env perl

package Meta;

use strict;
use warnings;

use HTML::Parser ();
use POSIX qw(strftime);


sub parse_html {
    my ($filename, $meal_ref) = @_;
    my %meal = %{$meal_ref};

    my $parser = HTML::Parser->new(
        api_version => 3,
        start_h => [\&start_handler, "tagname,attr"]
    );
    $parser->parse_file($filename) or
        print STDERR "html file $filename not exist!\n";
}

sub start_handler {
    my ($tagname, $attr) = @_;

    if ($tagname eq 'meta' && defined $attr->{name}) {
        if ($attr->{name} eq 'keywords') {
            $meta{tags} = $attr->{content};
        }
        elsif ($attr->{name} eq 'date') {
            if ($attr->{content} ne 'undefined') {
                $meta{date} = $attr->{content};
            }
        }
    }
}

sub parse_text {
    my ($filename, $meal_ref) = @_;
    my %meal = %{$meal_ref};
}

"perl module suck";
