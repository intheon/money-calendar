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
	loadCalendar(time,money);
});

// defining useful stuff as objects
function defineMetadata(time,money)
{
// time
	time.today 				= moment();
	time.year 				= moment().year();
	time.month 				= moment().format("MMMM");
	time.monthNum			= moment().format("M");
	time.todaysDate 		= moment().format("D");
	time.fullDate 			= moment().format("YYYY-MM-DD");
	time.dayShort 			= moment().format("ddd");
	time.firstDayOfMonth 	= moment(1,"D");
	time.daysInMonth 		= moment().daysInMonth();
	time.payday 			= moment().date("28");
	time.toPayday 			= time.payday.diff(time.today,"days");
// money
	getPay(money,"netPay",time.monthNum);

	money.spendThisMonth 	= 0;

// object-listener
	Object.observe(money,function(changes){
		loadInformation(time,money)
	});
}

function getPay(rootObject,newPropertyName,monthToCheck)
{
	var rootDir 		= "http://localhost/money-calendar/"; // local
	//var rootDir 		= "http://intheon.xyz/money-calendar/"; // production

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
function loadCalendar(time,money)
{
	// draw all the dates
	for (counter = 1; counter <= time.daysInMonth; counter++)
	{
		var day = moment(counter,"D");
			day = day.format("dd");

		$("#cost-calendar").append("<div class='calendar-item' id='calendar-item-"+counter+"'>\
			<div class='cell-menu'><img src='./note.png' class='button-add' id='button-note' width='22%'><img src='./paper-bill.png' width='22%' class='button-add' id='button-spend'></div>\
			<div class='date-number'>"+counter+"<div class='day-label'>"+day+"</div></div>\
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
				drawModal(un,type,money);
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
	if (money.netPay == "empty")
	{
		$(document.body).prepend("<div class='overlay-wrapper'><div class='full-page-overlay'></div><div class='full-page-capture'><h2>Staph!</h2><h3>How much did you get paid this month?</h3><input type='text' placeholder='$$$$$' id='this-months-pay'><input type='button' value='Submit to DB' id='submit-months-pay'></div></div>");
		$("#submit-months-pay").click(function(){
			var amount = $("#this-months-pay").val();

			if (amount == "")
			{
				$("#this-months-pay").val("empty");
			}
			else
			{
				if (!isNaN(amount))
				{
					if (amount <= 5000)
					{
						var rootDir 			= "http://localhost/money-calendar/"; 	// local
						//var rootDir 			= "http://intheon.xyz/money-calendar/"; // production
						$.ajax({
							type				: "POST",
							url     			: rootDir + "php/money.php",
							data 				: 
							{
								newMonthAmount	: amount,
								exactDate		: time.fullDate,
								monthNumber		: time.monthNum
							},
							success	: function(data)
							{
								if (data == "remove")
								{
									$(".overlay-wrapper").fadeOut(function(){
										$(".overlay-wrapper").hide();
									});

									ajaxController(money,"netPay",time.monthNum);
								}
								else
								{
									console.log("something went horribly wrong");
								}
							}
						});
					}
					else
					{
						$("#this-months-pay").val("Are you rich?");
					}
				}
				else
				{
					$("#this-months-pay").val("NaN");
				}
			}
		});
	}
	else
	{
		var blah = parseInt(money.netPay - money.spendThisMonth);
		$("#information-panel").html("<div class='information-wrapper'>\
			<div class='information-month information-row'>"+time.month+"</div>\
			<div class='information-next-payday information-row'><div class='integer'>"+time.toPayday+"</div> days until payday</div>\
			<div class='information-payday-amount information-row'><div class='integer'>£"+money.netPay+"</div> wage this month</div>\
			<div class='information-month-spend information-row'><div class='integer'>£"+ money.spendThisMonth +"</div> spent this month</div>\
			<div class='information-wage-remaining information-row'><div class='integer'>£"+ parseInt(money.netPay - money.spendThisMonth) +"</div> remains</div>\
			<div class='information-wage-daily information-row'><div class='integer'>£"+ parseInt(money.spendThisMonth / time.daysInMonth)  +"</div> spending per day</div>\
			<div class='information-wage-daily information-row'><div class='integer'>£"+ parseInt(blah / time.daysInMonth)  +"</div> allowance per day</div>\
		</div>");

		var toEvaluate = {
			remaining: ["information-wage-remaining",parseInt(money.netPay - money.spendThisMonth)],
			spend: ["information-month-spend", money.spendThisMonth]
		};

		calculateColour(toEvaluate);

		//$("#calendar-item-28 .date-body").append("£"+money.netPay);
	}
}


function calculateColour(subjects)
{
	if (subjects.spend[1] >= 100)
	{
		
	}

}


var alreadyHasModal = [];


function drawModal(whoRang,type,money)
{
	if (type == "button-note")
	{
		$("#" + whoRang).prepend("<div class='modal-overlay'><div class='modal-overlay-close'><img src='./cross.png'></div><div class='modal-overlay-add'><img src='./add.png' class='button-add-note'></div><form><textarea placeholder='add...'></textarea></form></div>");
	}
	else if (type == "button-spend")
	{
		$("#" + whoRang).prepend("<div class='modal-overlay'><div class='modal-overlay-close'><img src='./cross.png'></div><div class='modal-overlay-add'><img src='./add.png' class='button-add-spend'></div><form><input type='text' placeholder='label' class='add-spend-label'><input type='text' placeholder='integer' class='add-spend-integer'></form></div>");
	}

	$("#" + whoRang).keyup(function(event){
		if (event.keyCode == 13 && type == "button-note")
		{	
			var rawValue = event.target.value;
			var parentCell = event.currentTarget.id;
			//console.log(event.target.value);
			getModalValue(rawValue,parentCell);
		}
	});

	$(".button-add-spend").click(function(event){
		var rootId = event.currentTarget.offsetParent.offsetParent.offsetParent.id;

		var classes = [];

		$("#" + whoRang + " input[type='text']").each(function(){
			classes.push(this.className);
		});

		getFormValue(rootId,classes[0],classes[1],money)
	});

	$(".button-add-note").click(function(event){

		var parentCell = event.currentTarget.offsetParent.offsetParent.offsetParent.id;
		var rawValue = $("#" + parentCell + " .modal-overlay form textarea").val();
		
		getModalValue(rawValue,parentCell)
	});


	$("#" + whoRang + " input[type='text']").keyup(function(event){
		if (event.keyCode == 13)
		{
			var classes = [];

			$("#" + whoRang + " input[type='text']").each(function(){
				classes.push(this.className);
			});

			var rootId = event.currentTarget.offsetParent.offsetParent.id;

			getFormValue(rootId,classes[0],classes[1],money);
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

function getModalValue(rawValue,parentCell)
{
	console.log("getMod");
	var tidyValue = rawValue.replace(/[^\w\s!?]/g,'');

	var noteHTML = "<div class='note'><div class='pin'></div>" + tidyValue + "</div>"

	//var parentCell = event.currentTarget.id;

	// todo - persistence!
	$("#" + parentCell + " .date-body").append(noteHTML);

	setNotes(parentCell,noteHTML);



	removeModal(parentCell);
}

function getFormValue(parentCell,firstField,secondField,money)
{
	//var firstField = formId.currentTarget.previousElementSibling.previousElementSibling.className;
	//var secondField = formId.currentTarget.previousElementSibling.className;
	//var rootId = formId.currentTarget.offsetParent.offsetParent.id;

	var firstFieldVal = $("#" + parentCell + " .modal-overlay form .add-spend-label").val()
	var secondFieldVal = $("#" + parentCell + " .modal-overlay form .add-spend-integer").val()
	//console.log(firstField.className);
	
	if (firstFieldVal == "" || secondFieldVal == "") showWarning("fill out all fields");
	else 
	{
		if (isNaN(secondFieldVal)) showWarning("this isnt a number!");
		else
		{
			$("#" + parentCell + " .date-body").append("<div class='spend-item'><div class='pin'></div><div class='spend-label'>" + firstFieldVal + "</div><div class='spend-value'>£" + secondFieldVal + "</div></div>");

			money.spendThisMonth += parseInt(secondFieldVal);

			removeModal(parentCell);
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

// ajax up in this biatch!
function getNotes()
{

}

function setNotes(parentCell,noteHTML)
{
	var rootDir 		= "http://localhost/money-calendar/"; // local
  //var rootDir 		= "http://intheon.xyz/money-calendar/"; // production

	var jsonItem = {};
		jsonItem.parentCell = parentCell;
		jsonItem.noteHTML = noteHTML;
		

		/*
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
*/
}