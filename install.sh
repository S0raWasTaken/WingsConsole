#!/bin/bash

# Installation script for the WingsConsole
# Made by S0raWasTaken

# ----- Please do not execute this script before understanding what it does -----

# Checks if the user is running the script with superuser permissions
if [ "$EUID" -ne 0 ]; then
    echo "This is an installation script, please run it as a superuser"
    echo "Also, don't forget to read it first!"
    exit 2
fi

# ----- Begin installation of NodeJS v14 -----

# Running apt update for a safe install
apt update
# If curl isn't installed, it will be installed
apt install -y curl

# Adding NodeJS v14 repo
curl -sL https://deb.nodesource.com/setup_14.x | bash -

# Installing
apt install -y nodejs
# ----- End installing NodeJS v14


# ----- Cloning the github repo

# If git isn't installed, it will be installed
apt install -y git
git clone https://github.com/S0raWasTaken/WingsConsole.git

# Move the cloned repo to the home directory
# Hidden folder, but can be accessed using "cd ~/.WingsConsole"
mv WingsConsole ~/.WingsConsole

cd ~/.WingsConsole

# Removes install.sh after cloning the repo
rm ~/.WingsConsole/install.sh

echo "----- Setting up dependencies... -----"

# Running npm i --save to setup the dependencies
npm i --save

# ----- Begin setting up the custom terminal command -----
echo "Default command is \"console\". Would you like to change it?"
echo "Y/N"
read conf

# If the user wants a custom command
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
# ----- Finish setting up the custom command -----

# Final steps
echo ""
echo "Your installation can be found on ~/.WingsConsole"
echo "Please edit the config.yml in it before running the command"
echo "~~ Tip: nano ~/.WingsConsole/config.yml ~~"
echo ""
echo "Your custom command is located in /usr/local/bin"
echo "You can simply change the custom command by changing the file name"
echo "~~ Tip: mv /usr/local/bin/YOUR_OLD_COMMAND /usr/local/bin/YOUR_NEW_COMMAND ~~"

