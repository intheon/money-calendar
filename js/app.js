// app.js - the 'glue' - 2015 intheon

// -----------------------------------------------------------------------------------
// 		Workflow
//
// 	-	Draw a blank calendar with moment.js
// 	-	Check if net wage for that month is available. if it is retreive and draw it, if it isnt request it, store it, retreive, and draw
// 	-	Have form to add in spend for that day
// 	-	Also have it so you can add spend for previous and future days
// 	-	Have information panel to show how much remains, broken down into useful facts
// -----------------------------------------------------------------------------------

// GO

// initialisation, fires all the stuff when the page is loaded

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

// defining some useful stuff in objects, as a tidier shorthand

function defineMetadata(time,money)
{
	time.today 			= moment();
	time.year 			= moment().year();
	time.month 			= moment().format("MMMM");
	time.monthNum		= moment().format("M");
	time.todaysDate 	= moment().format("D");
	time.daysInMonth 	= moment().daysInMonth();
	time.payday 		= moment().date("28");
	time.toPayday 		= time.payday.diff(time.today,"days");

	money.netPay 		= function(time,money){
		var april = time.monthNum - 1;
		ajaxController(april);
	}

	money.netPay(time,money);
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

function ajaxController(monthToCheck)
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
		success				: function(outcome)
		{
			console.log(outcome);
		}
	});
}


function defineMoney(time,money)
{
	money.gross			= "???";
}
