(function (){

const currState = {
    rows: -1,
    columns: 4,
    displayContainer: document.querySelector('.display-container'),
    allUsers: [],
    isFetchingOn: true,
}


function displayUser(user){
    if(!user) return;

    const userElement = document.createElement('div'); 
    userElement.classList.add('user');
    userElement.style.width = `${100/currState.columns}%`;

    const userPhoto = document.createElement('img'); 
    userPhoto.setAttribute('src',user.picture.medium);
    userPhoto.setAttribute('alt',`Photo of ${user.name.first}`);

    const userInfo = document.createElement('div');
    userInfo.classList.add('userInfo')

    const userName = document.createElement('span'); 
    userName.classList.add('userName');
    userName.innerText = user.name.first+' '+user.name.last;

    const userEmail = document.createElement('span');
    userEmail.classList.add('userEmail');
    userEmail.innerText = user.email;

    const userPhone = document.createElement('span');
    userPhone.classList.add('userPhone');
    userPhone.innerText = user.phone;

    userInfo.append(userName,userEmail,userPhone);
    userElement.append(userPhoto,userInfo);
    currState.displayContainer.append(userElement);

    userElement.addEventListener('mouseover',() => {userInfo.style.opacity = 1})
    userElement.addEventListener('mouseout',() => {userInfo.style.opacity = 0})
}


async function getData(url){
    try{
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    catch(error){
        console.log(error)
        return error;
    }
}


function displayAllRandomUsers(){
    async function asyncLoop(){
        let data = await getData('https://randomuser.me/api');
        if(!currState.isFetchingOn 
            || currState.rows * currState.columns === currState.allUsers.length){
            currState.isFetchingOn = false;
            return;  
        } 
        else if(data.results){
            let newUser = data.results[0];
            currState.allUsers.push(newUser);
            displayUser(newUser);
        }
        setTimeout(() => asyncLoop(),0);
    }
    asyncLoop();
}


function removeExcessUsers(){
    currState.isFetchingOn = false;
    const users = currState.displayContainer.querySelectorAll('.user');
    let userCount = users.length;
    while(userCount > currState.columns*currState.rows){
        currState.displayContainer.removeChild(users[--userCount]);
        currState.allUsers.pop();
    }
}


function reorganizeDisplay(){
    const users = currState.displayContainer.querySelectorAll('.user');
    users.forEach((user) => user.style.width = `${100/currState.columns}%`)
}


function handleFormSubmit(event,inputForm){
    event.preventDefault();
    const inputElements = inputForm.querySelectorAll('input');
    const rowInput = inputElements[0];
    const columnInput = inputElements[1];
    if(!rowInput.value || !columnInput.value) return;
    currState.rows = rowInput.value;
    currState.columns = columnInput.value;
    reorganizeDisplay();

    if(currState.rows * currState.columns < currState.allUsers.length){
        removeExcessUsers();
    }
    else if(!currState.isFetchingOn){
        currState.isFetchingOn = true;
        displayAllRandomUsers();
    }
}


const inputForm = document.querySelector('form');
inputForm.addEventListener('submit',(event) => handleFormSubmit(event, inputForm))
displayAllRandomUsers();

})();