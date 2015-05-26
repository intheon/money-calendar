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

	money.netPay 		= "1424";
	loadInformation(time,money);
/*
	ajaxController(money,"netPay",4);

	Object.observe(money,function(changes){
		console.log("being fired 2");
		loadInformation(time,money)
	});
*/
}

function ajaxController(rootObject,newPropertyName,monthToCheck)
{
	rootObject[newPropertyName] = "1424";

	/*
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
			//rootObject[newPropertyName] = data;

			//testing
			rootObject[newPropertyName] = "1424";
		}
	});
*/
}

// actually draws the calendar to the dom
function loadCalendar(time)
{
	// draw all the dates
	for (counter = 1; counter <= time.daysInMonth; counter++)
	{

		$("#cost-calendar").append("<div class='calendar-item' id='calendar-item-"+counter+"'>\
			<div class='cell-menu'><img src='./note.png' class='button-add' id='button-note' width='10%'><img src='./paper-bill.png' width='10%' class='button-add' id='button-spend'></div>\
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

		$("#calendar-item-" + counter)
			.mouseover(function(event){
				var un = event.currentTarget.id;
				$("#" + un + " .cell-menu").show();
			})
			.mouseout(function(event){
				var un = event.currentTarget.id;
				$("#" + un + " .cell-menu").hide();
			})

		$("#calendar-item-" + counter + " .button-add").click(function(event){
			var un 		= event.currentTarget.parentNode.parentNode.id;
			var type	= event.currentTarget.id;
			var cont 	= undefined;

			if (alreadyHasModal[0] === undefined || null)
			{
				alreadyHasModal.push(un)
				drawModal(un,type);
			}
			else
			{
				if (alreadyHasModal[0] == un) return false
				else 
				{
					for (on = 0; on <= alreadyHasModal.length - 1; on++)
					{	
						if (alreadyHasModal[on] == un)
						{
							cont = false;
							break;
						}
					}
					if (cont !== false)
					{
						alreadyHasModal.push(un);
						drawModal(un,type);
					}
				}
			}
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


function drawModal(whoRang,type)
{
	if (type == "button-note")
	{
		$("#" + whoRang).prepend("<div class='modal-overlay'><div class='modal-overlay-close'><img src='./cross.png' width='40%'></div><form><textarea placeholder='add...'></textarea></form></div>");
	}
	else if (type == "button-spend")
	{
		$("#" + whoRang).prepend("<div class='modal-overlay'><div class='modal-overlay-close'><img src='./cross.png' width='40%'></div><form><input type='text' placeholder='label' class='add-spend-label'><input type='text' placeholder='integer' class='add-spend-integer'><input type='button' value='add' class='button-add-spend'></form></div>");
	}

	$("#" + whoRang).keyup(function(event){
		if (event.keyCode == 13 && type == "button-note")
		{
			getModalValue(event);
		}
	});

	$(".button-add-spend").click(function(event){

		var firstField = event.currentTarget.previousElementSibling.previousElementSibling.className;
		var secondField = event.currentTarget.previousElementSibling.className;
		var rootId = event.currentTarget.offsetParent.offsetParent.id;

		getFormValue(rootId,firstField,secondField)
	});

	$("#" + whoRang + " input[type='text']").keyup(function(event){
		if (event.keyCode == 13)
		{
			var classes = [];

			$("#" + whoRang + " input[type='text']").each(function(){
				classes.push(this.className);
			});

			var rootId = event.currentTarget.offsetParent.offsetParent.id;

			getFormValue(rootId,classes[0],classes[1]);
		}
	});


	$(".modal-overlay-close").click(function(event){
		var id = event.currentTarget.offsetParent.offsetParent.id;
		removeModal(id);
	});
}

function removeModal(whoRang)
{
	var id = whoRang;

	$("#" + id + " .modal-overlay").fadeOut(function(){
		$(this).remove();
	});

	var index = alreadyHasModal.indexOf(id);

	if (index > -1) {
    	alreadyHasModal.splice(index, 1);
	}

	$("#" + id).unbind("keyup");
}

function getModalValue(event)
{
	var rawValue = event.currentTarget.firstChild.childNodes[1].lastChild.value;

	var parentCell = event.currentTarget.id;

	// todo - persistence!
	$("#" + parentCell + " .date-body").append(rawValue);

	removeModal(event.currentTarget.id);
}

function getFormValue(rootId,firstField,secondField)
{
	//var firstField = formId.currentTarget.previousElementSibling.previousElementSibling.className;
	//var secondField = formId.currentTarget.previousElementSibling.className;
	//var rootId = formId.currentTarget.offsetParent.offsetParent.id;

	var firstFieldVal = $("#" + rootId + " .modal-overlay form .add-spend-label").val()
	var secondFieldVal = $("#" + rootId + " .modal-overlay form .add-spend-integer").val()
	//console.log(firstField.className);
	
	if (firstFieldVal == "" || secondFieldVal == "") showWarning("fill out all fields");
	else 
	{
		if (isNaN(secondFieldVal)) showWarning("this isnt a number!");
		else
		{
			$("#" + rootId + " .date-body").append("<div class='spend-item'><div class='spend-label'>" + firstFieldVal + "</div><div class='spend-value'>" + secondFieldVal + "</div></div>")
			removeModal(rootId);
		}
	}
}


function showWarning(message)
{
	$("#messages").html("<div class='warning-message'>" + message + " <div class='close-warning-box'><img src='./cross.png' width='40%'></div></div>");

	$(".close-warning-box").click(function(){
		$(".warning-message").fadeOut(function(){
			$(this).remove();
		});
	});

}