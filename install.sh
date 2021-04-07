#!/bin/bash

# Installation script for the WingsConsole
# Made by S0raWasTaken

# You need Super User privileges to run this script, though IT SHOULD NOT BE EXECUTED AS ROOT
# ----- Please do not execute this script before understanding what it does -----

# Checks if the user is running the script with superuser permissions
if [ "$EUID" -eq 0 ]; then
    echo "please do not run this script with sudo or with root privileges"
    echo "if you still want to run this script as root, remove the lines 10 to 14 in the install.sh"
    exit 2
fi

echo "Although this script shouldn't be running as SuperUser, it will ask you for your permission to install packages"
echo "and write a file in /usr/local/bin"
echo ""
echo "The following packages will be installed after your confirmation (If already not installed):"
echo "curl, nodejs, git, WingsConsole"

# ----- Begin installation of NodeJS v14 -----

# Running apt update for a safe install
sudo apt update
# If curl isn't installed, it will be installed
sudo apt install -y curl

# Adding NodeJS v14 repo
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -

# Installing
sudo apt install -y nodejs
# ----- Finish installing NodeJS v14 -----


# ----- Cloning the github repo -----

# If git isn't installed, it will be installed
sudo apt install -y git

cd ~
git clone https://github.com/S0raWasTaken/WingsConsole.git

# Move the cloned repo to the home directory
# Hidden folder, but can be accessed using "cd ~/.WingsConsole"
mv WingsConsole ~/.WingsConsole

cd ~/.WingsConsole

# Removes install.sh after cloning the repo
rm ~/.WingsConsole/install.sh

# ----- Finish cloning the github repo -----

# ----- Setting up depencencies -----
echo "----- Setting up dependencies... -----"

# Running npm i --save to setup the dependencies
npm i --save

# ----- Finish setting up dependencies -----

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

# Testing if somehow /usr/local/bin is not a directory (Usually when using raw Termux)
if [ -d "/usr/local/bin" ]; then
    echo "Working..."
else
    echo "It seems that the path /usr/local/bin doesn't exist"
    echo "This script will not work"
    echo "Aborting..."
    exit 2
fi


# Creating the custom command
if [ -z "$cmd" ]; then

    # Creating the file
    sudo echo "cd ~/.WingsConsole; node ." >> "/usr/local/bin/console"
    
    # Giving execution permissions to the file
    sudo chmod +x "/usr/local/bin/console"

    echo "Installation complete!"
else
    # Creating the file
    sudo echo "cd ~/.WingsConsole; node ." >> "/usr/local/bin/$cmd"
    
    # Giving execution permissions to the file
    sudo chmod +x "/usr/local/bin/$cmd"

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

