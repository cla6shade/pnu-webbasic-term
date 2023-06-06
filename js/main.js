const key = "12bc474714005e3fb5259fa5f0cfc9be"

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

/**
 * movieCd를 기반으로 포스터를 받아오는 기능.
 * openAPI에서 제공하지 않는 기능을 만들기 위해 웹 서버를 직접 만들었음.
 * @param movieCd
 * @returns {Promise<unknown>}
 */
function getPosterUrl(movieCd) {
    //Promise로 wrap. 올바른 데이터를 받은 경우 resolve하도록. 아닌 경우 reject.
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
 * kobis OPEN API 활용 1, 일별 박스오피스 순위를 받아옴. 리턴값에 포스터 url주소도 포함하여 리턴.
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

/**
 * 연, 월, 일을 받아서 일별 박스오피스 조회.
 * @param y
 * @param m
 * @param d
 * @returns {Promise<Object[]>}
 */
async function getDailyBoxOffice(y, m, d) {
    m = m < 10 ? "0" + m.toString() : m.toString();
    d = d < 10 ? "0" + d.toString() : d.toString();
    let targetDt = y + m + d;
    return await requestDailyBoxOffice(targetDt);
}

/**
 * daily 탭에 날짜를 입력하고 확인을 눌렀을 때 실행되는 메소드
 */
function onClickDaily() {
    let dateInputs =
        document.querySelectorAll(".date-input-container input[type='number']");// DOM API
    let dates = []

    let container = document.querySelector(".box-office-container");
    container.innerHTML = '<div class="loading" id="daily-loading"></div>';

    dateInputs.forEach((e) => {
        dates.push(parseInt(e.value));
    })
    let [year, month, date] = dates;
    // 입력 오류 핸들링
    if (!this.isValidDate(year, month, date)) {
        alert("잘못된 날짜입니다. 확인 후 다시 시도해주세요.");
        return;
    }
    // openAPI 특성상 하루 전 날의 데이터부터 조회 가능.
    if (this.isSameOrAfterToday(year, month, date)) {
        alert("금일 기준 하루 이전 날짜부터 조회가 가능합니다.");
        return;
    }

    setDailyLoadingStatus(true);
    getDailyBoxOffice(year, month, date).then((boxOffice) => {
        setDailyLoadingStatus(false);
        displayDailyBoxOffice(boxOffice);
    }).catch(error => { // 네트워크 등 ajax 오류 시 reject 콜백
        alert(error);
    })
}

/**
 * 일별 박스오피스 순위를 받아서 daily 탭의 flexbox에 표시.
 * @param boxOffice
 */
function displayDailyBoxOffice(boxOffice) {// DOM API
    const container = document.querySelector(".box-office-container");
    for (let movie of boxOffice) {
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

/**
 * 해당 연도에 개봉/개봉예정인 영화를 받아옴. kobis Open API
 * @param year
 * @param page
 * @returns {Promise<unknown>}
 */
function requestYearlyReleased(year, page) {
    return new Promise((resolve, reject) => {
        $.ajax('http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=' +
            key + '&openStartDt=' + year.toString() + '&openEndDt=' + year.toString() + '&itemPerPage=20&curPage=' + page
        ).done(async data => {
            resolve(data);
        }).fail((xhr, textStatus, error) => {
            reject(error);
        });
    })
}

/**
 * Yearly 탭의 연도 입력 후 확인 버튼을 눌렀을 때 동작.
 */
function onClickYearly() {
    let year = document.getElementById("released-year").value;
    year = parseInt(year);
    let nowYear = new Date().getFullYear();
    // 잘못된 연도인 경우
    if (year < 1940 || year > nowYear) {
        alert("1939년도 이전이나 " + nowYear.toString() + "년도 이후의 영화는 조회할 수 없습니다.");
        return;
    }


    let container = document.querySelector('.yearly-released-container');
    container.innerHTML = '<div class="loading" id="daily-loading"></div>';

    setDailyLoadingStatus(true);
    requestYearlyReleased(year, 1).then(data => {
        setDailyLoadingStatus(false);
        let res = data.movieListResult;
        let movieList = res.movieList;

        let table = document.createElement('table');
        let headerRow = document.createElement('tr');
        let thData = ['번호', '영화명', '개봉일', '개봉여부', '장르', '제작국가'];

        for(let thDatum of thData){
            let th = document.createElement('th');
            th.innerText = thDatum;
            headerRow.appendChild(th);
        }

        table.appendChild(headerRow);

        for (let i = 0; i < 20; i++) {
            let singleRow = document.createElement('tr');
            let movie = movieList[i];

            let openDate = movie.openDt;
            let dateString = openDate.slice(0, 4) + "-" +
                openDate.slice(4, 6) + "-" + openDate.slice(6, 8);

            if(typeof movie.genreAlt.split('성인물')[1] !== 'undefined'){
                movie.movieNm = "(성인물 필터)";
            }
            let movieData = [
                (i+1).toString(), movie.movieNm, dateString,
                movie.prdtStatNm, movie.genreAlt, movie.nationAlt
            ];
            for(let movieDatum of movieData) {
                let td = document.createElement('td');
                td.innerText = movieDatum;
                singleRow.appendChild(td);
            }

            table.appendChild(singleRow);
            setDailyLoadingStatus(false);
            container.appendChild(table);
        }
    }).catch(error =>{ // 네트워크 등 ajax 오류 시 reject 콜백
        alert(error);
    })
}

/**
 * 데이터 로딩할 때 회전하는 아이콘을 화면에 표시.
 * 로딩이 끝날 경우 display를 none으로 설정해서 화면상에서 사라지도록.
 * @param loading
 */
function setDailyLoadingStatus(loading = true) {
    let spin = document.querySelector(".loading"); // DOM API
    if (loading) {
        spin.style.display = "block";
    } else {
        spin.style.display = "none";
    }
}

/**
 * 윤년 체크 메소드. 잘못된 날짜 판별용
 * @param year
 * @returns {boolean}
 */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * daily box office 조회 탭에서, 날짜가 오늘 날짜보다 이후인 경우를 판별하는 메소드.
 * @param year
 * @param month
 * @param day
 * @returns {boolean}
 */
function isSameOrAfterToday(year, month, day) {
    month = parseInt(month) - 1
    const date = year.toString() + "-" + month.toString() + "-" + day.toString();
    const nowDate = new Date();

    const dateString = nowDate.getFullYear().toString() + "-" +
        nowDate.getMonth().toString() + "-" + nowDate.getDate().toString();
    return dateString <= date;
}

/**
 * 윤년 여부를 포함하여 올바른 날짜인지 체크하는 메소드
 * @param year
 * @param month
 * @param day
 * @returns {boolean}
 */
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