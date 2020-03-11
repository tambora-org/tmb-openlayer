
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

    // uncluster on zoom
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

    // popup
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');
   
    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });
    map.addOverlay(overlay);
   
    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    map.on('singleclick', function (event) {
      if (map.hasFeatureAtPixel(event.pixel) === true) {
        var features = map.getFeaturesAtPixel(event.pixel, 
            {layerFilter: function(layer) { return (layer instanceof TamboraMarkerLayer); } })
          var coordinate = event.coordinate;
          
          for(var i=0;i<features.length;i++) {
            // maybe first collect real markers...
            var feature = features[i];
            var event = feature.getProperties();
            //only one marker in cluster?
            if (event.features && event.features.length == 1) {
              feature = event.features[0];
              event = feature.getProperties();
            }  
            if (event.features) {
              // cluster
              overlay.setPosition(undefined);
              closer.blur();  
              // then zoom in
              var view = map.getView();
              var zoom = view.getZoom();
              if(zoom < 12) {
                view.setCenter(coordinate);
                view.setZoom(zoom + 2);
              }           
            } else {
              // marker
              var popup = getPopup(feature);
              content.innerHTML = popup;
              overlay.setPosition(coordinate);
            }
          }  
      } else {
          overlay.setPosition(undefined);
          closer.blur();
      }
  });


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

  "flood intensity:flood above average": {icon: 'fa-ship', markerColor: 'blue', iconColor: '#FFFFFF', shape: 'circle', prefix: 'icon'},
  "flood extent:regional": {icon: 'fa-ship', markerColor: 'blue', iconColor: '#FFFFFF', shape: 'shield', prefix: 'icon'},
  "freezing temperatures:null": {icon: 'fa-linux', markerColor: 'white', iconColor: '#0000FF', shape: 'circle', prefix: 'fa'},
  "shortterm precipitation:very much precipitation": {icon: 'fa-tint', markerColor: 'blue', iconColor: '#FFFFFF', shape: 'circle', prefix: 'icon'},
  "shortterm precipitation:much precipitation": {icon: 'fa-tint', markerColor: 'blue', iconColor: '#AAAAAA', shape: 'circle', prefix: 'icon'},
  "rain:null": {icon: 'tint', markerColor: 'cyan', iconColor: '#0000AA', shape: 'shield', prefix: 'icon'},
  "temperature level:cold": {icon: 'fa-sun-o', markerColor: 'cyan', iconColor: '#0000CC', shape: 'circle', prefix: 'icon'},
  "temperature level:cool": {icon: 'fa-sun-o', markerColor: 'cyan', iconColor: '#0000AA', shape: 'circle', prefix: 'icon'},
  "temperature level:warm": {icon: 'fa-sun-o', markerColor: 'yellow', iconColor: '#880000', shape: 'circle', prefix: 'icon'},
  "temperature level:hot": {icon: 'fa-sun-o', markerColor: 'yellow', iconColor: '#990000', shape: 'circle', prefix: 'icon'},
  "price:null": {icon: 'fa-euro', markerColor: 'violet', iconColor: '#000000', shape: 'shield', prefix: 'icon'}, //x
  "begin:null": {icon: 'fa-arrow-circle-o-left', markerColor: 'white', iconColor: '#00AA00', shape: 'square', prefix: 'fa'}, //x
  "end:null": {icon: 'fa-arrow-circle-o-right', markerColor: 'white', iconColor: '#00AA00', shape: 'square', prefix: 'icon'}, //x
  "wind force:10 bft: storm": {icon: 'fa-skyatlas', markerColor: 'pink', iconColor: '#000000', shape: 'coma', prefix: 'fa'}, //x
  "wind force:9 bft: strong gale": {icon: 'fa-skyatlas', markerColor: 'pink', iconColor: '#111111', shape: 'coma', prefix: 'fa'}, //x
  "wind force:7 bft: high wind": {icon: 'fa-skyatlas', markerColor: 'pink', iconColor: '#333333', shape: 'coma', prefix: 'fa'}, //x
  "longterm precipitation:very wet": {icon: 'fa-tint', markerColor: 'cyan', iconColor: '#FFFFFF', shape: 'circle', prefix: 'icon'},	
  "kind of goods:null": {icon: 'fa-shopping-cart', markerColor: 'violet', iconColor: '#000000', shape: 'shield', prefix: 'icon'}, //-
  "harvest quality:poor crop quality": {icon: 'fa-leaf', markerColor: 'green', iconColor: '#DDAAAA', shape: 'shield', prefix: 'icon'}, //-
  "harvest quality:good crop quality": {icon: 'fa-leaf', markerColor: 'green', iconColor: '#AADDAA', shape: 'shield', prefix: 'icon'}, //-
  "harvest quantity:high harvest volume": {icon: 'fa-leaf', markerColor: 'green', iconColor: '#669966', shape: 'shield', prefix: 'icon'}, //!--
  "harvest quantity:low harvest volume": {icon: 'fa-leaf', markerColor: 'green', iconColor: '#AADDAA', shape: 'shield', prefix: 'icon'}, //-
  "oat:null": {icon: 'fa-pagelines', markerColor: 'violet', iconColor: '#000000', shape: 'shield', prefix: 'fa'}, 
  "rye:null": {icon: 'fa-pagelines', markerColor: 'violet', iconColor: '#000000', shape: 'shield', prefix: 'fa'}, 
  "grain:null": {icon: 'fa-pagelines', markerColor: 'violet', iconColor: '#000000', shape: 'shield', prefix: 'fa'}, 
  "fruits:null": {icon: 'fa-lemon-o', markerColor: 'violet', iconColor: '#000000', shape: 'shield', prefix: 'icon'}, 
  "plants:null": {icon: 'fa-leaf', markerColor: 'violet', iconColor: '#000000', shape: 'shield', prefix: 'icon'}, 
  "snow:null": {icon: 'fa-empire', markerColor: 'white', iconColor: '#0000AA', shape: 'shield', prefix: 'fa'}, //-
  "wine:null": {icon: 'fa-glass', markerColor: 'violet', iconColor: '#220000', shape: 'shield', prefix: 'fa'}, 
  "thunderstorm:null": {icon: 'fa-flash', markerColor: 'cyan', iconColor: '#0000AA', shape: 'shield', prefix: 'fa'}, //-
  "general plant development:null": {icon: 'fa-leaf', markerColor: 'violet', iconColor: '#000000', shape: 'shield', prefix: 'icon'}, //!-
  "harvest:null": {icon: 'fa-leaf', markerColor: 'green', iconColor: '#000000', shape: 'shield', prefix: 'icon'}, //!--
  "solar eclipse:null": {icon: 'fa-sun-o', markerColor: 'white', iconColor: '#AA3300', shape: 'circle', prefix: 'fa'}, //-

"longterm precipitation:extremely dry": {icon: 'fa-tint', markerColor: 'red', iconColor: '#FFFFFF', shape: 'marker', prefix: 'icon'},
"longterm precipitation:very dry": {icon: 'fa-tint', markerColor: 'orange', iconColor: '#FFFFFF', shape: 'marker', prefix: 'icon'},	
"wildfire:null": {icon: 'fa-fire', markerColor: 'yellow', iconColor: '#FF0000', shape: 'marker', prefix: 'icon'},
"damaged by fire:null": {icon: 'fa-fire', markerColor: 'yellow', iconColor: '#AA0000', shape: 'marker', prefix: 'icon'},
"temperature level:very hot": {icon: 'fa-sun-o', markerColor: 'yellow', iconColor: '#AA0000', shape: 'marker', prefix: 'icon'},
"water temperature level:very hot": {icon: 'fa-sun-o', markerColor: 'yellow', iconColor: '#CC0000', shape: 'marker', prefix: 'icon'},
"price trend:increasing price": {icon: 'fa-euro', markerColor: 'violet', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"price level:high price": {icon: 'fa-euro', markerColor: 'violet', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"water level trend:falling water level": {icon: 'fa-ship', markerColor: 'white', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"low water level:low water level (no water)": {icon: 'fa-ship', markerColor: 'blue', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"hunger (humans):null": {icon: 'fa-coffee', markerColor: 'purple', iconColor: '#FFFFFF', shape: 'marker', prefix: 'icon'},
"harvest quality:very good crop quality": {icon: 'fa-leaf', markerColor: 'green', iconColor: '#BBFFBB', shape: 'marker', prefix: 'icon'},
"harvest quantity:very low harvest volume": {icon: 'fa-leaf', markerColor: 'green', iconColor: '#BBFFBB', shape: 'marker', prefix: 'icon'},
"shortterm precipitation:no precipitation": {icon: 'fa-tint', markerColor: 'cyan', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"low water level:low water level (severly limited use)": {icon: 'fa-ship', markerColor: 'blue', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"thirst (animals):null": {icon: 'fa-beer', markerColor: 'cyan', iconColor: '#000000', shape: 'marker', prefix: 'icon'},
"hunger (animals):null": {icon: 'fa-star', markerColor: 'purple', iconColor: '#FFFFFF', shape: 'marker', prefix: 'icon'},
"low water level:low water level (limited use)": {icon: 'fa-ship', markerColor: 'blue', iconColor: '#000000', shape: 'circle', prefix: 'icon'},
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
            color: data.markerColor //'navy' //
          }),
          stroke: new ol.style.Stroke({
            color: data.markerColor, // 'white',
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


function getPopup(feature) {
  var property =  feature.getProperties();

  var quote = property.quote_text;
  if(quote.length > 512) {
     quote = quote.substr(0,500) + '   [ ... '+(quote.length-500).toString()+' more characters]';
  }	
  var srcTitle = property.source_title;
  if(srcTitle.length > 312) {
     srcTitle = srcTitle.substr(0,300) + '   [ ... '+(srcTitle.length-300).toString()+' more characters]';
  }    
  var popup = '<img src="https://www.tambora.org/images/logos/tambora-logo-red.png" alt="tambora.org" align="right" />'  
              + '<b>Node:</b> ' + property.node_label  
              + '<br/><b>Value:</b> ' + property.value_label 
              + '<hr style="margin:1px;"/><b>Quote:</b> ' + quote;
  if(property.public) {			  
    popup += '<hr style="margin:1px;"/><b>Source:</b> ' 
            + property.source_author /* + '('+'yyyy'+'): ' */		  
		  	    + ': ' + srcTitle
				    + '<hr style="margin:1px;"/>'
	}
	
	if(property.doi) {
      popup += '<b>DOI:</b> <a target="_blank" href="https://dx.doi.org/' + property.doi + '">'
			+ property.doi + '</a><br/>';
	}
	if(property.public) {
	  popup += '<b>More details on:</b> <a target="_blank" href="https://www.tambora.org/index.php/grouping/event/list?g[qid]=' 
			    + property.quote_id.toString() + '" >tambora.org</a>';
  }
  return popup;	
}
