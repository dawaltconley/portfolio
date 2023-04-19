#!/bin/sh

lfs_version="$1"

if command -v git-lfs &> /dev/null \
  && [ "$(git lfs --version | cut -c9-13)" = "$lfs_version" ]
then
  echo "using cached binary for git lfs"
  git lfs --version
  git lfs install
else
  echo "installing git lfs $lfs_version"
  tmpdir="$(mktemp -d)"
  curl -JL "https://github.com/git-lfs/git-lfs/releases/download/v$lfs_version/git-lfs-linux-amd64-v$lfs_version.tar.gz" \
    -o "$tmpdir/git-lfs.tar.gz"
  tar xzf "$tmpdir/git-lfs.tar.gz" -C "$tmpdir"
  "$tmpdir/git-lfs-$lfs_version/install.sh" || "$tmpdir/install.sh"
fi
