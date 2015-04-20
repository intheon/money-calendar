$(document).ready(function(){
	var time = {};
	var money = {};
	defineMetadata(time);
	loadCalendar(time);
	loadInformation(time);
});

function defineMetadata(time,money)
{
	time.month 			= moment().format("MMMM");
	time.todaysDate 	= moment().format("D");
	time.daysInMonth 	= moment().daysInMonth();
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
		if (counter == 28)
		{
			$("#calendar-item-28").append("<div class='payday-label'>Payday</div>")
		}
	}
}

function loadInformation(time)
{
	$("#information-panel").append("<div class='information-row'>\
			<div class='information-month'>It is "+time.month+"</div>\
			<div class='information-next-payday'>You have "+time.todaysDate+" days until next payday</div>\
		</div>")
}
