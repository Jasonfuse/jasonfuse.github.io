const puppyList = document.getElementById("puppyList");
const singlePuppyInfo = document.getElementById("singlePuppy");

const pupList = {
    puppies: [],
    singlePuppy: undefined
};

window.addEventListener("hashchange", () => {
    renderPuppyList();
    selectPuppy();
});

function selectPuppy() {
    getEventFromHash();
    if(pupList.singlePuppy) renderSinglePuppy();
    else singlePuppyInfo.innerHTML = `
        <p> Please select one of these cute puppies for more info! </p>
    `;
}

function getEventFromHash() {
    const hash = window.location.hash.slice(1) * 1;
    
    const singlePup = pupList.puppies.find(puppy => {
        return puppy.id === hash;
    });

    pupList.singlePuppy = singlePup;
}

async function renderSinglePuppy() {
    const response = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/2307/players/${pupList.singlePuppy.id}`)
    const singlePupData = await response.json();

    const teamMembers = singlePupData.data.player.team.players.map(puppy => {
        return puppy.name;
    });
    teamMembers.splice(teamMembers.indexOf(pupList.singlePuppy.name), 1);

    singlePuppyInfo.innerHTML = `
        <h3> ${pupList.singlePuppy.name} </h3>
        <img src = ${pupList.singlePuppy.imageUrl}>
        <p> Breed: ${pupList.singlePuppy.breed} </p>
        <p> Status: ${pupList.singlePuppy.status} </p>
        <p> Team Members: ${teamMembers.join(', ')} </p>
    `;
}

function renderPuppyList() {
    const hash = window.location.hash.slice(1) * 1;
    const html = pupList.puppies.map(puppy => {
        return `<a href = '#${puppy.id !== hash ? puppy.id : ''}' class = '${puppy.id === hash ? 'selected': ''}'>${puppy.name}</a>`;
    });
    puppyList.innerHTML = html.join('');
}

async function getPuppyList() {
    const info = await fetch("https://fsa-puppy-bowl.herokuapp.com/api/2307/players/")
    const pupData = await info.json();
    pupList.puppies = pupData.data.players;
}

async function render() {
    await getPuppyList();
    renderPuppyList();
    selectPuppy();
}

render();