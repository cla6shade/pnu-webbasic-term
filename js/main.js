const key = "12bc474714005e3fb5259fa5f0cfc9be"

function getPosterUrl(movieCd) {
    return new Promise((resolve, reject) => {
        $.ajax("http://server.cla6sha.de:14524?movieCd=" + movieCd.toString(), {dataType: 'json'})
            .done(data => {
                resolve(data.poster);
            }).fail((xhr, textStatus, error) => {
            reject(error);
        })
    })
}

/**
 *
 * @param targetDt
 * @returns {Promise<Object[]>}
 */
function requestDailyBoxOffice(targetDt) {
    return new Promise((resolve, reject) => {
        const url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json";
        $.ajax(url + "?key=" + key + "&targetDt=" + targetDt + "&itemPerPage=" + 10).done(async data => {
            let boxOffice = data.boxOfficeResult.dailyBoxOfficeList;
            for (let movie of boxOffice) {
                let movieCd = movie.movieCd;
                movie.posterUrl = await getPosterUrl(movieCd);
            }
            resolve(boxOffice)
        }).fail((xhr, textStatus, error) => {
            reject(error);
        })
    })
}

async function getDailyBoxOffice(y, m, d) {
    m = m < 10 ? "0" + m.toString() : m.toString();
    d = d < 10 ? "0" + d.toString() : d.toString();
    let targetDt = y + m + d;
    return await requestDailyBoxOffice(targetDt);
}

function onClickDaily() {
    let dateInputs =
        document.querySelectorAll(".date-input-container input[type='number']");
    let dates = []
    dateInputs.forEach((e) => {
        dates.push(parseInt(e.value));
    })
    let [year, month, date] = dates;
    if (! this.isValidDate(year, month, date)) {
        alert("잘못된 날짜입니다. 확인 후 다시 시도해주세요.");
        return;
    }
    if(this.isSameOrAfterToday(year, month, date)){
        alert("금일 기준 하루 이전 날짜부터 조회가 가능합니다.");
        return;
    }

    setDailyLoadingStatus(true);
    getDailyBoxOffice(year, month, date).then((boxOffice) => {
        setDailyLoadingStatus(false);
        displayDailyBoxOffice(boxOffice);
    })
}

function displayDailyBoxOffice(boxOffice){
    const container = document.querySelector(".box-office-container");
    container.innerHTML = "";
    for(let movie of boxOffice){
        let posterUrl = movie.posterUrl;
        let movieArea = document.createElement("div");
        movieArea.classList.add("movie-area");

        let poster = document.createElement("img");
        poster.classList.add("poster");
        poster.setAttribute("src", posterUrl);
        let title = document.createElement("h4");
        title.innerText = movie.movieNm + " (" + movie.rank + "위)";

        let info = document.createElement("p");
        info.innerText = "개봉일: " + movie.openDt;

        movieArea.appendChild(poster);
        movieArea.appendChild(title);
        movieArea.appendChild(info);

        container.appendChild(movieArea);
    }
}

function setDailyLoadingStatus(loading = true) {
    let spin = document.getElementById("daily-loading");
    if (loading) {
        spin.style.display = "block";
    } else {
        spin.style.display = "none";
    }
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
function isSameOrAfterToday(year, month, day){
    month = parseInt(month) - 1
    const date = year.toString() + "-" + month.toString() + "-" + day.toString();
    const nowDate = new Date();

    const dateString = nowDate.getFullYear().toString() + "-" +
        nowDate.getMonth().toString() + "-" + nowDate.getDate().toString();
    return dateString <= date;
}

function isValidDate(year, month, day) {
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day) {
        return !(month === 2 && day === 29 && !isLeapYear(year));
    } else {
        return false;
    }
}