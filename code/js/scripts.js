//mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoibWFydGluZmlpdCIsImEiOiJjams3NzY4ODYwMzBuM2t0aWowN3VlYnZnIn0.i2x8S9TcS4CkqF8eQkYiOA'; // replace this with your 
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9', // replace this with your style URL
  center: [-79.055847, 35.913200],
  zoom: 13.0
});

data = JSON.parse(getGeoData(""));
dataTrafficLight = JSON.parse(getTrafficLightArea(""));
dataHospital = JSON.parse(getHospitalArea());
bikeLines = getBikeLineCrash("");
dataNeighborhood = JSON.parse(getNeighborhoodPolygon());
//console.log(JSON.parse(bikeLines));

//aktualizacia mapy
/* function updateMap(data) {
  console.log("test");
  map.on('load', function(e) {
    console.log("test");
    map.addSource("data", { type: "geojson", data: data });
    map.addLayer({
      "id": "Polygon",
      "type": "fill",
      "source": "data",
      'layout': {},
      'paint': {
        'fill-color': '#d4b508',
        'fill-opacity': 0.7
      }
  });
  });
} */
map.on('load', function(e) {
  window.setInterval(function() {
    map.getSource("data").setData(data);
    //console.log(data);
  }, 1000);

  map.addSource("data", { type: "geojson", data: data });
  map.addLayer({
    "id": "Points",
    "type": "symbol",
    "source": "data",
    "layout": {
      "visibility": "visible",
      "icon-image": "marker-15",
      /* "icon-image": [
          'step',
          ['get', 'crash_type']
            'marker-15',
            "bycicle",
            'bicycle-15',
            "pedestrain",
            'marker-15'
      ], */
      "icon-allow-overlap": true,
      "text-font": ['Open Sans Semibold", "Arial Unicode MS Bold'],
    }
  });

  map.addLayer({
    "id": "Heatmap",
    "type": "heatmap",
    "source": "data",
    "layout": {
      "visibility": "none"
    },
    "paint": {
      "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(33,102,172,0)",
            0.2, "rgb(103,169,207)",
            0.4, "rgb(209,229,240)",
            0.6, "rgb(253,219,199)",
            0.8, "rgb(239,138,98)",
            1, "rgb(178,24,43)"
        ]
    }
  });

  map.addSource("dataTrafficLight", { type: "geojson", data: dataTrafficLight });
  map.addLayer({
    "id": "Polygon1",
    "type": "fill",
    "source": "dataTrafficLight",
    "layout": {
      "visibility": "none"
    },
    "paint": {
      'fill-color': '#d4b508',
      'fill-opacity': 0.7
    }
  });

  map.addSource("dataHospital", { type: "geojson", data: dataHospital });
  map.addLayer({
    "id": "Polygon2",
    "type": "fill",
    "source": "dataHospital",
    "layout": {
      "visibility": "none"
    },
    "paint": {
      'fill-color': '#e82929',
      'fill-opacity': 0.15
    }
  });

  map.addSource("dataNeighborhood", { type: "geojson", data: dataNeighborhood });
  map.addLayer({
    "id": "Polygon3",
    "type": "fill",
    "source": "dataNeighborhood",
    "layout": {
      "visibility": "none"
    },
    "paint": {
      'fill-color': [
                      'step',
                      ['get', 'accident_number'],
                      '#ffffff',
                      0,
                      '#ccc',
                      1,
                      '#ffe6e6',
                      2,
                      '#ffcccc',
                      3,
                      '#ffb3b3',
                      4,
                      '#ff9999',
                      5,
                      '#ff8080',
                      7,
                      '#ff6666',
                      8,
                      '#ff4d4d',
                      13,
                      '#ff3333',
                      30,
                      '#ff1a1a',
                      31,
                      '#ff0000'
                  ],
      'fill-opacity': 0.95
    }
  });


   /*map.addSource("bikeLines", { type: "geojson", data: bikeLines });
   map.addLayer({
    "id": "BikeLines",
    "type": "line",
    "source": "bikeLines",
    "layout": {
      "visibility": "visible",
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
        "line-color": "#3386c0",
        "line-opacity": 0.6,
        "line-width": 2
    }
  }); 
});*/

/* map.addControl(new MapboxDirections({
  accessToken: mapboxgl.accessToken
}), 'top-right'); */

function changeLayerViewType(type) {
  toggleableLayerIds = [ 'Points', 'Heatmap', 'Polygon1' ];
  if (type === "Polygon1") {
      map.setLayoutProperty('Polygon1', 'visibility', 'visible');
      map.setLayoutProperty('Polygon2', 'visibility', 'none');
      map.setLayoutProperty('Polygon3', 'visibility', 'none');
      map.setLayoutProperty('BikeLines', 'visibility', 'none');
  }
  if (type === "Polygon2") {
    map.setLayoutProperty('Polygon2', 'visibility', 'visible');
    map.setLayoutProperty('Polygon1', 'visibility', 'none');
    map.setLayoutProperty('Polygon3', 'visibility', 'none');
    map.setLayoutProperty('BikeLines', 'visibility', 'none');
  }
  if (type === "Polygon3") {
    map.setLayoutProperty('Polygon3', 'visibility', 'visible');
    map.setLayoutProperty('Polygon1', 'visibility', 'none');
    map.setLayoutProperty('Polygon2', 'visibility', 'none');
    map.setLayoutProperty('BikeLines', 'visibility', 'none');
  }
  if (type === "BikeLines") {
    map.setLayoutProperty('BikeLines', 'visibility', 'visible');
    map.setLayoutProperty('Polygon3', 'visibility', 'none');
    map.setLayoutProperty('Polygon1', 'visibility', 'none');
    map.setLayoutProperty('Polygon2', 'visibility', 'none');
  }
}
var toggleableLayerIds = [ 'Points', 'Heatmap' ];
//'Bicyclist', 'Pedestrian'

  for (var i = 0; i < toggleableLayerIds.length; i++) {
      var id = toggleableLayerIds[i];

      var link = document.createElement('a');
      link.href = '#';
      link.className = 'active';
      link.textContent = id;

      link.onclick = function (e) {
          var clickedLayer = this.textContent;
          e.preventDefault();
          e.stopPropagation();

          var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

          if (visibility === 'visible') {
              map.setLayoutProperty(clickedLayer, 'visibility', 'none');
              this.className = '';
          } else {
              this.className = 'active';
              map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
          }
      };

      var layers = document.getElementById('menu');
      layers.appendChild(link);
  }

  var filterGroup = document.getElementById('filter-group');

function getGeoData(filter) {
  var tmp = null;
  $.ajax({
    async: false,
    type: 'GET',
    url: 'function1.php',
    contentType: "application/json; charset=utf-8",
    dataType: 'json',
    data: {
      //table: myTable,
      where: filter
    },
    success: function(response) {
      tmp = response;
    }
  });
  return tmp;
}

function getTrafficLightArea(filter) {
  var tmp = null;
  $.ajax({
    async: false,
    type: 'GET',
    url: 'function3.php',
    contentType: "application/json; charset=utf-8",
    dataType: 'json',
    /* data: {
      //table: myTable,
      where: filter
    }, */
    success: function(response) {
      tmp = response;
    }
  });
  //updateMap(JSON.parse(tmp));
  return tmp;
}

function getHospitalArea() {
  var tmp = null;
  $.ajax({
    async: false,
    type: 'GET',
    url: 'function6.php',
    contentType: "application/json; charset=utf-8",
    dataType: 'json',
    success: function(response) {
      tmp = response;
    }
  });
  return tmp;
}

function showHopitalPolygon() {
  changeLayerViewType("Polygon2");
}

function getTrafficLightCrashs(filter) {
  var tmp = null;
  $.ajax({
    async: false,
    type: 'GET',
    url: 'function4.php',
    contentType: "application/json; charset=utf-8",
    dataType: 'json',
    /* data: {
      //table: myTable,
      where: filter
    }, */
    success: function(response) {
      tmp = response;
    }
  });
  //getTrafficLightArea("");
  changeLayerViewType("Polygon1");
  data = JSON.parse(tmp);
}

function getBikeLineCrash() {
  var tmp = null;
  $.ajax({
    async: false,
    type: 'GET',
    url: 'function7.php',
    contentType: "application/json; charset=utf-8",
    dataType: 'json',
    success: function(response) {
      tmp = response;
    }
  });
  return tmp;
}

function getNeighborhoodPolygon() {
  var tmp = null;
  $.ajax({
    async: false,
    type: 'GET',
    url: 'function8.php',
    contentType: "application/json; charset=utf-8",
    dataType: 'json',
    success: function(response) {
      tmp = response;
    }
  });
  return tmp;
}

function showNeighborhoodPolygon() {
  map.setLayoutProperty('Points', 'visibility', 'none');
  changeLayerViewType("Polygon3");
}

function showBikeLines() {
  map.setLayoutProperty('Points', 'visibility', 'none');
  changeLayerViewType("BikeLines");
}

function setDefaultView() {
  map.setLayoutProperty('Points', 'visibility', 'visible');
  map.setLayoutProperty('Polygon1', 'visibility', 'none');
  map.setLayoutProperty('Polygon2', 'visibility', 'none');
  map.setLayoutProperty('Polygon3', 'visibility', 'none');
}

//burger menu open/close
function openSM(){
  var burgerMenu = document.getElementById("mySidemenu");
  burgerMenu.style.width ="30%";
  var burgerIcon = document.getElementById('burger');
  burgerIcon.style.display = 'none';
  document.getElementById("map").setAttribute("style", "left: 30%; width: 70%");
}
function closeSM(){
  var burgerMenu = document.getElementById("mySidemenu");
  burgerMenu.style.width = "0";
  var burgerIcon = document.getElementById('burger');
  burgerIcon.style.display = 'block';
  document.getElementById("map").setAttribute("style", "left: 0%; width: 100%");
}

function getUniqueColumnValues(myColumn, myTable) {
  var tmp = null;
    $.ajax({
      async: false,
      type: 'GET',
      url: 'function2.php',
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: {
        column: myColumn,
        table: myTable
      },
      success: function(response) {
          tmp = response;

      }
    });
    return tmp;
}

//multiple select for filter data
function fillAllSelectOption() {
  var selectOptionInjur = getUniqueColumnValues("injur", "crash_data_chapel_hill_region");
  console.log(selectOptionInjur);
  var selectOptionWeather = getUniqueColumnValues("weather", "crash_data_chapel_hill_region");
  console.log(selectOptionWeather);
  //var selectOptionMonth = getUniqueColumnValues("crash_mont", "bicycle_crash_data_chapel_hill_region");
  /* function () {
    var tmp = null;
    $.ajax({
      async: false,
      type: 'GET',
      url: 'function2.php',
      data: {
        column: "bike_injur",
        table: "bicycle_crash_data_chapel_hill_region"},
      success: function(response) {
          tmp = response;

      }
    });
    return tmp;
  }(); */

    var selectBoxs = ["injury-filter", "weather-filter"];
    var tmpBox;
    selectBoxs.forEach(element => {
      switch (element) {
        case "injury-filter":
          var tmpBox = document.getElementById("injury-filter");
          selectOptionInjur.forEach(elementO => {
            var option = document.createElement("option");
            option.value = elementO["injur"];
            option.text = elementO["injur"];
            tmpBox.add(option);
          });
        break;
        case "weather-filter":
        var tmpBox = document.getElementById("weather-filter");
        selectOptionWeather.forEach(elementO => {
            var option = document.createElement("option");
            option.value = elementO["weather"];
            option.text = elementO["weather"];
            tmpBox.add(option);
          });
        break;
      }
    });
   
}
  
fillAllSelectOption();


function updateFilter(selectBox) {
  var list= document.getElementsByTagName("select");
  var result = [];
  var obj = {};
  var filter = "";
  var k = 0;
  var l = -1;
  for (var i = 0; i < list.length; i++) {
    var options = list[i] && list[i].options;
    var opt;
    k = 0;

    for (var j=0, iLen=options.length; j<iLen; j++) {
      opt = options[j];

      if (opt.selected) {
        if (l == -1) {
          filter += "WHERE ";
          l = i;
        } else if (i > l) {
          filter += " AND ";
          l = i;
        }
        if (k == 0) {
          filter += list[i].getAttribute("name");
          filter += " = ";
          filter += "'";
          filter += opt.value;
          filter += "'";
          k++;
        } else {
          filter += " OR "
          filter += list[i].getAttribute("name");
          filter += " = ";
          filter += "'";
          filter += opt.value;
          filter += "'";
        }
      }

    }
  }
  console.log(filter);

  data = JSON.parse(getGeoData(filter));

}

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
});


