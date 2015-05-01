<?php


// checks if whichever month i am in (from the 28th of the prev month) has any data associated with it.

// globals
$host 				= "localhost";
$username 			= "root";
$password 			= "";
$dbname 			= "money-calendar";

// only this block if checking for a certain months pay
if (isset($_POST['monthToCheck']))
{
	// assign it to a var
	$monthNum 		= $_POST['monthToCheck'];

	try
	{
		// open
		$connection = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

		// set error mode attributes to warnings
		$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		// a statement to retrieve all matching records
		$statement = $connection->prepare("SELECT * FROM paydays WHERE month_number = :month");

		// bind parameters
		$statement->bindParam(':month', $monthNum);

		// execute
		$statement->execute();

		// get response
		$response = $statement->fetchAll();

		// cycle through
		foreach ($response as $row) {
    		echo $row['payday_amount'];
		}




		// close
		$connection	= null;
	}
	catch (PDOException $exception)
	{
		// get exception message
		echo "I'm sorry, Dave. I'm afraid I can't let you do that. | " . $exception->getMessage();

		// write it to a log file
    	file_put_contents('PDOErrors.txt', $exception->getMessage(), FILE_APPEND);
	}


}

?>