# DrEcco (2020)
## General game guidelines
All games that need to be uploaded on the website must implement the following
items:

1. The game must be submitted as a zip file, which unzips into a separate directory. (I will provide the script to unzip and add your game to the database, more on that in [Development Process](https://github.com/mustafafu/drecco#development-process).)
2. The main entry point to the game must be index.php. The CIMS server only runs PHP scripts, so your game's main page will have to be in PHP. From there, you can probably run the game via Javascript. (See the examples in /games/)

I have copied the current server and games over to this github repository. If you want to take a look at the code. I can also provide you a zip of the whole thing over email if you want. (mfo254 [at] nyu.edu )
You can see the current games in /games/ and use them for interface etc.

## Development Process
I think the best way to go about this is to build your own copy of Dr.Ecco website, following this guide. Then develop your game using your copy, test it play it etc.

### Setting up the database:
* Go to [CIMS guide](https://cims.nyu.edu/webapps/content/systems/userservices/databases) and follow instructions there and create a database.
  * create database called drecco, and your net id will be prepend as mfo254_drecco.

### Changing the required parts to run your web page and connect to database.
You need to change the base url according to your netid.
| File Path  | Lines to Change |
| ------------- | ------------- |
| ./index.php  | 4  |

|The rest is optional|Lines|
| ------------- | ------------- |
| ./dbman/main_login.php  |11  |
| ./dbman/signup.php  | 13  |
| ./dbman/verify_user.php  | 4  |
| ./dbman/js/login.js  | 2  |

You need to change the following files according to your username/db configuration.
| File Path  | Lines to Change |
| ------------- | ------------- |
| ./games/add_game.py  | 12,13,14  |
| ./games/p3_add_game.py  | 40,41,42  |
| ./dbconf.php  | 7,8,9  |
| ./create_tables.py  | 10,11,12  |

### Transferring the webpage to your cims account
Login to access.cims.nyu.edu
```
cd /web/$USER
git clone https://github.com/mustafafu/drecco.git
cd drecco/
```

### Creating Tables at the db
After the folders are pulled from github edit the create_tables.py with your db credentials.
Currently, you should have an empty db check https://cims.nyu.edu/phpMyAdmin/index.php .

Run :
```
python create_tables.py
```
which will create tables " game, loginAttenmpts,members,saves,scores" at your db.

### Updating folder and file permissions to public access
Make sure that all **required** files are in ``rw-r--r--`` mode and all folders are in ``rwxr-xr-x`` mode at a minimum. Please refrain from chmod -R . as this will exose your db credentials. 
```
chmod 755 .
chmod 755 -R css js images includes dbman
chmod 755 games #(without -R argument)
chmod 755 footer.php  getScore.php  header.php  index.php  info.php  leftMenuGame.php dbconf.php
```

### Adding a new game
Once we are done with the permission, we can add a game now. Create a \*.zip folder with the same name as game name and game path. (Without spaces please)
Go to ./games/ directory, edit the db credentials in p3_add_game.py script.

Now simply use the script to unzip and add your game to db. After this the script will take care of the necessary permissions.
```
python3 p3_add_game.py -gn <your_game_name> -gp <your_game_folder> 
```

You should be able to see your game in your own webpage.


## Updatind the Dr.Ecco page
After you are done with developing the game, you can send me \*.zip of your game folder which will unzip to a folder with **same name** (*without space* is preferred :smile: ). I will take care of the rest. I will host the game on my copy of [Dr.Ecco](https://cims.nyu.edu/~mfo254/hps/), make sure everything is good to go and finally update the real [Dr.Ecco](https://cims.nyu.edu/drecco2016/).
