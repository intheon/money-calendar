<?php

if (isset($_POST['fileName']))
{
	$fileName = $_POST['fileName'];

	// file doesnt exist
	if (!file_exists("../" . $fileName . ".json"))
	{
		echo "false";
	}
	else
	{	
		// file exists
		echo "true";
		// append to existing file 
		/*
		$current = file_get_contents("../" . $fileName . ".json");
		$new = "DERP";
		$contents = $current . ',' . $new . ']}';
		*/
	}

		/*
		$file = fopen("../" . $fileName . ".json","w+");

		fwrite($file, $contents);
		fclose($file);
		*/
}

?>