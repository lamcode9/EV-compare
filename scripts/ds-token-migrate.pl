#!/usr/bin/env perl
# Design-system token migration: gray/emerald → ink/paper/brand.
# Order matters. Chart-data hex literals are intentionally left untouched.
# Usage: perl scripts/ds-token-migrate.pl <file> [<file> ...]
use strict; use warnings;
local $^I = '';            # in-place, no backup
while (my $line = <>) {
  # 1. brand family (no conflicts) — do first
  $line =~ s/\bemerald-/brand-/g;
  # 2. borders (opacity'd variants first, then solid)
  $line =~ s/border-gray-200\/60/border-ink\/10/g;
  $line =~ s/border-gray-300/border-ink\/15/g;
  $line =~ s/border-gray-200/border-ink\/10/g;
  $line =~ s/border-gray-100/border-ink\/5/g;
  $line =~ s/divide-gray-200/divide-ink\/10/g;
  $line =~ s/divide-gray-100/divide-ink\/5/g;
  # 3. text
  $line =~ s/text-gray-900/text-ink/g;
  $line =~ s/text-gray-800/text-ink-800/g;
  $line =~ s/text-gray-700/text-ink-700/g;
  $line =~ s/text-gray-600/text-ink-600/g;
  $line =~ s/text-gray-500/text-ink-500/g;
  $line =~ s/text-gray-400/text-ink-400/g;
  $line =~ s/text-gray-300/text-ink-300/g;
  # 4. backgrounds
  $line =~ s/bg-gray-50\b/bg-paper-200/g;
  $line =~ s/bg-gray-100/bg-paper-200/g;
  $line =~ s/bg-gray-200/bg-paper-300/g;
  $line =~ s/bg-gray-300/bg-ink\/15/g;
  $line =~ s/from-gray-50/from-paper-200/g;
  $line =~ s/to-white/to-paper-100/g;
  $line =~ s/bg-white(?![\/\w-])/bg-paper-100/g;
  # 5. radius
  $line =~ s/rounded-xl/rounded-card/g;
  print $line;
}
