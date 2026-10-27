/* Four fixed 2D views. Directional artwork uses one constant camera calibration,
   then scales with the map; vertical walls never tilt during zoom or pan. */
const UNITY_PLAZA = {
  key: 'unity-plaza',
  name: 'Unity Plaza',
  id: 35184714032280,
  center: [79.85515594482422, 6.893515547074671],
  // Full source polygon (one tile also contains a clipped copy of this building).
  corners: [
    [79.85489040613174, 6.893598094460941],
    [79.85531955957413, 6.893739223829968],
    [79.8554214835167, 6.89343566249363],
    [79.85499233007431, 6.893291870213815]
  ],
  // View from the northeast: the named facade faces the eastern Galle Road edge.
  bearing: -148,
  pitch: 58,
  fieldOfView: 1,
  minZoom: 17,
  image: 'landmarks/unity-plaza/unity-plaza.png',
  bounds: [234, 13, 1316, 1010],
  width: 1536, height: 1024,
  detail: 'Bambalapitiya · Galle Road. A fixed-view 2D illustration based on exterior photographs. Blue-glass façades and the LED fascia follow references; roof details are approximate.',
  // The original artwork stays upright, with one uniform scale and no shear.
  // Its sign-bearing facade runs from image frontageStart to groundAnchor.
  groundAnchor: [890,980],
  frontageStart: [282,720],
  anchorCorner: 1,
  frontageCorner: 2
};

const MAJESTIC_CITY = {
  key: 'majestic-city', name: 'Majestic City', id: 35184580903184,
  center: [79.85468119382858,6.893978877379183],
  viewCenter: [79.85482186736266,6.893879985557206],
  corners: [
    [79.85415279865265,6.894082727212876],
    [79.85504865646362,6.8943676484345815],
    [79.85521495342255,6.893853724985263],
    [79.85431641340256,6.893568803454556]
  ],
  minZoom: 17,
  image: 'landmarks/majestic-city/majestic-city-aligned.png',
  bounds: [50, 160, 1284, 1129],
  width: 1325, height: 1187,
  // Camera-corrected artwork: its 23.2° frontage matches Unity Plaza's 23.2°.
  // Keep the renderer rigid, rather than tilting the walls to rotate the base.
  groundAnchor: [769,1069], frontageStart: [145,802],
  anchorCorner: 1, frontageCorner: 2,
  detail: 'Bambalapitiya · Galle Road. Based on your Google Flow illustration, with its view adjusted to align the entrance frontage with the road. Anchored to the mapped building; depth and roof details are illustrative.'
};
const ATLAS_LANDMARKS = [UNITY_PLAZA, MAJESTIC_CITY];

const ATLAS_VIEWS = {
  front: {label:'Front', offset:0}, right: {label:'Right', offset:90},
  back: {label:'Back', offset:180}, left: {label:'Left', offset:270}
};
const ATLAS_CAMERA = {view:'front'};
// Each image has its own real ground corner. The measured base axes calibrate
// the generated camera once; those ratios never change during zoom or pan.
UNITY_PLAZA.views = {
  right: {image:'landmarks/views/unity-right.png',projectedBounds:[235,-174.904,1333,984.704],bounds:[235, 3, 1333, 1022],width:1536,height:1024,groundAnchor:[643,983],groundLeft:[283,770],groundRight:[1275,737],anchorCorner:2,frontageCorner:1,frontageStart:[1275,737]},
  back: {image:'landmarks/views/unity-back.png',projectedBounds:[207,-35.966,1328,1097.593],bounds:[207, 13, 1328, 1017],width:1536,height:1024,groundAnchor:[895,1002],groundLeft:[253,705],groundRight:[1270,819],anchorCorner:3,frontageCorner:0,frontageStart:[253,705]},
  left: {image:'landmarks/views/unity-left.png',projectedBounds:[302,-135.705,1312,985.564],bounds:[302, 34, 1312, 1014],width:1536,height:1024,groundAnchor:[701,998],groundLeft:[350,799],groundRight:[1267,758],anchorCorner:0,frontageCorner:3,frontageStart:[1267,758]}
};
MAJESTIC_CITY.views = {
  right: {image:'landmarks/views/majestic-right.png',projectedBounds:[23,-130.814,1304,830.966],bounds:[23, 77, 1304, 1138],width:1325,height:1187,groundAnchor:[590,1066],groundLeft:[63,615],groundRight:[1265,838],anchorCorner:2,frontageCorner:1,frontageStart:[1265,838]},
  back: {image:'landmarks/views/majestic-back.png',projectedBounds:[30,46.99,1312,895.834],bounds:[30, 97, 1312, 1127],width:1325,height:1187,groundAnchor:[699,1090],groundLeft:[68,702],groundRight:[1269,702],anchorCorner:3,frontageCorner:0,frontageStart:[68,702]},
  left: {image:'landmarks/views/majestic-left.png',projectedBounds:[24,23.994,1304,971.195],bounds:[24, 103, 1304, 1182],width:1320,height:1192,groundAnchor:[693,1147],groundLeft:[64,733],groundRight:[1263,848],anchorCorner:0,frontageCorner:3,frontageStart:[1263,848]}
};
function atlasLandmarkView(landmark,key=ATLAS_CAMERA.view) {
  return key==='front'?landmark:landmark.views[key];
}
function atlasViewAtZoom(zoom,key=ATLAS_CAMERA.view) {
  const mix=Math.max(0,Math.min(1,(zoom-14.5)/2.5));
  const bearing=UNITY_PLAZA.bearing*mix+ATLAS_VIEWS[key].offset;
  return {bearing:((bearing+540)%360)-180,pitch:UNITY_PLAZA.pitch*mix};
}
function atlasImageProjection(landmark,view,key) {
  if(key==='front')return {skew:0,vertical:1};
  const angle=atlasViewAtZoom(17,key).bearing*Math.PI/180;
  const cos=Math.cos(angle),sin=Math.sin(angle),latitude=Math.cos(landmark.center[1]*Math.PI/180);
  const anchor=landmark.corners[view.anchorCorner];
  const slope=corner=>{
    const point=landmark.corners[corner],east=(point[0]-anchor[0])*latitude,north=point[1]-anchor[1];
    return (-sin*east-cos*north)*Math.cos(UNITY_PLAZA.pitch*Math.PI/180)/(cos*east-sin*north);
  };
  const imageSlope=point=>(point[1]-view.groundAnchor[1])/(point[0]-view.groundAnchor[0]);
  const left=slope((view.anchorCorner+1)%4),right=slope((view.anchorCorner+3)%4);
  const vertical=(left-right)/(imageSlope(view.groundLeft)-imageSlope(view.groundRight));
  return {skew:left-vertical*imageSlope(view.groundLeft),vertical};
}
function atlasSpritePlacement(map,landmark,key=ATLAS_CAMERA.view) {
  const view=atlasLandmarkView(landmark,key),projection=atlasImageProjection(landmark,view,key);
  const {skew,vertical}=projection;
  const anchor=view.groundAnchor,edge=view.frontageStart;
  const front=map.project(landmark.corners[view.anchorCorner]);
  const end=map.project(landmark.corners[view.frontageCorner]);
  const dx=edge[0]-anchor[0],dy=skew*dx+vertical*(edge[1]-anchor[1]);
  const scale=Math.hypot(end.x-front.x,end.y-front.y)/Math.hypot(dx,dy);
  return {view,skew,vertical,scale,x:front.x-scale*anchor[0],y:front.y-scale*(skew*anchor[0]+vertical*anchor[1]),depth:front.y};
}
function atlasLandmarkBounds(map,landmarks=ATLAS_LANDMARKS) {
  const points=landmarks.flatMap(landmark=>{
    const p=atlasSpritePlacement(map,landmark),[left,top,right,bottom]=p.view.projectedBounds||p.view.bounds;
    return [[left,top],[right,top],[right,bottom],[left,bottom]].map(([x,y])=>[p.x+p.scale*x,p.y+p.scale*y]);
  });
  return {left:Math.min(...points.map(p=>p[0])),right:Math.max(...points.map(p=>p[0])),top:Math.min(...points.map(p=>p[1])),bottom:Math.max(...points.map(p=>p[1]))};
}
function mountLandmarks(map,onSelect,onError) {
  const originalFilters=new Map(['building-shadow','building-roofs','building-ink'].map(id=>[id,map.getFilter(id)]));
  let replacedIds='';
  const sprites=ATLAS_LANDMARKS.map(landmark=>{
    const button=document.createElement('button');
    button.type='button';button.id=landmark.key+'-sprite';button.className='landmark-sprite';button.hidden=true;
    button.setAttribute('aria-label',landmark.name+', Bambalapitiya. View building details.');
    map.getCanvasContainer().append(button);
    button.addEventListener('click',event=>{event.stopPropagation();onSelect(landmark)});
    const sprite={landmark,button,variants:{},current:null,x:0,y:0,scale:0,depth:0};
    for(const key of Object.keys(ATLAS_VIEWS)) {
      const view=atlasLandmarkView(landmark,key),image=new Image(view.width,view.height);
      image.alt='';image.draggable=false;
      const variant={view,image,loaded:false,requested:false,hitContext:null};
      image.addEventListener('load',()=>{
        const canvas=document.createElement('canvas');canvas.width=view.width;canvas.height=view.height;
        variant.hitContext=canvas.getContext('2d',{willReadFrequently:true});
        variant.hitContext.drawImage(image,0,0,view.width,view.height);
        variant.loaded=true;render();map.triggerRepaint();
      });
      image.addEventListener('error',()=>{
        variant.loaded=false;render();
        onError(landmark.name+' artwork could not load for the '+ATLAS_VIEWS[key].label+' view. Its mapped footprint is available. Reload to try again.');
      });
      sprite.variants[key]=variant;
    }
    return sprite;
  });
  function render() {
    const key=ATLAS_CAMERA.view,target=atlasViewAtZoom(17,key);
    const buildingsVisible=map.getLayoutProperty('building-roofs','visibility')!=='none';
    const bearingError=((map.getBearing()-target.bearing+540)%360)-180;
    const fixedView=Math.abs(bearingError)<.01&&Math.abs(map.getPitch()-target.pitch)<.01;
    const width=map.getCanvas().clientWidth,height=map.getCanvas().clientHeight,active=[];
    for(const sprite of sprites) {
      const {landmark,button}=sprite,variant=sprite.variants[key],view=variant.view;
      const atStreetScale=map.getZoom()>=landmark.minZoom;
      if(atStreetScale&&!variant.requested){variant.requested=true;variant.image.src=view.image}
      if(!atStreetScale||!buildingsVisible||!variant.loaded||!fixedView){button.hidden=true;continue}
      active.push(landmark.id);
      Object.assign(sprite,atlasSpritePlacement(map,landmark,key));
      const {x,y,scale,skew,vertical}=sprite;
      const top=y+Math.min(0,scale*skew*view.width),bottom=y+Math.max(0,scale*skew*view.width)+scale*vertical*view.height;
      button.hidden=x+view.width*scale<0||x>width||bottom<0||top>height;
      if(sprite.current!==variant){
        button.replaceChildren(variant.image);button.style.width=view.width+'px';button.style.height=view.height+'px';
        button.dataset.view=key;sprite.current=variant;
      }
      if(!button.hidden)button.style.transform=`matrix(${scale},${scale*skew},0,${scale*vertical},${x},${y})`;
    }
    const ids=active.join(',');
    if(ids!==replacedIds){replacedIds=ids;for(const [id,filter] of originalFilters)map.setFilter(id,active.length?['all',filter,['!', ['in',['id'],['literal',active]]]]:filter)}
    sprites.sort((a,b)=>a.depth-b.depth).forEach((sprite,index)=>{sprite.button.style.zIndex=index+1});
  }
  map.on('render',render);map.on('remove',()=>sprites.forEach(sprite=>sprite.button.remove()));render();
  return (point,hover=false)=>{
    const hit=[...sprites].reverse().find(sprite=>{
      if(sprite.button.hidden)return false;
      const x=(point.x-sprite.x)/sprite.scale;
      const y=((point.y-sprite.y)/sprite.scale-sprite.skew*x)/sprite.vertical;
      const {view,hitContext}=sprite.current;
      return x>=0&&y>=0&&x<view.width&&y<view.height&&hitContext.getImageData(Math.floor(x),Math.floor(y),1,1).data[3]>32;
    });
    if(hover)sprites.forEach(sprite=>sprite.button.classList.toggle('hovered',sprite===hit));
    return hit?.landmark;
  };
}
