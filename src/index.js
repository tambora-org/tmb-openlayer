
class TamboraMarkerLayer extends ol.layer.Vector {
   constructor(options) {
     options.name = "tambora.org";
     options.renderOrder = ol.ordering.yOrdering();
	   super(options);
       // this.year = options.year;
     this.vectorSource = new ol.source.Vector({
      url: "https://www.tambora.org/index.php/grouping/event/geojson?limit=5000&t[yb]=1540&t[ye]=1540&g[nd]=90,590,591,87,819,571&g[va]=86,82,6,104,101,41,48,142,57,134,124,125,123",
      projection: 'EPSG:3857',
      format: new ol.format.GeoJSON(),
      attributions: [ "&copy; <a href='https://www.tambora.org'>tambora.org</a>" ],
      //logo:"https://www.data.gouv.fr/s/avatars/37/e56718abd4465985ddde68b33be1ef.jpg" 
    });
    this.setSource(this.vectorSource);
    this.setStyle(getStyle);
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