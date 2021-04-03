# WingsConsole
## Easy way to connect to your Pterodactyl servers without opening the web panel


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


### Built-in Commands

#### Every built-in command is prefixed with `;`

Command list:
- **;logs**
  - Pulls logs from the console
- **;stats**
  - Sends server status, things like RAM and CPU usage
- **;power [start/stop/restart/kill]**
  - Does exactly what you think