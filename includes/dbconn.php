<?php
// Extend this class to re-use db connection
class DbConn
{
	public $conn;
	public function __construct()
	{
		require dirname(__FILE__).'/../dbconf.php';
		$this->host = $host; // Host name
		$this->username = $username; // Mysql username
		$this->password = $password; // Mysql password
		$this->db_name = $db_name; // Database name
		$this->tbl_prefix = $tbl_prefix; // Prefix for all database tables
		$this->tbl_members = $tbl_members;
		$this->tbl_attempts = $tbl_attempts;
        $this->tbl_saves = $tbl_saves;
        $this->tbl_games = $tbl_games;
        $this->tbl_scores = $tbl_scores;
		// Connect to server and select database.
//		$this->conn = new PDO('mysql:host='.$host.';dbname='.$db_name.';charset=utf8', $username, $password);
//		$this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


        $this->conn = new mysqli($host, $username, $password, $db_name);
		 if (mysqli_connect_errno())
		 	die("Could not connect: " . mysqli_connect_error());
//		 try {
//             $stmt = $this->conn->prepare("INSERT INTO ".$tbl_members." (id, username, password, email)
//            VALUES (?,?,?,?)");
//             $uid = 123123;
//             $usr = "test";
//             $pw = 123123;
//             $email = "ylns1314@outlook.com";
//             $stmt->bind_param('ssss',$uid, $usr, $pw, $email);
//             $stmt->execute();
//         } catch (mysqli_sql_exception $e) {
//             echo "here";
//
//             $err = "Error: " . $e->getMessage();
//             echo $err;
//
//         }
//		 echo ("Connected successfully\n");

	}

	public function close()
    {
        $this->conn->close();
    }
}
