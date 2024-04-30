const functionMapper = {
    "gradeHTML": gradeHTML,
    "averagesHTML": averagesHTML,
    "pictureBase64": pictureBase64,
    "personDataHTML": personDataHTML,
    "attendenceHTML": attendenceHTML,
    "markingGradesHTML": markingGradesHTML
}

function gradeHTML(data) {
    parsedData = HTMLParser(data)
    var table = parsedData.querySelector("table")
    const tableAnchors = parsedData.querySelectorAll('table a');
    tableAnchors.forEach(anchor => {
        anchor.removeAttribute('href');
        anchor.style.fontWeight = "bold"
    });
    table.setAttribute("class", "table table-striped table-hover table-bordered")
    document.getElementById("assignments").appendChild(table)
}

function averagesHTML(data) {
    var overall = []
    parsedData = HTMLParser(data)
    var d = parsedData.getElementById("courseAverageTable")
    var rows = d.querySelectorAll("tr");
    var go = document.createElement("tbody")
    document.getElementById("averageTable").appendChild(go)
    rows.forEach(function(row) {
        var cols = row.querySelectorAll("td")
        var td = document.createElement("tr")
        go.appendChild(td)
        cols.forEach(function(col, index) {
            col.setAttribute("scope", "col")
            if (index === cols.length - 1) {
                overall.push(parseFloat(col.innerHTML))
                if (parseFloat(col.innerHTML) <= 65) {
                    var f = document.createElement("img")
                    f.src = "static/images/alert.svg"
                    f.width = 17.5
                    f.height = 17.5
                    col.appendChild(f)
                }
                col.style.fontWeight = "bold"
            }
            td.appendChild(col)
        })
    });
    var total = 0;
    for (var i = 0; i < overall.length; i++) {
        total += overall[i];
    }
    var avg = (total / overall.length).toFixed(2);
    document.getElementById("overall").innerHTML = avg
}

function pictureBase64(data) {
    document.getElementById("pureDisgust").src = data
}

function personDataHTML(data) {
    var parsedData = HTMLParser(data)
    var table = parsedData.querySelector("table")
    var usefulTr = parsedData.querySelector("tr")
    var nodes = usefulTr.childNodes
    var tr1 = nodes[2]
    var tr2 = nodes[3]

    var data = {
        yourAmazingName: "",
        yourEvenMoreAmazingEmail: "",
        yourHome: "",
        yourUnimportantBirthday: "",
        whoNeedsThisAnyway: "",
        actuallySomewhatImportant: ""
    }

    var allsLis = tr1.querySelectorAll("li")
    data.yourAmazingName = allsLis[0].getElementsByTagName('span')[1].innerText + " " + allsLis[2].getElementsByTagName('span')[1].innerText;
    data.yourUnimportantBirthday = allsLis[4].getElementsByTagName('span')[1].innerText;
    data.yourEvenMoreAmazingEmail = allsLis[6].getElementsByTagName('span')[1].innerText;

    var allsLis2 = tr2.querySelectorAll("li")
    data.whoNeedsThisAnyway = allsLis2[3].getElementsByTagName("span")[1].innerText
    var temp = allsLis2[0].getElementsByTagName("span")[2].getElementsByTagName("div")
    data.yourHome = (temp[0].innerText).trim().replace(/\s+/g, '').replace(/([0-9])([A-Z])/g, '$1 $2').replace(/([a-z])([A-Z])/g, '$1 $2');
    data.actuallySomewhatImportant = allsLis2[6].getElementsByTagName("span")[1].innerText

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var value = data[key]
            document.getElementById(key).innerText = value
        }
    }
}

function attendenceHTML(data) {
    parsedData = HTMLParser(data)
}

function markingGradesHTML(data) {
    parsedData = HTMLParser(data)
}


function hideElements() {
    document.getElementById("loginContainer").setAttribute('style', 'display:none !important');
}

function showElements() {
    for (var ele of document.getElementsByClassName("second")) {
        ele.style.display = "block"
    }
}



function handleData(data) {
    document.title = "Home"
    document.getElementById("loadingAnimation").setAttribute("style", "display: none !important")
    for (key in data) {
        if (data.hasOwnProperty(key) && data.hasOwnProperty(key)) {
            const specData = data[key];
            const func = functionMapper[key];
            func(specData);
        }
    }
    showElements()
}


function HTMLParser(html) {
    dom = new DOMParser().parseFromString(html, "text/html")
    return dom
}

var animeCounter = 0;
var animeInterval = 0;

function startLoadingAnimation() {
    hideElements();
    document.getElementById("loadingAnimation").style.display = "block";
    var progressBar = document.getElementById("progressBar");
    var text = document.getElementById("progressBarText")
    animeInterval = setInterval(() => {
        animeCounter++;
        if (animeCounter >= 100) {
            clearInterval(animeInterval);
        }
        if (animeCounter <= 15) {
            text.innerText = "Sending request..."
        }
        if (animeCounter >= 15 && animeCounter <= 50) {
            text.innerText = "Logging in..."
        }
        if (animeCounter >= 50 && animeCounter <= 75) {
            text.innerText = "Collecting data..."
        }
        if (animeCounter >= 75 && animeCounter <= 95) {
            text.innerText = "Recieving data..."
        }
        if (animeCounter >= 95 && animeCounter <= 100) {
            text.innerText = "Parsing data..."
        }
        progressBar.setAttribute("aria-valuenow", animeCounter);
        progressBar.style.width = animeCounter + "%";
    }, 200);
}