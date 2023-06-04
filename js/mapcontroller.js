let map;
let searchable = new kakao.maps.services.Places();
let renewBtnEnabled = false;
function updateLocationInfo() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position)=>{
            resolve(position);
        }, (error) =>{
            reject(error);
        });
    })
}
function drawMap() {
    let position;
    //dom 로드 완료됐을 시.
    updateLocationInfo().then(updatedPosition => {
        position = updatedPosition;

        let mapContainer = document.getElementById("map");

        let centerLatlng  =
            new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let mapOption = {
            center: centerLatlng,
            level: 3
        }

        map = new kakao.maps.Map(mapContainer, mapOption);

        kakao.maps.event.addListener(map, 'bounds_changed', ()=>{
            if(! renewBtnEnabled){
                enableRenewButton(document.querySelector('.map-renew'));
            }
        })

        searchTheater()

    }).catch(_ => {
        console.log(_);
        alert("위치 기반 서비스를 제공하는 페이지입니다. 설정에서 위치정보를 허용해주세요.")
    });
}
function onClickRenewButton(e){
    if(renewBtnEnabled){
        enableRenewButton(e, false);
        searchTheater();
    }
}
function enableRenewButton(element, enabled = true){
    if(renewBtnEnabled){
        element.disabled = true;
    } else {
        element.disabled = false;
    }
    renewBtnEnabled = ! renewBtnEnabled;
}
function searchTheater(){
    let infoWindow = new kakao.maps.InfoWindow({zIndex: 1});

    searchable.setMap(map);

    searchable.keywordSearch('영화관', (data, status)=>{
        if(status === kakao.maps.services.Status.OK){
            //let bounds = new kakao.maps.LatLngBounds();

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
                //bounds.extend(new kakao.maps.LatLng(theater.y, theater.x));
            }
           // map.setBounds(bounds);
        }
    }, {useMapBounds: true});

}