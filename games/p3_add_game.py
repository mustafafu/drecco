'''
For add_game.py:
	it can only be used in games/ sub folder. default arguments for connecting the database has been written into it, which can be easily changed if rebased.
	differences between -gn and -gp: -gn is the name actually showed in the website's menu, whilst -gp is the folder name of the game: in this case, it is preferable that -gp does not contain any spaces.

For packed code: it must be firstly put into a folder then be compressed into a zip file with the same name of the folder.

'''
import mysql.connector
# import mysql.connector as MySQLdb
import argparse
import zipfile
import os.path
import contextlib

def unzip(source_filename, dest_dir):
    with contextlib.closing(zipfile.ZipFile(source_filename)) as zf:
        zf.extractall("./")
        # for member in zf.infolist():
        #     # Path traversal defense copied from
        #     # http://hg.python.org/cpython/file/tip/Lib/http/server.py#l789
        #     words = member.filename.split('/')
        #     path = dest_dir
        #     for word in words[:-1]:
        #         while True:
        #             drive, word = os.path.splitdrive(word)
        #             head, word = os.path.split(word)
        #             if not drive:
        #                 break
        #         if word in (os.curdir, os.pardir, ''):
        #             continue
        #         path = os.path.join(path, word)
        #     zf.extract(member, path)
        #     os.chmod(path, 0o755)
        os.system("chmod -R 755 "+dest_dir)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-n', type=str, default='warehouse.cims.nyu.edu', help="hostname of the MySQL server")
    parser.add_argument('-d', type=str, default='as9913_drecco', help="name of the database")
    parser.add_argument('-u', type=str, default='as9913', help="id of the database admin")
    parser.add_argument('-p', type=str, default='Kendriclam96!', help="passwd of the database admin")
    parser.add_argument('-gn', type=str, help="name of the game")
    parser.add_argument('-gp', type=str, help="folder name of the game")
    args = parser.parse_args()

    assert args.gn is not None and args.gp is not None
    unzip(args.gp+".zip", args.gp)

    db_connection = mysql.connector.connect(host=args.n, user=args.u, passwd=args.p, database=args.d)
    db_cursor = db_connection.cursor()
    try:
        add_game_query = "INSERT INTO game(name, dir) VALUES ('{}', 'games/{}/');".format(args.gn, args.gp)
        db_cursor.execute(add_game_query)
        db_connection.commit()
    except mysql.connector.Error as e:
        print('Sql error, debug here')
    print(db_cursor.rowcount, "Record Inserted")
    db_connection.close()
