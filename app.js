/* Standalone atlas. Does not import the game, voice input, or saved device data. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const requestedView=new URLSearchParams(location.search).get('view');
  if(Object.hasOwn(ATLAS_VIEWS,requestedView))ATLAS_CAMERA.view=requestedView;
  const places = {
    landmarks:[79.85493,6.89396,18.3,17.2],
    'unity-plaza': [...UNITY_PLAZA.center,19.1,18.7],
    'majestic-city': [...MAJESTIC_CITY.viewCenter,18.7,17.7],
    colombo:[79.8553,6.9271,15],kandy:[80.6395,7.2906,15],galle:[80.217,6.0279,16.4],
    jaffna:[80.012,9.6615,15],trincomalee:[81.2335,8.5711,14.5],batticaloa:[81.6924,7.717,15],
    anuradhapura:[80.4037,8.335,14],polonnaruwa:[81.003,7.94,14],negombo:[79.8358,7.2083,15],
    kurunegala:[80.3647,7.4863,15],nuwaraeliya:[80.769,6.9708,15],ella:[81.046,6.873,15.5],
    ratnapura:[80.403,6.6828,15],matara:[80.548,5.948,15],hambantota:[81.119,6.124,15],sigiriya:[80.7597,7.957,15.8]
  };
  const island = [[79.55,5.88],[81.94,9.88]];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let map, pickLandmark, ready=false, loadFailed=false, loadTimer, statusTimer;
  function announce(text, clearAfter=0) {
    clearTimeout(statusTimer);$('status').textContent=text;
    if(clearAfter) statusTimer=setTimeout(()=>$('status').textContent='',clearAfter);
  }
  function showError(message) {
    clearTimeout(loadTimer);$('error-detail').textContent=message;$('load-error').hidden=false;announce('');
  }
  function fitIsland(animate=true) {
    const mobile=innerWidth<=650;
    map.fitBounds(island,{bearing:atlasViewAtZoom(7).bearing,pitch:0,padding:mobile?{top:115,bottom:265,left:25,right:55}:{top:65,bottom:65,left:320,right:110},duration:animate&&!reducedMotion.matches?1000:0});
    $('place').value='';$('feature').hidden=true;
  }
  function updateZoom() {
    $('zoom-level').textContent=map.getZoom().toFixed(1);
    $('zoom-in').disabled=map.getZoom()>=22;
    $('zoom-out').disabled=map.getZoom()<=5.4;
    $('north').querySelector('span').style.transform=`rotate(${-map.getBearing()}deg)`;
    $('map-hint').textContent=map.getZoom()>=UNITY_PLAZA.minZoom?ATLAS_VIEWS[ATLAS_CAMERA.view].label+' bird’s-eye view · drag or zoom. Click a building for details.':'Scroll or pinch to explore. Click a road or building for details.';
  }
  function settleView() {
    const view=atlasViewAtZoom(map.getZoom());
    const bearingError=((map.getBearing()-view.bearing+540)%360)-180;
    if(Math.abs(bearingError)>.01||Math.abs(map.getPitch()-view.pitch)>.01)map.jumpTo(view);
    updateZoom();
  }
  function frameSelectedLandmarks() {
    const selected=$('place').value;
    const landmarks=selected==='landmarks'?ATLAS_LANDMARKS:ATLAS_LANDMARKS.filter(l=>l.key===selected);
    if(!landmarks.length||map.getZoom()<17)return;
    const box=atlasLandmarkBounds(map,landmarks),mobile=innerWidth<=650;
    const left=mobile?20:320,right=innerWidth-95,top=120;
    const bottom=mobile?document.querySelector('.explore').getBoundingClientRect().top-20:innerHeight-75;
    const fit=Math.max((box.right-box.left)/(right-left),(box.bottom-box.top)/(bottom-top));
    if(fit>1.005&&map.getZoom()>17.001){
      map.once('moveend',()=>queueMicrotask(frameSelectedLandmarks));
      map.zoomTo(Math.max(17,map.getZoom()-Math.log2(fit)),{duration:reducedMotion.matches?0:200});return;
    }
    const x=(box.left+box.right-left-right)/2,y=(box.top+box.bottom-top-bottom)/2;
    if(Math.abs(x)>.5||Math.abs(y)>.5)map.panBy([x,y],{duration:reducedMotion.matches?0:200});
  }
  function start() {
    if(location.protocol==='file:') {
      showError('Open “Open Map.command” in this folder, or run python3 server.py. The local server reads small parts of the country archive as you explore.');return;
    }
    if(!window.maplibregl||!window.pmtiles){showError('The local map libraries are missing. Restore the vendor folder and try again.');return}
    const protocol=new pmtiles.Protocol();maplibregl.addProtocol('pmtiles',protocol.tile);
    const restoringView=Boolean(location.hash);
    try {
      map=new maplibregl.Map({container:'map',style:createAtlasStyle(),center:[80.75,7.85],zoom:7,
        minZoom:5.4,maxZoom:22,maxPitch:UNITY_PLAZA.pitch,renderWorldCopies:false,
        maxBounds:[[76,3.5],[85,12.2]],dragRotate:false,pitchWithRotate:false,
        touchZoomRotate:true,touchPitch:false,attributionControl:false,hash:true,fadeDuration:reducedMotion.matches?0:180});
      // Near-orthographic ground keeps a game sprite's frontage consistent across
      // the viewport. Public MapLibre API; no renderer internals or mesh needed.
      map.setVerticalFieldOfView(UNITY_PLAZA.fieldOfView);
      map.touchZoomRotate.disableRotation();
      map.keyboard.disableRotation();
      map.addControl(new maplibregl.AttributionControl({compact:false}),'bottom-right');
      map.addControl(new maplibregl.ScaleControl({maxWidth:110,unit:'metric'}),'bottom-left');
      map.getCanvas().setAttribute('aria-label','Sri Lanka map. Arrow keys pan. Plus and minus zoom.');
      map.on('styleimagemissing',e=>{if(e.id==='canopy'&&!map.hasImage('canopy')){const canopy=createCanopyImage();map.addImage('canopy',canopy.data,{pixelRatio:canopy.pixelRatio})}});
      map.on('error',e=>{loadFailed=true;console.error('Atlas:',e.error);showError('A map file could not be read. Keep the data, fonts and vendor folders together, and use the included local server. Then try again.')});
      map.on('load',()=>{
        if(loadFailed)return; // MapLibre can emit load even after a source failed.
        ready=true;clearTimeout(loadTimer);$('load-error').hidden=true;
        pickLandmark=mountLandmarks(map,showLandmark,message=>announce(message));
        if(!restoringView)fitIsland(false);
        settleView();announce('Drag to explore · scroll or pinch to zoom',4200);
      });
      map.on('zoom',updateZoom);
      map.on('moveend',settleView);
      map.on('click',inspectFeature);
      map.on('mousemove',e=>{
        if(!ready)return;
        map.getCanvas().style.cursor=pickLandmark?.(e.point,true)||map.queryRenderedFeatures(e.point,{layers:selectableLayers()}).length?'pointer':'';
      });
      loadTimer=setTimeout(()=>{if(!ready)showError('The map is taking too long to open. Check that data/sri-lanka.pmtiles is present and restart the local server.')},20000);
    } catch(error) {console.error(error);showError('The map could not start. Use the included local server and a current browser, then try again.')}
  }
  const selectableLayers=()=>map.getStyle().layers.filter(l=>l.type==='fill'&&l.id==='building-roofs'||l.type==='line'&&/^(streets|main-roads|highways|paths)(-bridge)?$/.test(l.id)).map(l=>l.id);
  function showLandmark(landmark) {
    $('feature-type').textContent='Illustrated landmark';
    $('feature-name').textContent=landmark.name;
    $('feature-detail').textContent=landmark.detail+(ATLAS_CAMERA.view==='front'?'':' Rear and unseen side details in this view are artistic approximations.');
    $('feature-coordinates').textContent=landmark.center[1].toFixed(5)+'° N, '+landmark.center[0].toFixed(5)+'° E';
    $('feature').hidden=false;
  }
  function inspectFeature(event) {
    if(!ready)return;
    const landmark=pickLandmark?.(event.point);
    if(landmark){showLandmark(landmark);return}
    const features=map.queryRenderedFeatures([[event.point.x-3,event.point.y-3],[event.point.x+3,event.point.y+3]],{layers:selectableLayers()});
    if(!features.length){$('feature').hidden=true;return}
    const f=features[0],p=f.properties,building=f.sourceLayer==='buildings';
    $('feature-type').textContent=building?'Mapped building':'Mapped road';
    $('feature-name').textContent=p['name:en']||p.name||p.ref||(building?'Building footprint':'Unnamed road');
    $('feature-detail').textContent=building?'OpenStreetMap footprint. Roof colour is illustrative; building appearance has not been surveyed.':(p.kind_detail||p.kind||'Road').replaceAll('_',' ')+(p.is_bridge?' · bridge':'')+(p.is_tunnel?' · tunnel':'')+'. Path follows the source map.';
    $('feature-coordinates').textContent=event.lngLat.lat.toFixed(5)+'° N, '+event.lngLat.lng.toFixed(5)+'° E';
    $('feature').hidden=false;
  }
  $('whole-island').onclick=()=>{if(map)fitIsland()};
  $('place').onchange=event=>{
    const point=places[event.target.value];if(!point||!map)return;
    const zoom=innerWidth<=650?(point[3]??point[2]):point[2];
    if(event.target.value==='landmarks')map.once('moveend',()=>queueMicrotask(frameSelectedLandmarks));
    map.flyTo({center:point.slice(0,2),zoom,...atlasViewAtZoom(zoom),duration:reducedMotion.matches?0:1600});$('feature').hidden=true;
  };
  for(const [key,view] of Object.entries(ATLAS_VIEWS)) {
    const button=$('view-'+key);button.setAttribute('aria-pressed',String(ATLAS_CAMERA.view===key));
    button.onclick=()=>{
      ATLAS_CAMERA.view=key;
      for(const other of Object.keys(ATLAS_VIEWS))$('view-'+other).setAttribute('aria-pressed',String(other===key));
      const url=new URL(location.href);
      if(key==='front')url.searchParams.delete('view');else url.searchParams.set('view',key);
      history.replaceState(null,'',url);$('feature').hidden=true;
      if(!ready){announce('Opening '+view.label.toLowerCase()+' view…');return}
      if($('place').value==='landmarks')map.once('moveend',()=>queueMicrotask(frameSelectedLandmarks));
      map.easeTo({...atlasViewAtZoom(map.getZoom()),duration:reducedMotion.matches?0:450});
      announce(view.label+' view',2000);
    };
  }
  $('zoom-in').onclick=()=>{if(map)map.zoomIn({duration:reducedMotion.matches?0:220})};
  $('zoom-out').onclick=()=>{if(map)map.zoomOut({duration:reducedMotion.matches?0:220})};
  for(const id of ['labels','buildings','trees'])$(id).onclick=()=>{
    if(!ready)return;
    const visible=$(id).getAttribute('aria-pressed')!=='true';
    $(id).setAttribute('aria-pressed',String(visible));
    for(const layer of map.getStyle().layers) {
      const matches=id==='labels'?layer.type==='symbol'||layer.id==='place-dots'||layer.id==='poi-dots':id==='buildings'?layer.id.startsWith('building-'):layer.id==='forest-canopies';
      if(matches)map.setLayoutProperty(layer.id,'visibility',visible?'visible':'none');
    }
    if(id==='buildings'&&!visible)$('feature').hidden=true;
  };
  $('close-feature').onclick=()=>{$('feature').hidden=true;map.getCanvas().focus()};
  $('about').onclick=()=>$('about-dialog').showModal();
  $('close-about').onclick=()=>$('about-dialog').close();
  $('about-dialog').onclick=e=>{if(e.target===$('about-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}};
  $('retry').onclick=()=>location.reload();
  document.addEventListener('keydown',e=>{if(e.key==='Escape')$('feature').hidden=true});
  start();
})();
