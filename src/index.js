
class TamboraMarkerLayer extends ol.layer.Vector {
   constructor(options) {
     options.name = "tambora.org";
     options.renderOrder = ol.ordering.yOrdering();
     options.style = getStyle;
       // this.year = options.year;
     var jsonBaseUrl =  "https://www.tambora.org/index.php/grouping/event/geojson?"; 
     var tmbBaseUrl = "https://www.tambora.org/index.php/grouping/event/list?mode=search&";
     var jsonUrl = null; 
     var tmbUrl = "https://www.tambora.org";
     if (options.url) {
      jsonUrl = options.url;
     }  
     if (options.parameter) {
      jsonUrl = jsonBaseUrl + options.parameter;
      tmbUrl = tmbBaseUrl + options.parameter;
    }  
     // "limit=5000"
     // "&t[yb]=1540&t[ye]=1540"
     // "&g[nd]=90,590,591,87,819,571"
     // "&g[va]=86,82,6,104,101,41,48,142,57,134,124,125,123"
     var source = new ol.source.Vector({
      url: jsonUrl,
      //projection: 'EPSG:3857',
      format: new ol.format.GeoJSON(),
      //attributions: [ "&copy; <a href='https://www.tambora.org'>tambora.org</a>" ],
      attributions: "<a href='"+tmbUrl+"'>tambora.org</a>", 
      logo:"https://www.tambora.org/images/logos/tambora-logo-red.png" 
    });
    
    var clusterSource = new ol.source.Cluster({
      distance: 75,
      source: source,
      attributions: "<a href='"+tmbUrl+"'>tambora.org</a>", 
      logo:"https://www.tambora.org/images/logos/tambora-logo-red.png" 
    });
 
/*
   // https://viglino.github.io/ol-ext/examples/animation/map.animatedcluster.html
    var animatedCluster = new ol.layer.AnimatedCluster({
      name: 'Cluster',
      source: clusterSource,
      animationDuration: 700,
      // Cluster style
      //style: getStyle
    }); 
*/

    options.source = clusterSource;
    //options.source = animatedCluster;
    super(options);

     this.clusterZoomLimit = 0;
     if (Number.isInteger(options.clusterZoomLimit)) {
        this.clusterZoomLimit = options.clusterZoomLimit;
     }
      
    this.srcClustered = clusterSource; // animatedCluster; //
    this.srcUnclustered = source;
   }
   addTo(map) {
    map.addLayer(this);
    this.changed();

    map.getView().on('change:resolution', function(evt){
      var view = evt.target;
      this.getLayers().getArray().map(function(layer) {
        if(layer.srcClustered && layer.srcUnclustered) {
          var oldSource = layer.getSource();
          if (view.getZoom() >= layer.clusterZoomLimit && oldSource instanceof ol.source.Cluster) {
            layer.setSource(layer.srcUnclustered);
          }
          else if (view.getZoom() < layer.clusterZoomLimit && oldSource instanceof ol.source.Vector) {
            layer.setSource(layer.srcClustered);
          }          
        }
      });
    }, map);

   }
  

}   




  // Style function
  function getFeatureStyle (feature) {
    var st= [];
    
    //var glyph = ol.style.FontSymbol.prototype.defs.glyphs;

    var glyphIcon = "fa-glass";
    var markerColor = "white";
    if(feature.N && feature.N.features) {
      glyphIcon = "fa-music";
      markerColor = "green";
      if(feature.N.features.length > 1) {
        glyphIcon = "fa-circle";
      }
    }

      // Font style
    var markerStyle = getMarker(feature);
    if(markerStyle) {
      st.push ( markerStyle );
    }
    return st;
  }

  function getStyle(feature, resolution) {
    var s = getFeatureStyle(feature);
    // Ne pas recalculer
    //feature.setStyle(s);
    return s;
    
  };


var iconCodes = {
"longterm precipitation:extremely dry": {icon: 'fa-tint', markerColor: 'red', iconColor: '#FFFFFF', shape: 'marker', prefix: 'icon'},
"longterm precipitation:very dry": {icon: 'fa-tint', markerColor: 'orange', iconColor: '#FFFFFF', shape: 'marker', prefix: 'icon'},	
"wildfire:null": {icon: 'fa-fire', markerColor: 'yellow', iconColor: '#FF0000', shape: 'marker', prefix: 'icon'},
"damaged by fire:null": {icon: 'fa-fire', markerColor: 'yellow', iconColor: '#AA0000', shape: 'marker', prefix: 'icon'},
"temperature level:very hot": {icon: 'fa-sun', markerColor: 'yellow', iconColor: '#AA0000', shape: 'marker', prefix: 'icon'},
"water temperature level:very hot": {icon: 'fa-sun', markerColor: 'yellow', iconColor: '#CC0000', shape: 'marker', prefix: 'icon'},
"price trend:increasing price": {icon: 'euro sign', markerColor: 'violet', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"price level:high price": {icon: 'euro sign', markerColor: 'violet', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"water level trend:falling water level": {icon: 'fa-ship', markerColor: 'white', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"low water level:low water level (no water)": {icon: 'fa-ship', markerColor: 'blue', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"hunger (humans):null": {icon: 'fa-coffee', markerColor: 'purple', iconColor: '#FFFFFF', shape: 'marker', prefix: 'icon'},
"harvest quality:very good crop quality": {icon: 'fa-leaf', markerColor: 'green-light', iconColor: '#BBFFBB', shape: 'marker', prefix: 'icon'},
"harvest quantity:very low harvest volume": {icon: 'fa-leaf', markerColor: 'green-light', iconColor: '#BBFFBB', shape: 'marker', prefix: 'icon'},
"shortterm precipitation:no precipitation": {icon: 'fa-tint', markerColor: 'cyan', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"low water level:low water level (severly limited use)": {icon: 'fa-ship', markerColor: 'blue', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"thirst (animals):null": {icon: 'fa-beer', markerColor: 'cyan', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"hunger (animals):null": {icon: 'fa-star', markerColor: 'purple', iconColor: '#FFFFFF', shape: 'marker', prefix: 'icon'},
"low water level:low water level (limited use)": {icon: 'ship', markerColor: 'blue', iconColor: '#000000', shape: 'circle', prefix: 'icon'},
"thirst (humans):null": {icon: 'fa-beer', markerColor: 'cyan', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"precipitation frequency:never precipitation": {icon: 'umbrella', markerColor: 'cyan', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"other:other": {icon: 'fa-question', markerColor: 'white', iconColor: '#000000', shape: 'circle', prefix: 'icon'},
"cluster:small": {icon: 'fa-circle', markerColor: 'white', iconColor: '#008800', shape: 'circle', prefix: 'icon'},
"cluster:medium": {icon: 'fa-circle', markerColor: 'white', iconColor: '#FF8800', shape: 'circle', prefix: 'icon'},
"cluster:large": {icon: 'fa-circle', markerColor: 'white', iconColor: '#AA0000', shape: 'circle', prefix: 'icon'},
}

function getMarker(feature) {
  var event = feature.getProperties();
  // add special key for clusters
  var text = null;
  var key = "other:other";
  if (event.features && event.features.length == 1) {
    feature = event.features[0];
    event = feature.getProperties();
  }  
  if (event.features) {
    key = "cluster:medium";
    if (event.features.length < 8) {
      key = "cluster:small";
    }
    if (event.features.length > 25) {
      key = "cluster:large";
    }
    text = new ol.style.Text({
            text: event.features.length.toString(),
            //font: 'bold 12px comic sans ms',
            //textBaseline: 'top',
            fill: new ol.style.Fill({
              color: '#000'
            })
       });
  } else {
    key = event.node_label + ':' + event.value_label;
    if(!event.scattered) {
      var geo = feature.getGeometry();
      geo.translate(1000*(Math.random()-0.5),1000*(Math.random()-0.5));
      feature.setGeometry(geo);
      event.scattered = true;
      feature.setProperties(event);
    }
  }
  var data = iconCodes[key];
  if(!data) {
    data = {icon: 'fa-question', markerColor: 'white', iconColor: '#000000', shape: 'circle', prefix: 'icon'}
    key = "other:other"
    // return null; // return: prefer to not show unknown icons...
    // event may contain coding not in select... better filter...
  }
  if (!data.marker) {
    iconCodes[key].marker = new ol.style.Style({
      text: text,
      image: new ol.style.FontSymbol({
          form: data.shape,
          gradient: true,
          glyph: data.icon,
          fontSize: 1,
          fontStyle: '',
          radius: 20, 
          //offsetX: -15,
          rotation: 0,
          rotateWithView: false,
          offsetY: 0,
          color: data.iconColor,
          fill: new ol.style.Fill({
            color: 'navy' //markerColor
          }),
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 2
          })
        }),
        stroke: new ol.style.Stroke({
          width: 2,
          color: '#f80'
        }),
        fill: new ol.style.Fill({
          color: data.markerColor // [255, 136, 0, 0.6]
        })
      });
  }
  if(text) {
    iconCodes[key].marker.setText(text);
  }
  return iconCodes[key].marker;
}
