let map;
let searchable = new kakao.maps.services.Places();
let renewBtnEnabled = false;

/**
 * Geolocation API를 이용하여, 브라우저에서 위치 정보를 불러와서 사용.
 * @returns {Promise<GeolocationPosition>}
 */
function updateLocationInfo() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position)=>{
            resolve(position);
        }, (error) =>{
            reject(error);
        });
    })
}
/**
 * OPEN API 활용 2: kakao map api
 * 화면에 지도 표시
 */
function drawMap() {
    let position;
    //dom 로드 완료됐을 시.
    updateLocationInfo().then(updatedPosition => {
        position = updatedPosition;

        let mapContainer = document.getElementById("map");// DOM API

        let centerLatlng  =
            new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let mapOption = {
            center: centerLatlng,
            level: 5
        }

        map = new kakao.maps.Map(mapContainer, mapOption);

        kakao.maps.event.addListener(map, 'bounds_changed', ()=>{
            if(! renewBtnEnabled){
                enableRenewButton(document.querySelector('.map-renew'));
            }
        })

        searchTheater()

    }).catch(_ => { // 위치 기반 서비스 요청을 거부했을 경우.
        alert("위치 기반 서비스를 제공하는 페이지입니다. 설정에서 위치정보를 허용해주세요.")
    });
}

/**
 * 지도를 옮긴 후 현재 위치에서 재검색 버튼을 눌렀을 때 호출되는 메소드.
 */
function onClickRenewButton(){
    if(renewBtnEnabled){
        enableRenewButton();
        searchTheater();
    }
}

/**
 * 재검색 버튼을 누른 후 호출 남용을 막기 위해 한 번 호출 후 재검색 비활성화.
 * 지도의 영역이 달라진 경우 다시 재검색 활성화.
 */
function enableRenewButton(){
    let element = document.getElementById("map-renew-btn");
    element.disabled = renewBtnEnabled;
    renewBtnEnabled = ! renewBtnEnabled;
}

function onChangeRadius() {
    if( ! renewBtnEnabled)
        enableRenewButton();
}

/**
 * 현재 지도 area에서 영화관 검색 후 마커 띄우기.
 */
function searchTheater(){
    let radiusElementValue = document.getElementById("search-radius").value;
    let radius = parseInt(radiusElementValue);
    if(radiusElementValue === ""){
        radius = 5000;
    }
    if(radius < 0 || radius > 20000){
        alert("반경은 0~20000m까지만 설정 가능합니다.");
        return;
    }
    let infoWindow = new kakao.maps.InfoWindow({zIndex: 1});

    searchable.setMap(map);

    searchable.keywordSearch('영화관', (data, status)=>{
        if(status === kakao.maps.services.Status.OK){
            let bounds = new kakao.maps.LatLngBounds();
            for(let i=0;i<data.length;i++){
                let theater = data[i];
                let marker = new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(theater.y, theater.x)
                })
                kakao.maps.event.addListener(marker, 'click', ()=>{
                    infoWindow.setContent('<div class="map-marker-info"><p>'
                        + theater.place_name + '</p></div>');
                    infoWindow.open(map, marker);
                });
                bounds.extend(new kakao.maps.LatLng(theater.y, theater.x));
            }
            map.setBounds(bounds);
            enableRenewButton();
        }
    }, {useMapCenter: true, radius: radius});

}