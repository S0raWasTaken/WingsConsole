# WingsConsole
## An easy way to connect to your Pterodactyl servers without opening the web panel


### Setting up and running:

- This project was made using NodeJS 14, I don't know if it works in other versions below it

Install NodeJS from the [official website](https://nodejs.org/en/download/)
<br>
or if you're a linux user (Ubuntu/Debian based distros):
```sh
sudo apt update

curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -

sudo apt install nodejs -y
```

Clone this repository or pick a release and run:
```sh
npm i --save
```

Now you can start it using:
```sh
node .
```


## Built-in Commands

> Every built-in command is prefixed with `;`

Command list:
- **;logs**
  - Pulls logs from the console
- **;stats**
  - Sends server status, things like RAM and CPU usage
- **;power [start/stop/restart/kill]**
  - Does exactly what you think
- **;server [list/server]**
  - shows the server list or connects you to a new server


## Install Script  
As you can see, there is an install script for this project, so that  
you can easily install it in your system and just run it with a custom  
command on terminal.  

- **PLEASE READ AND UNDERSTAND THE INSTALL.SH BEFORE EXECUTING IT**  
I left comments inside it, so you can easily know what's going on  

*Also make sure your package manager is **apt**, because if it's not, it won't work*

 - Simply download it and run using  
 ```sh  
# Make sure you have cURL installed, else run "sudo apt install curl"  
 
sh -c "$(curl -fsSL https://raw.githubusercontent.com/S0raWasTaken/WingsConsole/master/install.sh)"  
# Do not run this command with "sudo" or as a root user, unless you know what you're doing
```  

> Please contact me on Discord if any errors occur running this script  
> Or leave an issue in the Issues page  
> `S0ra#2255`  

## Uninstallation Process

### If you are on linux and installed it using the install script:
- Delete the folder ~/.WingsConsole
```sh
rm -r ~/.WingsConsole
```
- Delete the custom command in /usr/local/bin
  - Do not delete the entire folder tho
```sh
# Your custom command file by default should be "console" unless you specified another name for it
# So, by default:
sudo rm /usr/local/bin/console
# If you did specify another name for it:
sudo rm /usr/local/bin/COMMAND_NAME
```
- And you're done!
- Also if you want to remove nodejs from your system:
```sh
sudo apt remove nodejs
```

### If you didn't install it using the install script:
> Same applies to Windows users
- Simply delete your installation folder

- If you want to uninstall nodejs:
  - Linux users:
  ```sh
  sudo apt remove nodejs
  ```
  - Windows users:
    - Open your file manager
    - Go to C:\Program Files (or D:\ depending if you installed it on a separate disk or partition)
    - Locate the "nodejs" folder
    - Delete it 
