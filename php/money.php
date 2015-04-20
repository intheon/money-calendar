<?php

if (isset($_POST['fileName']))
{
	$fileName = $_POST['fileName'];

	//our json to write
	if (!file_exists("../" . $fileName . ".json"))
	{
		echo "write me a file bitch";
		// write a blank file
		$contents = "HERP";
	}
	else
	{
		// append to existing file
		$current = file_get_contents("../" . $fileName . ".json");
		$new = "DERP"
		$contents = $current . ',' . $new . ']}';
	}

		$file = fopen("../" . $fileName . ".json","w+");

		fwrite($file, $contents);
		fclose($file);

}

?>