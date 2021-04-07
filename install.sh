#!/bin/bash

# Installation script for the WingsConsole
# Made by S0raWasTaken

# Please do not execute this script before understanding what it does

# Check if the user is running the script with superuser permissions
if [ "$EUID" -ne 0 ]; then
    echo "This is an installation script, please run it as a superuser"
    echo "Also, don't forget to read it first!"
    exit 2
fi

# Begin installation of NodeJS v14

apt update # running apt update for a safe install
apt install -y curl # if curl isn't installed, it will be installed

curl -sL https://deb.nodesource.com/setup_14.x | bash -

apt install -y nodejs

# Cloning git repo

apt install -y git # if git isn't installed, it will be isntalled
git clone https://github.com/S0raWasTaken/WingsConsole.git

mv WingsConsole ~/.WingsConsole # Move the cloned repo to the home directory

cd ~/.WingsConsole
echo "Setting up dependencies..."

# Running npm i --save to setup the dependencies

npm i --save

# Setting up the command to summon the app

echo "Default command is \"console\". Would you like to change it?"
echo "Y/N"
read conf

# In case the user wants a custom command
if [ $conf == "y" ]; then
    echo "Which command would you prefer?"
    echo "Minimum length: 3"
    echo "Maximum length: 20"
    read cmd
    size=$(printf "%s" "$cmd" | wc -m)
    if [ 3 -gt $size ]; then
        echo "The command that you input is less than 3 characters long"
        echo "Aborting..."
	exit 2
    fi
    if [ $size -gt 20 ]; then
        echo "The command that you input is longer than 20 characters"
	echo "Aborting..."
	exit 2
    fi
fi

# Creating the command in /usr/local/bin"
# Testing to see if somehow /usr/local/bin is not a directory
if [ -d "/usr/local/bin" ]; then
    echo "Working..."
else
    echo "It seems that the path /usr/local/bin doesn't exist"
    echo "This script will not work"
    echo "Aborting..."
    exit 2
fi

if [ -z "$cmd" ]; then
    echo "cd ~/.WingsConsole; node ." >> "/usr/local/bin/console"
    chmod +x "/usr/local/bin/console"

    echo "Installation complete!"
else
    echo "cd ~/.WingsConsole; node ." >> "/usr/local/bin/$cmd"
    chmod +x "/usr/local/bin/$cmd"

    echo "Installation complete!"
fi
echo ""
echo "Your installation can be found on ~/.WingsConsole"
echo "Please edit the config.yml in it before running the command"
echo "~~ Tip: nano ~/.WingsConsole/config.yml ~~"

echo " command was defined in /usr/local/bin"
