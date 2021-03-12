var margin = { top: 100, right: 100, bottom: 100, left: 100 },
    width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
var playerInfoArray = []
var selectedPlayers = []
var outputData = [[
    { axis: "Win rate", value: 0 },
    { axis: "First blood rate", value: 0 },
    { axis: "Kill participation", value: 0},
    { axis: "Average share of team death", value: 0 },
    { axis: "Gold share", value: 0 },
    { axis: "Damage", value: 0 }
]]
var playerSelect = document.getElementById("playerSelect");
var roles = []
var teams = []
var sortingAlts = []
var colourArray = ["#00A0B0"]
var activeFilters = {teamFilter: false, roleFilter: false}

var color = d3.scale.ordinal()
    .range(colourArray);

var radarChartOptions = {
    w: 440,
    h: 440,
    margin: margin,
    maxValue: 100,
    levels: 5,
    roundStrokes: true,
    color: color
};

function getRandomColor() { // generates a random colour when a player is selected
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  
  return color;
}

d3.csv("../player-stats.csv", function(data) { // loop through the excel document to extract the data and create an object we can use later
    for (let i =0; i<data.length; i++) {
        let playerName = document.createElement("p");
        playerName.innerHTML = data[i].Player
        playerName.className = "playerName"
        playerName.id = i
        playerName.onclick = function() { selectplayer(parseInt(playerName.id)) };
        playerSelect.appendChild(playerName)
        data[i].id = i;
        data[i].teamFilter = true;
        data[i].roleFilter = true;
        if (!roles.includes(data[i].Pos)) {
            roles.push(data[i].Pos)
        }
        if (!teams.includes(data[i].Team)) {
            teams.push(data[i].Team)
        }
    }
    for (let i=0; i<teams.length; i++) {
        let teamName = document.createElement("option");
        teamName.innerHTML = teams[i]
        teamName.value = teams[i].toLowerCase()
        teamName.onclick = function() { filterPlayers("team", teams[i]) };
        document.getElementById("teamSelect").appendChild(teamName)
    }
    for (let i=0; i<roles.length; i++) {
        let roleName = document.createElement("option");
        roleName.innerHTML = roles[i]
        roleName.value = roles[i].toLowerCase()
        // playerName.onclick = function() { selectplayer(parseInt(playerName.id)) };
        document.getElementById("roleSelect").appendChild(roleName)
    }
    playerInfoArray = data
    
    RadarChart("#radarChart", outputData, radarChartOptions);
    outputData.splice(0, 1)
    colourArray.splice(0, 1)
})

function selectplayer(id) { // When a player is selected from the list, a card is created from the <template> tag with the player's info
    for (let i=0; i<selectedPlayers.length; i++) {
        if (selectedPlayers[i].id === id) {
            return
        }
    }
    var temp = document.getElementById("playerCardTemplate");
    let playerColour = getRandomColor()
    var clon = temp.content.cloneNode(true);
    playerInfoArray[id].playerColour = playerColour
    clon.querySelector(".playerCard").id = "player_" + id
    clon.querySelector(".profilePicture").src = "PlayerImage/" + playerInfoArray[id].Player.replace(/ /g,"_") + ".png"
    clon.querySelector(".playerName").textContent = playerInfoArray[id].Player
    clon.querySelector(".playerTeam").textContent = playerInfoArray[id].Team
    clon.querySelector(".playerPos").textContent = playerInfoArray[id].Pos
    clon.querySelector(".playerColour").style.backgroundColor = playerColour
    clon.querySelector(".delete").onclick = function() { removePlayer(parseInt(id)) };

    document.getElementById("playerProfiles").appendChild(clon);
    addPlayer(id)
}

function addPlayer(playerId) { // add a player to the selectedPLayers array and add their colour to colourArray
    selectedPlayers.push(playerInfoArray[playerId])
    colourArray.push(playerInfoArray[playerId].playerColour)
    updatePlayer()
}

function updatePlayer() {
    outputData = []
    
    for (let i=0; i<selectedPlayers.length; i++) {
        let tempArr = [ 
            // add all selected players to outputData to display them in the radar chart
            {axis: "Win rate", value: parseFloat(selectedPlayers[i]["W%"])},
            {axis: "First blood rate", value: parseFloat(selectedPlayers[i]["FB%"])},
            {axis: "Kill participation", value: parseFloat(selectedPlayers[i]["KP"])},
            {axis: "Average share of team death", value: parseFloat(selectedPlayers[i]["DTH%"])},
            {axis: "Gold share", value: parseFloat(selectedPlayers[i]["GOLD%"])},
            {axis: "Damage", value: parseFloat(selectedPlayers[i]['DMG%'])}
        ]
        outputData.push(tempArr)
    }
    return RadarChart("#radarChart", outputData, radarChartOptions);
}

function removePlayer(id) { // removes player when pressing x on playercard
    for (let i=0; i<selectedPlayers.length; i++) { // loops through all selected players to find the player to remove, also removes their colour from colourArray
        if (selectedPlayers[i].id === id) {
            for (let j=0; j<colourArray.length; j++) {
                if (selectedPlayers[i].playerColour === colourArray[j]) {
                    colourArray.splice(j, 1)
                }
            }
            selectedPlayers.splice(i, 1)
        }
    }
    
    document.getElementById("player_" + id).remove()
    if (selectedPlayers.length<1) { // if there are no selected players, use standard object to not break the radar chart
        outputData = [[
            { axis: "Win rate", value: 0 },
            { axis: "First blood rate", value: 0 },
            { axis: "Kill participation", value: 0},
            { axis: "Average share of team death", value: 0 },
            { axis: "Gold share", value: 0 },
            { axis: "Damage", value: 0 }
        ]]
        RadarChart("#radarChart", outputData, radarChartOptions);
    } else {
        updatePlayer()
    }
}

function resetFilters() {
    playerInfoArray.map(player => {
        player.teamFilter = true
        player.roleFilter = true
        document.getElementById(player.id).style.display = 'block'
    })
    document.getElementById("teamSelect").value = "team"
    document.getElementById("roleSelect").value = "role"
    document.getElementById("sortBySelect").value = "sortby"
    filterPlayers("sortBy", "alphabetically")
}

function filterPlayers(filterType, filterBy) {
    if (filterBy === ("sortby" || "team" || "role")){
        return
    }
    if (filterType === "team") {
        activeFilters.teamFilter = true
        playerInfoArray.filter(player => {
            if (!(player.Team.toLowerCase() === filterBy.toLowerCase())) {
                player.teamFilter = false
            }
            else {
                player.teamFilter = true
            }
            document.getElementById(player.id).style.display = (player.roleFilter && player.teamFilter ? 'block' : 'none')
        })
    } else if (filterType === "role") {
        activeFilters.roleFilter = true
        playerInfoArray.filter(player => {
            if (!(player.Pos.toLowerCase() === filterBy.toLowerCase())) {
                player.roleFilter = false
            }
            else {
                player.roleFilter = true
            }
            document.getElementById(player.id).style.display = (player.roleFilter && player.teamFilter ? 'block' : 'none')
        })
    } else if (filterType === "sortBy") {
        var divCard = playerSelect.children
        divCard = Array.prototype.slice.call(divCard)
        if (filterBy.toLowerCase() === "alphabetically".toLowerCase())
            divCard.sort(function(a, b) {
                if (a.textContent < b.textContent)
                    return -1;
                if (a.textContent > b.textContent)
                    return 1;
                return 0;
            })
        if (filterBy.toLowerCase() === "Highest kill Participation".toLowerCase()) {
            divCard.sort(function(a, b){
                return parseFloat(playerInfoArray[b.id]['KP']) - parseFloat(playerInfoArray[a.id]['KP'])
            })
        }
        if (filterBy.toLowerCase() === "Most damage".toLowerCase()) {
            divCard.sort(function(a, b){
                return parseFloat(playerInfoArray[b.id]['DMG%']) - parseFloat(playerInfoArray[a.id]['DMG%'])
            })
        }
        if (filterBy.toLowerCase() === "Highest winrate".toLowerCase()) {
            divCard.sort(function(a, b){
                //console.log(parseFloat(playerInfoArray[a.id]["W%"]))
                return parseFloat(playerInfoArray[b.id]["W%"]) - parseFloat(playerInfoArray[a.id]["W%"])
            })
        }
        if (filterBy.toLowerCase() === "Highest FB".toLowerCase()) {
            divCard.sort(function(a, b){
                //console.log(parseFloat(playerInfoArray[a.id]["W%"]))
                return parseFloat(playerInfoArray[b.id]["FB%"]) - parseFloat(playerInfoArray[a.id]["FB%"])
            })
        }
        if (filterBy.toLowerCase() === "Highest GS".toLowerCase()) {
            divCard.sort(function(a, b){
                //console.log(parseFloat(playerInfoArray[a.id]["W%"]))
                return parseFloat(playerInfoArray[b.id]["GOLD%"]) - parseFloat(playerInfoArray[a.id]["GOLD%"])
            })
        }
        if (filterBy.toLowerCase() === "Highest ASD".toLowerCase()) {
            divCard.sort(function(a, b){
                //console.log(parseFloat(playerInfoArray[a.id]["W%"]))
                return parseFloat(playerInfoArray[b.id]["DTH%"]) - parseFloat(playerInfoArray[a.id]["DTH%"])
            })
        }
        playerSelect.innerHTML = ''
        for (let i = 0; i < divCard.length; i++) {
            playerSelect.appendChild(divCard[i]);
        }
    }
}