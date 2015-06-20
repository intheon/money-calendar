<?php


// checks if whichever month i am in (from the 28th of the prev month) has any data associated with it.

// globals
$host 				= "localhost";
$username 			= "root";
$password 			= "";
$dbname 			= "money-calendar";

// GETTING THE MONTHLY PAY
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

		if (!$response)
		{
			echo "empty";
		}
		else
		{
			// cycle through
			foreach ($response as $row) {
				// spit out amount paid in that month
    			echo $row['payday_amount'];
			}
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

// SETTING THE MONTHLY PAY
if (isset($_POST["newMonthAmount"]) && isset($_POST["exactDate"]) && isset($_POST["monthNumber"]))
{
	$amount = $_POST["newMonthAmount"];
	$date = $_POST["exactDate"];	
	$month = $_POST["monthNumber"];

	try
	{
		// open
		$connection = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

		// set error mode attributes to warnings
		$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		// a statement to insert a new record
		$statement = $connection->prepare("INSERT INTO paydays(date, payday_amount, month_number) VALUES (:date, :payday_amount, :month_number)");

		// bind parameters
		$statement->bindParam(':date', $date);
		$statement->bindParam(':payday_amount', $amount);
		$statement->bindParam(':month_number', $month);

		// execute
		$success = $statement->execute();

		// get response
		if ($success)
		{
			echo "remove";
		}
		else
		{
			echo "something went horribly wrong";
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