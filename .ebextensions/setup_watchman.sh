#!/bin/bash

yum install -y autoconf automake libtool

git clone https://github.com/facebook/watchman.git
cd watchman
git checkout v4.7.0  # the latest stable release
./autogen.sh
./configure
make
sudo make install
cd /usr/bin
sudo ln -s /usr/local/bin/watchman watchman
