/* Real Protomaps v4 geometry, illustrated with RevLine's existing scenery palette.
   Source coordinates are never jittered and missing buildings are never invented. */
function createAtlasStyle() {
  const ink = '#0f1724';
  const sourceName = ['coalesce', ['get', 'name:en'], ['get', 'name'], ''];
  // The archive's sole non-BMP label has an emoji unsupported by this font renderer.
  const name = ['match', sourceName, 'Banyan 🌲', 'Banyan', sourceName];
  const kind = ['get', 'kind'];
  const geometry = ['geometry-type'];
  const layers = [];
  const add = (id, type, sourceLayer, paint, extra = {}) => layers.push({
    id, type, source: 'sri-lanka', 'source-layer': sourceLayer, paint, ...extra
  });
  const fill = (id, sourceLayer, color, extra = {}) => add(id, 'fill', sourceLayer, { 'fill-color': color }, extra);
  const forestKinds = ['forest', 'wood', 'nature_reserve', 'national_park'];
  const forestFilter = ['all', ['==', geometry, 'Polygon'], ['in', kind, ['literal', forestKinds]]];
  const polygon = ['==', geometry, 'Polygon'];
  layers.push({id:'ocean', type:'background', paint:{'background-color':'#2fa8e0'}});
  fill('land', 'earth', '#5bbb47');
  fill('landcover', 'landcover', ['match',kind,'forest','#388c3d','farmland','#9ac75a','urban_area','#a6bc82','scrub','#67a74c','barren','#d8bd7f','#65b84d']);
  fill('land-use', 'landuse', ['match', kind,
    ['residential','commercial','neighbourhood'],'#a8bf83',
    ['industrial','railway'],'#b4b4a2',
    ['forest','wood','nature_reserve','national_park'],'#2f8a3a',
    ['park','garden','golf_course','recreation_ground'],'#61ba4a',
    ['farmland','farmyard','orchard'],'#a0c85c',
    ['beach','sand'],'#f4e2b0',
    ['school','university','college','hospital'],'#d2c68d',
    ['pitch','stadium'],'#71bf5a',
    ['wetland'],'#6da77a',
    ['aerodrome'],'#a2b391', '#72b956'], {filter:polygon});
  // Only mapped forest polygons receive the illustrative canopy texture.
  add('forest-canopies', 'fill', 'landuse', {'fill-pattern':'canopy','fill-opacity':['interpolate',['linear'],['zoom'],11,0,13,.9]}, {filter:forestFilter,minzoom:11});
  add('forest-edges', 'line', 'landuse', {'line-color':'#246b35','line-width':1,'line-opacity':.55}, {filter:forestFilter,minzoom:12});
  fill('water', 'water', '#2fa8e0', {filter:polygon});
  add('water-edge', 'fill', 'water', {'fill-color':'#2fa8e0','fill-outline-color':'#267fa1'}, {filter:polygon,minzoom:12});
  add('streams', 'line', 'water', {'line-color':'#2fa8e0','line-width':['interpolate',['exponential',1.5],['zoom'],9,1,15,3,22,45]}, {filter:['==',geometry,'LineString'],minzoom:9,layout:{'line-cap':'round','line-join':'round'}});
  add('ferries','line','roads',{'line-color':'#e4f5ef','line-width':1.4,'line-dasharray':[3,3]}, {filter:['==',kind,'ferry'],minzoom:8});
  const buildings = ['all',polygon,['in',kind,['literal',['building','building_part']]]];
  add('building-shadow','fill','buildings',{'fill-color':ink,'fill-opacity':.26,'fill-translate':[3,4]}, {filter:buildings,minzoom:14});
  add('building-roofs','fill','buildings',{
    'fill-color':['match',['%', ['to-number',['id'],0],5],0,'#e88762',1,'#e6bb6d',2,'#d7d9c1',3,'#91b9bf','#ce9f7d'],
    'fill-outline-color':'#614d38'
  },{filter:buildings,minzoom:14});
  add('building-ink','line','buildings',{'line-color':'#5a4c39','line-width':['interpolate',['linear'],['zoom'],14,.3,18,1,22,2]}, {filter:buildings,minzoom:14});
  add('railway','line','roads',{'line-color':'#344539','line-width':['interpolate',['linear'],['zoom'],10,.5,16,2.5,22,12]}, {filter:['==',kind,'rail'],minzoom:10});
  add('railway-sleepers','line','roads',{'line-color':'#edf0da','line-width':1,'line-dasharray':[.4,3]}, {filter:['==',kind,'rail'],minzoom:14});
  const groups = [
    {id:'paths', kinds:['path'], scale:.35, color:'#e2cb93',min:13},
    {id:'streets', kinds:['minor_road'],scale:.7,color:'#555b60',min:12},
    {id:'main-roads', kinds:['major_road'],scale:1,color:'#454b54',min:7},
    {id:'highways', kinds:['highway'],scale:1.4,color:'#3b3f47',min:6}
  ];
  // Separate bridge passes preserve the source's bridge/tunnel classification.
  for (const bridge of [false,true]) {
    for (const group of groups) {
      const suffix = bridge ? '-bridge' : '';
      const filter = ['all',['==',geometry,'LineString'],['in',kind,['literal',group.kinds]],
        bridge ? ['==',['get','is_bridge'],true] : ['!=',['get','is_bridge'],true]];
      const width = (edge=0) => ['interpolate',['exponential',2],['zoom'],
        6,.55*group.scale+edge*.2,10,1.3*group.scale+edge*.4,14,4.6*group.scale+edge,
        18,16*group.scale+edge,22,256*group.scale+edge*2];
      const extra={filter,minzoom:group.min,layout:{'line-cap':'round','line-join':'round','line-sort-key':['coalesce',['get','sort_rank'],0]}};
      add(group.id+suffix+'-edge','line','roads',{'line-color':bridge?ink:'#e2d6a0','line-width':width(2),'line-opacity':['case',['==',['get','is_tunnel'],true],.4,1]},extra);
      add(group.id+suffix,'line','roads',{'line-color':group.color,'line-width':width(),'line-opacity':['case',['==',['get','is_tunnel'],true],.45,1]},extra);
      if (group.id !== 'paths') add(group.id+suffix+'-markings','line','roads',{
        'line-color':'#f4efdc','line-width':['interpolate',['exponential',2],['zoom'],16,.7,18,1.2,22,8],
        'line-dasharray':[5,7],'line-opacity':['interpolate',['linear'],['zoom'],15,0,17,.7]
      },{...extra,minzoom:15});
    }
  }
  add('districts','line','boundaries',{'line-color':'#326d42','line-width':1,'line-dasharray':[3,3],'line-opacity':.35}, {filter:['==',kind,'region'],minzoom:7,maxzoom:11});
  add('road-names','symbol','roads',{'text-color':'#fff9e2','text-halo-color':'#344131','text-halo-width':1.6}, {
    minzoom:13,filter:['all',['in',kind,['literal',['highway','major_road','minor_road']]],['!=',name,'']],
    layout:{'symbol-placement':'line','text-field':name,'text-font':['Noto Sans Regular'],'text-size':['interpolate',['linear'],['zoom'],13,10,18,13], 'symbol-spacing':400,'text-max-angle':30}
  });
  add('water-names','symbol','water',{'text-color':'#164a68','text-halo-color':'#79ceee','text-halo-width':1.5}, {
    minzoom:10,filter:['all',['==',geometry,'Point'],['!=',name,'']],
    layout:{'text-field':name,'text-font':['Noto Sans Regular'],'text-size':12,'text-max-width':7}
  });
  add('place-dots','circle','places',{'circle-color':'#ffc928','circle-radius':['interpolate',['linear'],['zoom'],6,2.5,10,4], 'circle-stroke-color':ink,'circle-stroke-width':1.5}, {
    filter:['all',['==',kind,'locality'],['in',['get','kind_detail'],['literal',['city','town']]]],maxzoom:12
  });
  add('place-names','symbol','places',{'text-color':'#fffce9','text-halo-color':'#25492e','text-halo-width':2}, {
    filter:['all',['in',kind,['literal',['locality','neighbourhood','macrohood']]],['!=',name,'']],
    layout:{'text-field':name,'text-font':['Noto Sans Bold'],'text-size':['interpolate',['linear'],['zoom'],6,12,10,15,16,17],
      'text-padding':10,'text-max-width':9,'text-anchor':'top','text-offset':[0,.6],
      'symbol-sort-key':['coalesce',['get','min_zoom'],10]}
  });
  add('poi-dots','circle','pois',{'circle-radius':3,'circle-color':'#ffc928','circle-stroke-color':ink,'circle-stroke-width':1}, {minzoom:17});
  add('poi-names','symbol','pois',{'text-color':'#243b31','text-halo-color':'#ecedc8','text-halo-width':1.5}, {
    minzoom:17,filter:['!=',name,''],layout:{'text-field':name,'text-font':['Noto Sans Regular'],'text-size':11,'text-anchor':'top','text-offset':[0,.7],'text-max-width':8,'text-padding':5,'symbol-sort-key':['coalesce',['get','min_zoom'],16]}
  });
  return {
    version:8,name:'RevLine Sri Lanka · cartoon atlas',
    glyphs:new URL('fonts/{fontstack}/{range}.pbf',location.href).href.replaceAll('%7B','{').replaceAll('%7D','}'),
    sources:{'sri-lanka':{type:'vector',url:'pmtiles://'+new URL('data/sri-lanka.pmtiles',location.href).href,
      attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> · <a href="https://protomaps.com" target="_blank" rel="noreferrer">Protomaps</a>'}},layers
  };
}

function createCanopyImage() {
  // A repeating decorative texture, confined to real mapped forest polygons.
  // Draw at device resolution; the map's geography itself remains vector data.
  const ratio = Math.min(devicePixelRatio || 1,3), size = 128;
  const canvas=document.createElement('canvas');canvas.width=canvas.height=size*ratio;
  const c=canvas.getContext('2d');c.scale(ratio,ratio);
  for (const [x,y,r] of [[21,25,14],[88,21,11],[54,76,17],[112,105,13],[7,111,8]]) {
    c.fillStyle='#17482755';c.beginPath();c.ellipse(x+3,y+4,r+2,r,0,0,Math.PI*2);c.fill();
    c.fillStyle='#347e35';c.strokeStyle='#174c2c';c.lineWidth=1.7;c.beginPath();
    for(let n=0;n<=24;n++){const a=n/24*Math.PI*2,d=r*(1+.1*Math.sin(n/24*Math.PI*12));const px=x+Math.cos(a)*d,py=y+Math.sin(a)*d;n?c.lineTo(px,py):c.moveTo(px,py)}
    c.closePath();c.fill();c.stroke();
    for(const [dx,dy,s,color] of [[-5,-4,.45,'#58a349'],[5,-3,.38,'#4b9841'],[0,5,.4,'#438c38']]){c.beginPath();c.arc(x+dx,y+dy,r*s,0,Math.PI*2);c.fillStyle=color;c.fill()}
  }
  return {data:c.getImageData(0,0,canvas.width,canvas.height),pixelRatio:ratio};
}
