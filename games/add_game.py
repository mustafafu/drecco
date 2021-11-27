'''
For add_game.py:
        it can only be used in games/ sub folder. default arguments for connecting the database has been written into it, which can be easily changed if rebased.
        differences between -gn and -gp: -gn is the name actually showed in the website's menu, whilst -gp is the folder name of the game: in this case, it is preferable that -gp does not contain any spaces.
'''
import MySQLdb
import argparse

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

    db = MySQLdb.connect(host=args.n, user=args.u, passwd=args.p, db=args.d)
    cur = db.cursor()
    try:
        cur.execute("INSERT INTO `game` (`name`, `dir`) VALUES (%s, %s);",
                    (args.gn, "games/" + args.gp.lstrip('./').strip('/') + "/"))
        db.commit()
    except Exception, e:
        # Intentionally done so that user is aware of
        # error, but the cursor and db are closed
        raise
    finally:
        cur.close()
        db.close()
