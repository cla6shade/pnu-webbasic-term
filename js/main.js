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
        $.ajax(url + "?key=" + key + "&targetDt=" + targetDt).done(async data => {
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
    dateInputs.forEach((e) =>{
        dates.push(parseInt(e.value));
    })
    let [year, month, date] = dates;
    if(year < 2000 || month < 1 || month > 12 || date < 1 || date > 31){
        alert("잘못된 날짜입니다. 확인 후 다시 시도해주세요.");
        return;
    }
    getDailyBoxOffice(year, month, date).then((boxOffice) =>{

    })
}