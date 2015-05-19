// -------------------------------------------------------------
// 						Workflow
//					  2015 intheon
//
// 	-	Draw a blank calendar with moment.js
// 	-	Check if net wage for that month is available.
// 	-	Have form to add in spend
// 	-	Have information panel to show how much remains
//
// -------------------------------------------------------------

// initialisation
$(document).ready(function()
{
// globals
	var time 			= {};
	var money 			= {};

// functions
	defineMetadata(time,money);
	loadCalendar(time);
	loadInformation(time);
});

// defining useful stuff as objects
function defineMetadata(time,money)
{
// time
	time.today 			= moment();
	time.year 			= moment().year();
	time.month 			= moment().format("MMMM");
	time.monthNum		= moment().format("M");
	time.todaysDate 	= moment().format("D");
	time.daysInMonth 	= moment().daysInMonth();
	time.payday 		= moment().date("28");
	time.toPayday 		= time.payday.diff(time.today,"days");

// money
	ajaxController(money,"netPay",4);

	Object.observe(money,function(changes){
		console.log(money);
	});

}

function ajaxController(rootObject,newPropertyName,monthToCheck)
{
	var rootDir 		= "http://localhost/money-calendar/"; // local
	//var rootDir 		= "http://intheon.xyz/liv/"; // production

	// checks if this file exists on the server
	$.ajax({
		type				: "POST",
		url                 : rootDir + "php/money.php",
		data 				: 
		{
			monthToCheck	: monthToCheck	
		},
		success				: function(data)
		{
			rootObject[newPropertyName] = data;
		}
	});

}

// actually draws the calendar to the dom

function loadCalendar(time)
{
	// draw all the dates
	for (counter = 1; counter <= time.daysInMonth; counter++)
	{

		$("#cost-calendar").append("<div class='calendar-item' id='calendar-item-"+counter+"'>\
			<div class='date-number'>"+counter+"</div>\
			<div class='date-body'></div></div>");

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

// and draws all the helpful bits of motovational information
function loadInformation(time)
{
	$("#information-panel").append("<div class='information-row'>\
			<div class='information-month'>It is "+time.month+"</div>\
			<div class='information-next-payday'>You have "+time.toPayday+" days until payday</div>\
		</div>")
}

function loadModal()
{

}



// REDUNDANT
// DELETE THESE WHEN YOU CAN


function checkApplicationLogic(rootDir,time)
{
	var fileName = time.month + time.year;
	// check on the server if a particular file exists

	checkIfFileExists(rootDir,fileName);
}

function defineMoney(time,money)
{
	money.gross			= "???";
}

