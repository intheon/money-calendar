<?php

// checks if whichever month i am in (from the 28th of the prev month) has any data associated with it.

$host 				= "localhost";
$username 			= "root";
$password 			= "";
$dbname 			= "money-calendar";

if (isset($_POST['monthToCheck']))
{
	$monthNum 		= $_POST['monthToCheck'];

	try
	{
		// open
		$connection = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

		// set error mode attributes to warnings
		$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		// a statement to retrieve all matching records
		$statement = $connection->prepare("SELECT * FROM paydays WHERE month_number = $monthNum");

		$statement->execute();

		$response = $statement->fetchAll();

		foreach ($response as $row) {
    		echo $row['payday_amount'];
		}




		// close
		$connection	= null;
	}
	catch (PDOException $exception)
	{
		echo "I'm sorry, Dave. I'm afraid I can't let you do that. | " . $exception->getMessage();
    	file_put_contents('PDOErrors.txt', $exception->getMessage(), FILE_APPEND);
	}


}

?>