
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
      distance: 100,
      source: source,
      attributions: "<a href='"+tmbUrl+"'>tambora.org</a>", 
    });
  

    options.source = clusterSource;
    super(options);

      
    this.srcClustered = clusterSource;
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
          if (view.getZoom() >= 9 && oldSource instanceof ol.source.Cluster) {
            layer.setSource(layer.srcUnclustered);
          }
          else if (view.getZoom() < 9 && oldSource instanceof ol.source.Vector) {
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
    
    var glyph = ol.style.FontSymbol.prototype.defs.glyphs;

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
    st.push ( new ol.style.Style({
      image: new ol.style.FontSymbol({
          form: "circle", //"marker", 
          gradient: true,
          glyph: glyphIcon,
          fontSize: 1,
          fontStyle: '',
          radius: 20, 
          //offsetX: -15,
          rotation: 0,
          rotateWithView: false,
          offsetY: 0,
          color: 'red',
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
          color: markerColor // [255, 136, 0, 0.6]
        })
      }));
      return st;
  }

  function getStyle(feature, resolution) {
    var s = getFeatureStyle(feature);
    // Ne pas recalculer
    //feature.setStyle(s);
    return s;
    
  };



