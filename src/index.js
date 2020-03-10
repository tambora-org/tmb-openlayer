
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
     options.source = new ol.source.Vector({
      url: jsonUrl,
      projection: 'EPSG:3857',
      format: new ol.format.GeoJSON(),
      //attributions: [ "&copy; <a href='https://www.tambora.org'>tambora.org</a>" ],
      attributions: "<a href='"+tmbUrl+"'>tambora.org</a>", 
      logo:"https://www.tambora.org/images/logos/tambora-logo-red.png" 
    });
    super(options);
   }
}   


//class ol.layer.TamboraMarkerLayer {
//   constructor(options) {
//	   this = new  ol.layer.Vector(options);
//	   //super(options);
//      // this.year = options.year;
//}
//} 


  // Style function
  function getFeatureStyle (feature) {
    var st= [];
    

    // Font style
    st.push ( new ol.style.Style({
      image: new ol.style.FontSymbol({
          form: "marker", 
          gradient: false,
          glyph: "fa-info", 
          fontSize: 0.9,
          fontStyle: 'unset',
          radius: 15, 
          //offsetX: -15,
          rotation: 0,
          rotateWithView: true,
          offsetY: 0 ,
          color: 'red',
          fill: new ol.style.Fill({
            color: 'blue'
          }),
          stroke: new ol.style.Stroke({
            color: 'black',
            width: 2
          })
        }),
        stroke: new ol.style.Stroke({
          width: 2,
          color: '#f80'
        }),
        fill: new ol.style.Fill({
          color: [255, 136, 0, 0.6]
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