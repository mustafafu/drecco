'''
Database configuration document can be found in docs/Database-and-Site-configuration.pdf
'''
import MySQLdb
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-n', type=str, default='warehouse.cims.nyu.edu', help="hostname of the MySQL server")
    parser.add_argument('-d', type=str, default='mfo254_drecco', help="name of the database")
    parser.add_argument('-u', type=str, default='mfo254', help="id of the database admin")
    parser.add_argument('-p', type=str, default='db_psswd', help="passwd of the database admin")

    args = parser.parse_args()

    sql_query_members = ("""
        CREATE TABLE `members` (
          `id` char(23) NOT NULL,
          `username` varchar(65) NOT NULL DEFAULT '',
          `password` varchar(65) NOT NULL DEFAULT '',
          `email` varchar(65) NOT NULL,
          `verified` tinyint(1) NOT NULL DEFAULT '0',
          `mod_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `username_UNIQUE` (`username`),
          UNIQUE KEY `id_UNIQUE` (`id`),
          UNIQUE KEY `email_UNIQUE` (`email`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    """)

    sql_query_loginAttempts = ("""
        CREATE TABLE `loginAttempts` (
          `IP` varchar(20) NOT NULL,
          `Attempts` int(11) NOT NULL,
          `LastLogin` datetime NOT NULL,
          `Username` varchar(65) DEFAULT NULL,
          `ID` int(11) NOT NULL AUTO_INCREMENT,
          PRIMARY KEY (`ID`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    """)

    sql_query_game = ("""
        CREATE TABLE `game` (
            `name` char(255) NOT NULL,
            `dir` char(255) NOT NULL,
            `gid` int(11) NOT NULL AUTO_INCREMENT,
            PRIMARY KEY (`gid`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    """)

    sql_query_saves = ("""
        CREATE TABLE `saves` (
            `sid` int(11) NOT NULL AUTO_INCREMENT,
            `uid` char(23),
            `gid` int(11),
            `save` varchar(255) NOT NULL,
            `lastgame` datetime NOT NULL,
            PRIMARY KEY (`sid`),
            CONSTRAINT `fk_SaveToUsr` FOREIGN KEY (`uid`) REFERENCES `members`(`id`),
            CONSTRAINT `fk_SaveToGame` FOREIGN KEY (`gid`) REFERENCES `game`(`gid`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    """)

    sql_query_scores = ("""
        CREATE TABLE `scores` (
            `sid` int(11) NOT NULL AUTO_INCREMENT,
            `uid` char(23),
            `gid` int(11),
            `role` varchar(255) NOT NULL,
            `timestamp` varchar(255) NOT NULL,
            `score` varchar(255) NOT NULL,
            PRIMARY KEY (`sid`),
            CONSTRAINT `fk_ScoreToUsr` FOREIGN KEY (`uid`) REFERENCES `members`(`id`),
            CONSTRAINT `fk_ScoreToGame` FOREIGN KEY (`gid`) REFERENCES `game`(`gid`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    """)

    db = MySQLdb.connect(host=args.n, user=args.u, passwd=args.p, db=args.d)

    cur = db.cursor()

    cur.execute(sql_query_members)
    cur.execute(sql_query_loginAttempts)
    cur.execute(sql_query_game)
    cur.execute(sql_query_saves)
    cur.execute(sql_query_scores)

    db.close()
