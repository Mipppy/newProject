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
}

function averagesHTML(data) {
    var overall = []
    parsedData = HTMLParser(data)
    var d = parsedData.getElementById("courseAverageTable")
    var rows = d.querySelectorAll("tr");
    var go = document.createElement("tbody")
    document.getElementById("averageTable").appendChild(go)
    rows.forEach(function (row) {
        var cols = row.querySelectorAll("td")
        var td = document.createElement("tr")
        go.appendChild(td)
        cols.forEach(function (col, index) {
            col.setAttribute("scope", "col")
            if (index === cols.length - 1) {
                overall.push(parseFloat(col.innerHTML))
                if (parseFloat(col.innerHTML) <= 65)
                {
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
}

function personDataHTML(data) {
    parsedData = HTMLParser(data)
    console.log(parsedData)
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
    for (key in data) {
        if (data.hasOwnProperty(key) && data.hasOwnProperty(key)) {
            const specData = data[key];
            const func = functionMapper[key];
            func(specData);
        }
    }
    hideElements()
    showElements()
}


function HTMLParser(html) {
    dom = new DOMParser().parseFromString(html, "text/html")
    return dom
}