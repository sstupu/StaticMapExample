
$(document).ready(function(){
    var imgDivWidth = 450;
    var imgDivHeight = 340;

    var latInput   = $("#latInput");
    var lonInput   = $("#lonInput");
    var zomInput  = $("#zoomInput");
    var widthInput = $("#widthInput");
    var heightInput = $("#heightInput");
    var tilesInput = $("#tilesInput");

    latInput.val('45.18');
    lonInput.val('7.70');
    zomInput.val('13');

    widthInput.val('450px');
    heightInput.val('340px');
    tilesInput.val('3');
    
    mapList = [];
    var lat = latInput.val();
    var lon = lonInput.val();
    var zoom = zomInput.val();
    loadMap(zoom, lat, lon);
    $("#resizeDiv").show();
    $("#imgDiv").resizable();
    $("#imgDiv").resize(()=>{
        widthInput.val($("#imgDiv").width() + 'px');
        heightInput.val($("#imgDiv").height() + 'px');
    });
    $("#imgDiv").css('width', imgDivWidth+'px');
    $("#imgDiv").css('height', imgDivHeight+'px');
    $('#full').click(()=>{
        console.log("ciao");
        $("#imgDiv").width('100vw'); 
        $("#imgDiv").height('100vh'); 
        $("#imgDiv").addClass('fullscreen');
    });
    $("#calcBtnGoogle").click(() => {
        var lat = latInput.val();
        var lon = lonInput.val();
        var zoom = zomInput.val();
        loadMap(zoom, lat, lon);
        $("#resizeDiv").show();
    });

    $("#zoomMinus").click(()=>{
        var lat = latInput.val();
        var lon = lonInput.val();
        var zoom = zomInput.val();
        var tiles = Number(tilesInput.val());
        zoom--;
        zoom = zoom < 0 ? 0 : zoom;
        zomInput.val(zoom);
        loadMap(zoom, lat, lon,tiles);
    });
    $("#zoomPlus").click(()=>{
        var lat = latInput.val();
        var lon = lonInput.val();
        var zoom = zomInput.val();
        var tiles = Number(tilesInput.val());
        zoom++;
        zoom = zoom > 20 ? 20 : zoom;
        zomInput.val(zoom);
        loadMap(zoom, lat, lon, tiles);
    });
    $("#widthMinus").click(()=>{
        var width = Number(widthInput.val().replace('px',''));
        width -= 10;
        widthInput.val(width+'px');
        width = width < 5 ? 10 : width;
        $("#imgDiv").width(width+'px'); 
    });
    $("#widthPlus").click(()=>{
        var width = Number(widthInput.val().replace('px',''));
        width += 10;
        widthInput.val(width+'px');
        $("#imgDiv").width(width+'px'); 
    });

    $("#heightMinus").click(()=>{
        var height = Number(heightInput.val().replace('px',''));
        height -= 10;
        heightInput.val(height+'px');
        height = height < 5 ? 10 : height;
        $("#imgDiv").height(height+'px'); 
    });

    $("#heightPlus").click(()=>{
        var height = Number(heightInput.val().replace('px',''));
        height += 10;
        heightInput.val(height+'px');
        $("#imgDiv").height(height+'px'); 
    });
    

    $("#calcBtnOpenStreet").click(function(){

        var lat = latInput.val();
        var lon = lonInput.val();
        var zoom = zomInput.val();
        var urlMap = getUrl(zoom,lat*1.0,lon*1.0, 'o');
        
        $("#tileUrlOpen").attr('href',urlMap);
        $("#tileUrlOpen").text(urlMap);
        
        $("#tileImgOpen").attr("src", urlMap);
        $("#tileImgOpen").show();

    });
    function loadMap(zoom, lat, lon, squareLength = 3){

        var urlMap = getUrl(zoom,lat*1.0,lon*1.0);

        var x = lon2tile(lon*1.0,zoom);
        var y = lat2tile(lat*1.0,zoom);
        var z = zoom;

        var center = Math.ceil(squareLength/2);
        var imgLength = Math.round(1000/squareLength)/10;

        $("#imgDiv").empty();
        for (let i = squareLength; i > 0; i--) {
            for (let j = squareLength; j > 0; j--) {
                var imgId = 'tileImg' + String(i) + String(j);
                var imgName = '#' + imgId;
                var img = '<img src="" id="' + imgId + '"/>';
                var imgX = x + j - center;
                var imgY = y + i - center;
                $("#imgDiv").prepend(img);
                $(imgName).attr("src", getGoogleUrl(z,imgX,imgY));
                $(imgName).width(imgLength+'%');
                $(imgName).height(imgLength+'%');
            }
        }
        $("#tileUrl").attr('href',getGoogleUrl(z,x,y));
        $("#tileUrl").text(getGoogleUrl(z,x,y));

        $("#imgDiv").show();

    }
    function getGoogleUrl(z, x, y) {
        var googleMapUrl = 'https://mts1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
        var urlMap = googleMapUrl.replace('{z}',z)
                            .replace('{x}',x)
                            .replace('{y}',y);
        return urlMap;
    }
    function getUrl(zoom, lat, lon, v = 'g') 
    {
        var openMapUrl = 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var googleMapUrl = 'https://mts1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
        var x = lon2tile(lon,zoom);
        var y = lat2tile(lat,zoom);

        if (v == 'g'){
            var urlMap = googleMapUrl.replace('{s}', 'a')
                            .replace('{z}',zoom)
                            .replace('{x}',x)
                            .replace('{y}',y);
        }else{
            var urlMap = openMapUrl.replace('{s}', 'a')
            .replace('{z}',zoom)
            .replace('{x}',x)
            .replace('{y}',y);

        }
        
        
        console.log(urlMap);
        return (urlMap);
    }
    function lon2tile(lon,zoom) 
    {   
        var x = Math.floor((lon+180)/360*Math.pow(2,zoom));
        console.log(x);
        return (x); 
    }

    function lat2tile(lat,zoom)  
    { 
        var x = Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom));
        console.log(x);
        return (x); 
    }

  
});

