$(document).ready(function(){
	var time = {};
	var money = {};
	var rootDir = "http://localhost/money-calendar/";
	//var rootDir = "http://intheon.xyz/liv/";
	defineMetadata(time);
	checkIfFileExists(rootDir,time);
	loadCalendar(time);
	loadInformation(time);
});

var checkIfFileExists = function(rootDir,time)
{
	// check on the server if a particular file exists
	var fileName = time.month + time.year;
	var outcome;

	// checks if this file exists on the server
	$.ajax({
		type				: "POST",
		url                 : rootDir + "php/money.php",
		data 				: 
		{
			purpose			: "check_file", 
			fileName		: fileName	
		},
		success				: function(outcome)
		{
			// our callback
			checkOutcome(time,outcome);
		}
	});
}

function checkOutcome(time,outcome)
{
	if (outcome == "true")
	{
		console.log("file does exist");
	}
	else if (outcome == "false")
	{
		console.log("file doesnt exist");
	}
}



function defineMetadata(time,money)
{
	time.today 			= moment();
	time.year 			= moment().year();
	time.month 			= moment().format("MMMM");
	time.todaysDate 	= moment().format("D");
	time.daysInMonth 	= moment().daysInMonth();
	time.payday 		= moment().date("28");
	time.toPayday 		= time.payday.diff(time.today,"days");
}

function defineMoney(time,money)
{
	money.gross			= "???";
}

function loadCalendar(time)
{
	// draw all the dates
	for (counter = 1; counter <= time.daysInMonth; counter++)
	{
		$("#cost-calendar").append("<div class='calendar-item' id='calendar-item-"+counter+"'>\
			<div class='date-number'>"+counter+"</div>\
			<div class='date-body'></div>\
			</div>");
		if (counter == time.todaysDate)
		{
			$("#calendar-item-" + counter).append("<div class='label'>Today</div>");
			$("#calendar-item-" + counter).css("background-color","#FDE7BA");
		}
		if (counter == 28)
		{
			$("#calendar-item-28").append("<div class='label'>Payday</div>")
		}
	}
}

function loadInformation(time)
{
	$("#information-panel").append("<div class='information-row'>\
			<div class='information-month'>It is "+time.month+"</div>\
			<div class='information-next-payday'>You have "+time.toPayday+" days until payday</div>\
		</div>")
}
