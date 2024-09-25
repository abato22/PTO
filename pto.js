//REMOVING COOKIE AFTER LOGGING OUT
//getting element with that id
const logout = document.getElementById("h1-log-out-id");
//adding event listener to element, calling a function on a click on log out button
logout.addEventListener("click", removeCookie)

function removeCookie(){
    //removing cookie by setting its expiring date somewhere in the past
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=pto.html;";
}



//SELECTING EMPLOYEES AND SHOWING THEIR DATA
let employeesName = [];
let employeesFullname = [];
let indexOfEmployee;
let allEmployees;
let empName;

const selectingEmployee = document.getElementById("select-employee")
const menuArrow = document.getElementById("arrow")
const employeeMenu = document.getElementById("employee-menu");
const visibleUserContainer = document.getElementById("visible-employee-container")
const ptoContainer = document.getElementById("pto-container")

//show employees when "select employee" button is clicked
function showMenu(){
    employeeMenu.classList.toggle("show")
    menuArrow.classList.toggle("arrow")
}

selectingEmployee.addEventListener("click", function (e) {
    e.stopPropagation();
    showMenu();
  });

//if it is clicked somewhere else on page when menu is open it should close
document.documentElement.addEventListener("click", function () {
    if (employeeMenu.classList.contains("show")) {
      showMenu();
    }
});




//calling async function when page is loaded
document.addEventListener('DOMContentLoaded', async function () {
    try {
        //fetching data from page
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        //saving fetched data in json format
        const employee = await res.json();

        for(let index = 0; index < employee.length; index++) {
            element = employee[index];                 //from all data pushing only names of employees 
            employeesName.push(element.name)           //names of employees in an array
            employeesFullname.push(element.name)
        }
        employeesName.sort();       //sorting array with names

        for (let index = 0; index < employeesName.length; index++) {
            const element = document.createElement('div');     //creating elements of type div
            element.className = "employee-name"                //where names of employees will be shown
            element.setAttribute("data-value", employeesName[index])
            element.innerHTML = `${employeesName[index]}`
            employeeMenu.appendChild(element);
        }
        
        allEmployees = document.querySelectorAll("#employee-menu .employee-name")
        for (let index = 0; index < allEmployees.length; index++) {
            const oneEmployee = allEmployees[index];
            oneEmployee.addEventListener("click", getEmployeeName)
            oneEmployee.addEventListener("click", showData)

        }
        
        //getting name of selected employee
        async function getEmployeeName(event) {
            const clickedEmployee = event.target
            const nameOfEmployee = clickedEmployee.getAttribute("data-value")
            empName = nameOfEmployee
            for (let index = 0; index < employeesFullname.length; index++) {
                const element = employeesFullname[index];   
                if(nameOfEmployee===element){               //checking if name of clicked element is equal to any name in the list
                    indexOfEmployee = index + 1             //setting an index to the real index of employee
                }
            }
        
            let returnedIndex = indexOfEmployee

            try {
                //by previous index choosing of which employee data will be fetched when its name is clicked
                for (let index = returnedIndex; index < returnedIndex + 1; index++) {
                    const res = await fetch('https://jsonplaceholder.typicode.com/users/'+[index]);
                    const employee = await res.json();
        
                    document.getElementById('employee-id').querySelector('.content').innerText = employee.id;             //connecting fetched
                    document.getElementById('employee-username').querySelector('.content').innerText = employee.username; //data with ids and 
                    document.getElementById('employee-full-name').querySelector('.content').innerText = employee.name;    //classes
                    document.getElementById('employee-email').querySelector('.content').innerText = employee.email;
                    document.getElementById('employee-phone').querySelector('.content').innerText = employee.phone;
                    document.getElementById('employee-website').querySelector('.content').innerText = employee.website;
        
                    const element = document.createElement("div") //creating div that will show employee data
                    element.innerHTML = `
                    <h2 id="h2-title">Employee info</h4>
                    <hr id="line">
                    <div id="employee-full-name" class="visible-employee-info">
                        <label>Fullname:</label>
                        <label class="content">${employee.name}</label>
                    </div>
                    <div id="employee-username" class="visible-employee-info">
                        <label>Username:</label>
                        <label class="content">${employee.username}</label>
                    </div>
                    <div id="employee-id" class="visible-employee-info">
                        <label>Id:</label>
                        <label class="content">${employee.id}</label>
                    </div>
                    <div id="employee-email" class="visible-employee-info">
                        <label>Email:</label>
                        <label class="content">${employee.email}</label>
                    </div>
                    <div id="employee-phone" class="visible-employee-info">
                        <label>Phone:</label>
                        <label class="content">${employee.phone}</label>
                    </div>
                    <div id="employee-website" class="visible-employee-info">
                        <label>Website:</label>
                        <label class="content">${employee.website}</label>
                    </div>`

                    visibleUserContainer.appendChild(element) //appending this div to container where employee data is showm

                    const element2 = document.createElement("div")  //creating divs for upcoming, 
                    element2.classList.add("pto-container")         //current and past ptos
                    element2.classList.add(employee.id)
                    element2.innerHTML = `
                    <div id="past-pto" class="pto">
                        <h1>Past PTO</h1>
                    </div>
                    <div id="current-pto" class="pto">
                        <h1>Current PTO</h1>
                    </div>
                    <div id="upcoming-pto" class="pto">
                        <h1>Upcoming PTO</h1>
                    </div>`
                    ptoContainer.appendChild(element2)

                    createPto(returnedIndex) //calling function that will decide where created div will be shown
                }
            }
            catch (e) {
                console.error(e);
            } 
        }
    } 
    catch (e) {
        console.error(e);
    }
});


//function that prevents showing multiple employee data divs
function showData(){
    //if there is more than one info container the previous one is being removed
    if(visibleUserContainer.childNodes.length > 1){
        visibleUserContainer.removeChild(visibleUserContainer.lastElementChild)
    }
    //if there is more pto containers they should be deleted so only one is shown
    while(ptoContainer.childNodes.length > 0){
        ptoContainer.removeChild(ptoContainer.lastChild)
    }
}








//CREATING START DATE CALENDAR
const startMonthYearElement = document.getElementById("start-monthYear")
const startDatesElement = document.getElementById("start-dates")
const startPrevBtn = document.getElementById("start-prevBtn")
const startNextBtn = document.getElementById("start-nextBtn")

let startCurrentDate = new Date();
let selectedMonthYearStart;

const createStartCalendar = () => {
    const currentYear = startCurrentDate.getFullYear() //getting current year
    const currentMonth = startCurrentDate.getMonth()   //getting current month

    const firstDay = new Date(currentYear, currentMonth, 0)  //getting first day of the month
    const lastDay = new Date(currentYear, currentMonth + 1, 0) //getting last day of the month
    const totalDays = lastDay.getDate()                         //counting number of total days
    const firstDayIndex = firstDay.getDay()
    const lastDayIndex = lastDay.getDay()

    //selecting in which shape will month and year be shown
    const monthYearString = startCurrentDate.toLocaleString("da-DK", {month:"numeric",year:"numeric"})
    startMonthYearElement.textContent = monthYearString
    selectedMonthYearStart = monthYearString

    let datesHTML = ""

    for(let i = firstDayIndex; i > 0; i--){  //gettting dates that belong to the previous month but also belong to the week in current month
        datesHTML += `<div></div>`
    }

    for(let i = 1; i <= totalDays; i++){     //getting dates in current month 
        const date = new Date(currentYear, currentMonth, i)
        const activeClass = date.toDateString() === new Date().toDateString() ? "active" : "" //adding class "active" to the current day
        datesHTML += `<div class="date ${activeClass}" data-value="${i}">${i}</div>`
    }

    if(lastDayIndex !== 0){           //gettting dates that belong to the next month but also belong to the week in current month
        for(let i = 1; i <= 7 - lastDayIndex; i++){
            datesHTML += `<div></div>`
        }
    }

    startDatesElement.innerHTML = datesHTML
}

//moving to month previous month by clicking on this button
startPrevBtn.addEventListener("click", () => {
    startCurrentDate.setMonth(startCurrentDate.getMonth() - 1)
    createStartCalendar()
})

//moving to month next month by clicking on this button
startNextBtn.addEventListener("click", () => {
    startCurrentDate.setMonth(startCurrentDate.getMonth() + 1)
    createStartCalendar()
})

createStartCalendar()



//CREATING END DATE CALENDAR
const endMonthYearElement = document.getElementById("end-monthYear")
const endDatesElement = document.getElementById("end-dates")
const endPrevBtn = document.getElementById("end-prevBtn")
const endNextBtn = document.getElementById("end-nextBtn")

let endCurrentDate = new Date();
let selectedMonthYearEnd;

const createEndCalendar = () => {
    const currentYear = endCurrentDate.getFullYear()
    const currentMonth = endCurrentDate.getMonth()

    const firstDay = new Date(currentYear, currentMonth, 0)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const totalDays = lastDay.getDate()
    const firstDayIndex = firstDay.getDay()
    const lastDayIndex = lastDay.getDay()

    const monthYearString = endCurrentDate.toLocaleString("da-DK", {month:"numeric", year:"numeric"})
    endMonthYearElement.textContent = monthYearString
    selectedMonthYearEnd = monthYearString

    let datesHTML = ""

    for(let i = firstDayIndex; i > 0; i--){
        datesHTML += `<div></div>`
    }

    for(let i = 1; i <= totalDays; i++){
        const date = new Date(currentYear, currentMonth, i)
        const activeClass = date.toDateString() === new Date().toDateString() ? "active" : ""
        datesHTML += `<div class="date ${activeClass}" data-value="${i}">${i}</div>`
    }

    if(lastDayIndex !== 0){
        for(let i = 1; i <= 7 - lastDayIndex; i++){
            datesHTML += `<div></div>`
        }
    }

    endDatesElement.innerHTML = datesHTML
}

endPrevBtn.addEventListener("click", () => {
    endCurrentDate.setMonth(endCurrentDate.getMonth() - 1)
    createEndCalendar()
})

endNextBtn.addEventListener("click", () => {
    endCurrentDate.setMonth(endCurrentDate.getMonth() + 1)
    createEndCalendar()
})

createEndCalendar()


//adding class "selected" to clicked date
let valueOfSelectedDateStart;
let monthLengthStart = document.querySelectorAll("#start-dates .date") //getting all dates in current month
for (let i = 0; i < monthLengthStart.length; i++) {
    const oneDate = monthLengthStart[i];
    oneDate.addEventListener('click', selectedDateStart);
}
function selectedDateStart(event){
    const clickedDate = event.currentTarget    
    valueOfSelectedDateStart = clickedDate.getAttribute("data-value") //getting value of clicked date
    const alreadyClickedDate = document.querySelector("#start-dates .date.selected") //getting date that was already clicked if it exists
    if(alreadyClickedDate === null){ //if it does not exists adding class "selected" to clicked date
        clickedDate.classList.add("selected")  
    }
    else{
        alreadyClickedDate.classList.remove("selected") //if it does exists removing selected class and adding it to new clicked date
        clickedDate.classList.add("selected")  
    }  
}

//same function as above but used when month is changed by previous and next button
const startButtons = [startPrevBtn, startNextBtn] 
for (let index = 0; index < startButtons.length; index++) {
    const element = startButtons[index];
    element.addEventListener("click", changeMonthButtonStart)
}
function changeMonthButtonStart(){
    let monthLengthStart = document.querySelectorAll("#start-dates .date")
    for (let i = 0; i < monthLengthStart.length; i++) {
        const oneDate = monthLengthStart[i];
        oneDate.addEventListener('click', selectedDateStart);
    }
    function selectedDateStart(event){
        const clickedDate = event.currentTarget
        valueOfSelectedDateStart = clickedDate.getAttribute("data-value")
        const alreadyClickedDate = document.querySelector("#start-dates .date.selected")
        if(alreadyClickedDate === null){
            clickedDate.classList.add("selected")  
        }
        else{
            alreadyClickedDate.classList.remove("selected")
            clickedDate.classList.add("selected")  
        }  
    }
}

//same function as above just for end date calendar
let valueOfSelectedDateEnd;
let monthLengthEnd = document.querySelectorAll("#end-dates .date")
for (let i = 0; i < monthLengthEnd.length; i++) {
    const oneDate = monthLengthEnd[i];
    oneDate.addEventListener('click', selectedDateEnd);
}
function selectedDateEnd(event){
    const clickedDate = event.currentTarget
    valueOfSelectedDateEnd = clickedDate.getAttribute("data-value")
    const alreadyClickedDate = document.querySelector("#end-dates .date.selected")
    if(alreadyClickedDate === null){
        clickedDate.classList.add("selected")  
    }
    else{
        alreadyClickedDate.classList.remove("selected")
        clickedDate.classList.add("selected")  
    }  
}

//same function as above when month is changed just for end date calendar
const endButtons = [endPrevBtn, endNextBtn]
for (let index = 0; index < endButtons.length; index++) {
    const element = endButtons[index];
    element.addEventListener("click", changeMonthButtonEnd)
}
function changeMonthButtonEnd(){
    let monthLengthEnd = document.querySelectorAll("#end-dates .date")
    for (let i = 0; i < monthLengthEnd.length; i++) {
        const oneDate = monthLengthEnd[i];
        oneDate.addEventListener('click', selectedDateEnd);
    }
    function selectedDateEnd(event){
        const clickedDate = event.currentTarget
        valueOfSelectedDateEnd = clickedDate.getAttribute("data-value")
        const alreadyClickedDate = document.querySelector("#end-dates .date.selected")
        if(alreadyClickedDate === null){
            clickedDate.classList.add("selected")  
        }
        else{
            alreadyClickedDate.classList.remove("selected")
            clickedDate.classList.add("selected")  
        }  
    }
}










//ADDING PTO
const addPtoButton = document.getElementById("addPtoBtn")
addPtoButton.addEventListener("click", noEmployee)

//if employee is yet not selected pto cannot be added 
function noEmployee(){
    if(empName === undefined){
        alert("Employee must be chosen before adding pto!")
    }
}

//function for creating everything about every pto
function createPto(returnedIndex){
    let currentDate = new Date()  //getting exact current date
    currentDate.setHours(0, 0, 0)
    const pastPto = document.getElementById("past-pto")
    const currentPto = document.getElementById("current-pto")
    const upcomingPto = document.getElementById("upcoming-pto")
    const ptoButton = document.getElementById("addPtoBtn")
    ptoButton.addEventListener("click", ptoButtonSubmit)


    //function that creates pto when add pto button is clicked
    function ptoButtonSubmit(){
        
        let fullDateStart = valueOfSelectedDateStart + "." + selectedMonthYearStart + " "; //creating full start date
        let fullDateEnd = valueOfSelectedDateEnd + "." + selectedMonthYearEnd + " ";       //creating full end date

        let splitDateStart = fullDateStart.split(".").map(Number)  //converting string to an array of numbers
        let splitDateEnd = fullDateEnd.split(".").map(Number)
        
        let startDate = new Date(splitDateStart[2], splitDateStart[1] - 1, splitDateStart[0])//creating real start date with numbers from above
        let endDate = new Date(splitDateEnd[2], splitDateEnd[1] - 1, splitDateEnd[0]) //creating real end date with numbers from above
        endDate.setHours(1) //setting end date hours to 01:00:00 so it differs from start date which is 00:00:00 when both
                            //start and end date are selected as current date


        //checking if both start and end date are selected 
        if(valueOfSelectedDateStart !== undefined && valueOfSelectedDateEnd !== undefined){
            //checking if start date is greater than end date
            if(startDate <= endDate){
                const ptoElement = document.createElement("div")//creating pto div
                ptoElement.classList.add("pto-element")
                //checking if start date is in range for spring
                if(splitDateStart[1]===4 || splitDateStart[1]===5 || splitDateStart[1]===3 && splitDateStart[0] >= 21 || splitDateStart[1]===6 && splitDateStart[0] <= 20){
                    //creating content of pto
                    ptoElement.innerHTML = `
                    <div class="pto-info spring">
                        <label class="content">${fullDateStart} - ${fullDateEnd}</label>
                        <div id="x-button" class="x-button">x</div>
                    </div>`
                }
                if(splitDateStart[1]===7 || splitDateStart[1]===8 || splitDateStart[1]===6 && splitDateStart[0] >= 21 || splitDateStart[1]===9 && splitDateStart[0] <= 22){
                    ptoElement.innerHTML = `
                    <div class="pto-info summer">
                        <label class="content">${fullDateStart} - ${fullDateEnd}</label>
                        <div id="x-button" class="x-button">x</div>
                    </div>`
                }
                if(splitDateStart[1]===10 || splitDateStart[1]===11 || splitDateStart[1]===9 && splitDateStart[0] >= 23 || splitDateStart[1]===12 && splitDateStart[0] <= 20){
                    ptoElement.innerHTML = `
                    <div class="pto-info autumn">
                        <label class="content">${fullDateStart} - ${fullDateEnd}</label>
                        <div id="x-button" class="x-button">x</div>
                    </div>`
                }
                if(splitDateStart[1]===1 || splitDateStart[1]===2 || splitDateStart[1]===12 && splitDateStart[0] >= 21 || splitDateStart[1]===3 && splitDateStart[0] <= 20){
                    ptoElement.innerHTML = `
                    <div class="pto-info winter">
                        <label class="content">${fullDateStart} - ${fullDateEnd}</label>
                        <div id="x-button" class="x-button">x</div>
                    </div>`
                }
                //checking if both start and end date are before current date what will put this pto in the past pto column
                if(startDate < currentDate && endDate < currentDate){
                    pastPto.appendChild(ptoElement)
                    ptoTime = "pastPto"
                    localStorageFunction(ptoTime)
                }
                //checking if both start and end date are after current date what will put this pto in the upcoming pto column
                else if(startDate > currentDate && endDate > currentDate){
                    upcomingPto.appendChild(ptoElement)
                    ptoTime = "upcomingPto"
                    localStorageFunction(ptoTime)
                }
                else{
                    currentPto.appendChild(ptoElement)
                    ptoTime = "currentPto"
                    localStorageFunction(ptoTime)
                }

                //function that stores all ptos in local storage by their type
                function localStorageFunction(ptoTime){
                    const localStorageData = localStorage.getItem(ptoTime)
                    const localStorageList = localStorageData ? JSON.parse(localStorageData) : []; //checking if there is already something stored
                    Array(localStorageList)
                    const localStorageElement = {
                        userId : returnedIndex,
                        sDate : fullDateStart,
                        eDate : fullDateEnd 
                    }
                    localStorageList.push(localStorageElement)
                    const updatedLocalStorageElement = JSON.stringify(localStorageList)
                    localStorage.setItem(ptoTime, updatedLocalStorageElement)
                }
            }
            else{
                alert("Start date must not be greater than end date!")
                return;
            }
        }
        else{
            alert("Missing start or end date!")
            return;
        }
        
        let normalStartDates = document.querySelectorAll("#start-dates .date") //getting all dates in current month
        for (let index = 0; index < normalStartDates.length; index++) {
            const element = normalStartDates[index];
            element.classList.remove("selected") //removing "selected" class from already clicked date
        }

        let normalEndDates = document.querySelectorAll("#end-dates .date")
        for (let index = 0; index < normalEndDates.length; index++) {
            const element = normalEndDates[index];
            element.classList.remove("selected")
        }
    }
}