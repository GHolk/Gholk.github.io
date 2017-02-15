#!/usr/bin/env perl

package Meta;

use strict;
use warnings;

use HTML::Parser ();
use POSIX qw(strftime);

my $VERSION = 1;
my %meta = (
    date => strftime("%Y-%m-%d", localtime()),
    tags => '',
);


sub parse {
    my $filename = shift;

    my $parser = HTML::Parser->new(
        api_version => 3,
        start_h => [\&start_handler, "tagname,attr"]
    );
    $parser->parse_file($filename) or
        print STDERR "html file $filename not exist!\n";

    return \%meta;
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

"perl module suck";
