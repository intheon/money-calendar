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
		loadInformation(time,money)
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
			$("#calendar-item-" + counter).addClass("active-cell");
		}

		if (counter == 28)
		{
			$("#calendar-item-28").append("<div class='label'>Payday</div>");
		}

		$("#calendar-item-" + counter).click(function(event){
			loadModal(event.currentTarget.id);
		});
	}
}

// and draws all the helpful bits of motovational information
function loadInformation(time,money)
{
	$("#information-panel").append("<div class='information-row'>\
			<div class='information-month'>It is "+time.month+"</div>\
			<div class='information-next-payday'>You have "+time.toPayday+" days until payday</div>\
			<div class='information-payday-amount'>You were paid £"+money.netPay+" this month</div>\
		</div>");

	$("#calendar-item-28 .date-body").append("£"+money.netPay);
}

var alreadyHasModal = [];

function loadModal(whoRang)
{
 // compare array - one modal loaded per cell 

 // always add the first value
 	if (alreadyHasModal[0] === undefined)
 	{
		alreadyHasModal.push(whoRang);
		console.log(alreadyHasModal);
 	}
 	else
 	{
 		for (var p = 0; p <= alreadyHasModal.length; p++)
 		{
 			if (whoRang == alreadyHasModal[p])
 			{
 				console.log("already there");
 				console.log(alreadyHasModal);
 				break;
 			}
 		}
 	}

	//$("#" + whoRang).prepend("<div class='modal-overlay'></div>");

}