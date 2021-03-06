const input = document.getElementById("task-input");
const inputDetail = document.getElementById("text-input-details");
const totalTasks = document.getElementById("total");
const completedTasks = document.getElementById("completed");
const modal = document.getElementById("modal");
const maxRecentlyDeleted = 4;
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector('#menu');
let priority = 0;
var priorities = [0, 1, 2, 3];
loadData("TotalTasks") || saveData("TotalTasks", 0);
loadData("CompletedTasks") || saveData("CompletedTasks", 0);
loadData("ToDoTheme") || saveData("ToDoTheme", "light");
totalTasks.innerHTML = loadData("TotalTasks");
completedTasks.innerHTML = loadData("CompletedTasks");

function updateTasks() {
	readTasks(taskStore, function(tasks) {
		let list = document.getElementById("task-list");
		let innerHTML = "";

		//Sorting according to priority
		sortingTasks(tasks);

		for (let i = 0; i < tasks.length; i++) {
			innerHTML += `
	        <li><div data-id='${tasks[i].id}'>
	        <h2 onclick='deleteTaskOnClick(this.closest("div"), this); this.onclick=null;'>${tasks[i].title}</h2>
			<p>${tasks[i].detail}</p>`;
			if(tasks[i].priority == 1){
				innerHTML += `<img class="priority-property" style="height: 24px; width: 6px;" src="./images/active-1.png"><img class="delete-button" style="height: 25px; width: 20px;" src="./images/trash.png" align="right" onclick='deleteTaskOnClick(this.closest("div"), this); this.onclick=null;'></div></li>`;
			}else if(tasks[i].priority == 2){
				innerHTML += `<img class="priority-property" style="height: 24px; width: 6px;" src="./images/active-1.png"><img class="priority-property" style="height: 24px; width: 6px;" src="./images/active-1.png"><img class="delete-button" style="height: 25px; width: 20px;" src="./images/trash.png" align="right" onclick='deleteTaskOnClick(this.closest("div"), this); this.onclick=null;'></div></li>`;
			}else if(tasks[i].priority == 3){
				innerHTML += `<img class="priority-property" style="height: 24px; width: 6px;" src="./images/active-1.png"><img class="priority-property" style="height: 24px; width: 6px;" src="./images/active-1.png"><img class="priority-property" style="height: 24px; width: 6px;" src="./images/active-1.png"><img class="delete-button" style="height: 25px; width: 20px;" src="./images/trash.png" align="right" onclick='deleteTaskOnClick(this.closest("div"), this); this.onclick=null;'></div></li>`;
			}else{
				innerHTML += `<span class="no-priority" style="height: 28px; width: 10px;"></span><img class="delete-button" style="height: 25px; width: 20px;" src="./images/trash.png" align="right" onclick='deleteTaskOnClick(this.closest("div"), this); this.onclick=null;'></div></li>`
			}
		}
		list.innerHTML = innerHTML;
	});
	
	readTasks(completedTaskStore, function(tasks) {
		let list = document.getElementById("completed-task-list");
		let innerHTML = "";
		tasks.reverse();
		for (let i = 0; i < Math.min(tasks.length, maxRecentlyDeleted); i++) {
			innerHTML += `<li class="invert">${tasks[i].title} : <span>${tasks[i].completedDate}</span></li>`;
		}
		list.innerHTML = innerHTML;
	});

}

function sortingTasks(tasks){
	tasks.sort(function (task1, task2) {
		return priorities[task2.priority] - priorities[task1.priority];
	});
}

function onLoad() {
	updateTasks();
	updateTheme(loadData("ToDoTheme"));
	document.body.style.display = "flex";
	// deleteAllTasks(taskStore);
	// saveData("TotalTasks", 0);
	//changing priority icon for dark theme
}

let countDeletedTasks = 0;
function deleteTaskOnClick(targetElement, element) {
	let id = Number(targetElement.dataset.id);
	if(element.tagName == "H2"){
		let task = readOneTask(taskStore, id, function(task) {
			let completedTask = new CompletedTask(task.title, task.detail, task.priority);
			addTask(completedTaskStore, completedTask, function() {
				targetElement.classList.add("exit");

				targetElement.addEventListener("animationend", function() {
					deleteTask(taskStore, id, function() {
						let amountOfTasks = Number(loadData("TotalTasks")) - 1;
						saveData("TotalTasks", amountOfTasks);
						totalTasks.innerHTML = loadData("TotalTasks");

						let amountOfCompleted = Number(loadData("CompletedTasks")) + 1;
						saveData("CompletedTasks", amountOfCompleted);
						completedTasks.innerHTML = loadData("CompletedTasks");
						updateTasks();
					});
				});
			});
		});
	}else if(element.tagName == "IMG"){
		let task = readOneTask(taskStore, id, function(task) {
			targetElement.classList.add("exit");
			targetElement.addEventListener("animationend", function() {
				deleteTask(taskStore, id, function() {
					let amountOfTasks = Number(loadData("TotalTasks")) - 1;
					saveData("TotalTasks", amountOfTasks);
					totalTasks.innerHTML = loadData("TotalTasks");
					updateTasks();
				});
			});
		});
	}
}

let count = 0;
function onEnter(i,e){
	if (e.keyCode === 13) {
		let task = new Task(input.value, inputDetail.value, priority);
		input.value = "";
		if(i==0)
			inputDetail.value = "";
		if (task.title.length === 0) {
			if(i==1)
				alert("Enter Task Title");
			return;
		}
		addTask(taskStore, task, function() {
			let amountOfTasks = Number(loadData("TotalTasks")) + 1;
			saveData("TotalTasks", amountOfTasks);
			totalTasks.innerHTML = loadData("TotalTasks");
			updateTasks();
			if(i==1)
			inputDetail.value = "";
		});
		priorityLow = document.getElementById("priority-low");
		priorityMid = document.getElementById("priority-mid");
		priorityHigh = document.getElementById("priority-high");
		if(priorityLow.classList.contains("activate")){
			activate(priorityLow);
		}
		if(priorityMid.classList.contains("activate")){
			activate(priorityMid);
		}
		if(priorityHigh.classList.contains("activate")){
			activate(priorityHigh);
		}
		if(!priorityLow.classList.contains("activate") && !priorityMid.classList.contains("activate") && !priorityHigh.classList.contains("activate")){
			priority = 0;
		}
	}
}

input.addEventListener("keydown", function(e) {
	onEnter(0,e);
});

inputDetail.addEventListener("keydown", function(e){
	onEnter(1,e);
});

function sort(){
	readTasks(taskStore, function(tasks) {
		let list = document.getElementById("task-list");
			list.sort(function(a,b){
				return $(a).priority  - $(b).priority;
			});
			tasks.append(tasks);
			console.log(tasks);
	});
}

function updateTheme(theme) {
	console.log(theme);
	resetPriorityIcons();
	let bgColor = theme == "light" ? "255, 255, 255" : "19, 19, 19";
	let textColor = theme == "light" ? "12, 12, 12" : "255, 255, 255";
	let shadowColor = theme == "light" ? "0, 0, 0" : "255, 255, 255";
	let grad1 = theme == "light" ? "108, 29, 103" : "34, 208, 163";
	let grad2 = theme == "light" ? "100, 25, 148" : "32, 173, 211";
	let sideGrad1 = theme == "light" ? "255, 255, 255" : "35, 35, 35";
	let sideGrad2 = theme == "light" ? "251, 247, 247" : "46, 46, 46";

	let root = document.documentElement;
	root.style.setProperty("--bg-color", bgColor);
	root.style.setProperty("--text-color", textColor);
	root.style.setProperty("--shadow-color", shadowColor);
	root.style.setProperty("--gradient-1", grad1);
	root.style.setProperty("--gradient-2", grad2);
	root.style.setProperty("--sidebar-gradient-1", sideGrad1);
	root.style.setProperty("--sidebar-gradient-2", sideGrad2);

	document
		.getElementsByClassName("current-theme")[0]
		.classList.remove("current-theme");
	let activeClass = theme == "light" ? "light" : "dark";
	document.getElementById(activeClass).classList.add("current-theme");

	saveData("ToDoTheme", theme); //saving the theme so that it is reatins the next time user visits
	updatePriorityIcons();
}

function updatePriorityIcons(){
	//changing the priority icon for dark theme
	if(document.getElementById("dark").classList.contains("current-theme")){
		document.getElementById("priority-low").setAttribute("src", "./images/inactive-1-opp.png");
		document.getElementById("priority-mid").setAttribute("src", "./images/inactive-1-opp.png");
		document.getElementById("priority-high").setAttribute("src", "./images/inactive-1-opp.png");
	}else{
		document.getElementById("priority-low").setAttribute("src", "./images/inactive-1.png");
		document.getElementById("priority-mid").setAttribute("src", "./images/inactive-1.png");
		document.getElementById("priority-high").setAttribute("src", "./images/inactive-1.png");
	}
}

function resetPriorityIcons(){
	priorityLow = document.getElementById("priority-low");
	priorityMid = document.getElementById("priority-mid");
	priorityHigh = document.getElementById("priority-high");
	if(priorityLow.classList.contains("activate") && priorityMid.classList.contains("activate") && priorityHigh.classList.contains("activate")){
		activate(priorityLow);
		activate(priorityMid);
		activate(priorityHigh);
	}else if(priorityLow.classList.contains("activate") && priorityMid.classList.contains("activate") && !priorityHigh.classList.contains("activate")){
		activate(priorityLow);
		activate(priorityMid);
	}else if(priorityLow.classList.contains("activate") && !priorityMid.classList.contains("activate") && !priorityHigh.classList.contains("activate")){
		activate(priorityLow);
	}
}
function attemptReset() {
	modal.showModal();
}

function closeModal() {
	modal.close();
}

function reset() {
	saveData("TotalTasks", 0);
	totalTasks.innerHTML = "0";
	saveData("CompletedTasks", 0);
	completedTasks.innerHTML = "0";
	deleteAllTasks(taskStore);
	deleteAllTasks(completedTaskStore);
	updateTasks();
}

//Code for priority 
function activate(element){
	element.classList.toggle("activate");
	element.setAttribute("src", "./images/active-1.png");
	if(!element.classList.contains("activate")){
		if(document.getElementById("light").classList.contains("current-theme")){
			element.setAttribute("src", "./images/inactive-1.png");
		}else{
			element.setAttribute("src", "./images/inactive-1-opp.png");
		}
	}
}

$(".priority").click(function() {
    // Get the previous element IF it's a UL (nothing otherwise)
    var previous = $(this).prev("img");
	if(previous[0] == undefined){
		activate(this);
		midElement = $(this).next("img");
		lastElement = midElement.next("img");
		if(!this.classList.contains("activate")){
			if(midElement[0].classList.contains("activate")){
				activate(midElement[0]);
				activate(this);
			}
			if(lastElement[0].classList.contains("activate")){
				activate(lastElement[0]);
			}
		}
		if(this.classList.contains("activate") && !midElement[0].classList.contains("activate") && !lastElement[0].classList.contains("activate")){
			priority = 1;
		}
		if(!this.classList.contains("activate") && !midElement[0].classList.contains("activate") && !lastElement[0].classList.contains("activate")){
			priority = 0;
		}
	}
	else if(previous[0].id == "priority-low"){
		firstElement = $(this).prev("img");
		lastElement = $(this).next("img");
		if(firstElement[0].classList.contains("activate")){
			activate(this);
		}
		if(!this.classList.contains("activate")){
			if(lastElement[0].classList.contains("activate")){
				activate(lastElement[0])
				activate(this);
			}
		}
		if(!firstElement[0].classList.contains("activate") && !lastElement[0].classList.contains("activate")){
			activate(this);
			activate(firstElement[0]);

		}
		if(this.classList.contains("activate") && !lastElement[0].classList.contains("activate")){
			priority = 2;
		}
		if(!this.classList.contains("activate") && !firstElement[0].classList.contains("activate") && !lastElement[0].classList.contains("activate")){
			priority = 0;
		}
	}
	else if(previous[0].id == "priority-mid"){
		midElement = $(this).prev("img");
		firstElement = midElement.prev("img");
		if(firstElement[0].classList.contains("activate") && midElement[0].classList.contains("activate")){
			activate(this);
		}
		if(firstElement[0].classList.contains("activate") && !midElement[0].classList.contains("activate")){
			activate(this);
			activate(midElement[0]);
		}
		if(!midElement[0].classList.contains("activate") && !firstElement[0].classList.contains("activate")){
			activate(this);
			activate(firstElement[0]);
			activate(midElement[0]);
		}
		priority = 3;
	}
});

/**
 * JQuery for fadeOut() i.e. for preloader's animation
 */
 $(window).on('load', function () {
    $("#preloader").delay(3000).fadeOut('slow');
});

/**
 * Modified Code for menu i.e. hamburger 
 */

hamburger.addEventListener('click', ()=>{
   hamburger.classList.toggle("active");
   document.querySelector(".spare").classList.toggle("active");
   menu.classList.toggle("active");
});
document.querySelector(".spare").addEventListener('click', ()=>{
	document.querySelector(".spare").classList.toggle("active");
	menu.classList.toggle("active");
	hamburger.classList.toggle("active");
});
