
class TamboraMarkerLayer extends ol.layer.Vector {
   constructor(options) {
	   super(options);
       // this.year = options.year;
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