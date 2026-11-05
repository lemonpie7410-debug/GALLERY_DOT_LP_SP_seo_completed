(function(){
var $=function(s){return document.querySelector(s)};
/* sticky CTA: hero通過後に表示、予約フォーム表示中は隠す */
var bar=$('#bar'),hero=$('#top'),rs=$('#reserve'),pastHero=false,inRsv=false;
function upd(){bar.classList.toggle('on',pastHero&&!inRsv)}
new IntersectionObserver(function(e){pastHero=!e[0].isIntersecting;upd()},{threshold:.35}).observe(hero);
new IntersectionObserver(function(e){inRsv=e[0].isIntersecting;upd()},{threshold:.05}).observe(rs);
/* ファーストビュー：写真がゆっくり横にスクロールして切り替わる */
var sl=[].slice.call(document.querySelectorAll('.sl')),ci=0;
if(sl.length>1)setInterval(function(){var a=sl[ci];ci=(ci+1)%sl.length;var b=sl[ci];
a.classList.remove('on');a.classList.add('out');b.classList.add('on');
setTimeout(function(){a.style.transition='none';a.classList.remove('out');void a.offsetWidth;a.style.transition=''},3000)},6000);
/* 日付：会期中の営業日（火曜は休館） */
var WD=['土','日','月','火','水','木','金'],TAG={11:'トーク',17:'トーク',18:'ライブ',24:'トーク',25:'ライブ'},dh='';
for(var d=10;d<=26;d++){if(d==13||d==20)continue;dh+='<label class="opt"><input type="radio" name="d" value="'+d+'"><span>10/'+d+'<small>'+WD[(d-10)%7]+(TAG[d]?'・'+TAG[d]:'')+'</small></span></label>'}
$('#dates').innerHTML=dh;
var EV={talk1:{d:11,s:'10/11（日）トーク「AFTER IMAGEと、10年のキュレーション」17:00–18:15',k:'トーク'},talk2:{d:17,s:'10/17（土）トーク「記憶・物質・イメージの残り方」18:00–19:00',k:'トーク'},live1:{d:18,s:'10/18（日）ライブ「Light Trace」18:30–19:10',k:'ライブ'},talk3:{d:24,s:'10/24（土）トーク「若手作家が語る“AFTER IMAGE”」16:00–17:00',k:'トーク'}};
var PRICE=1500,n=0;
/* 時間枠：空き状況はダミー。本番は予約システムの値に置き換える */
function slots(day){var h='';for(var t=0;t<14;t++){var hh=12+Math.floor(t/2),mm=t%2?'30':'00',seed=(day*7+t*13)%10,st=seed<2?'満席':seed<5?'残りわずか':'空きあり';
h+='<label class="opt"><input type="radio" name="t" value="'+hh+':'+mm+'"'+(st==='満席'?' disabled':'')+'><span>'+hh+':'+mm+'<small>'+st+'</small></span></label>'}
$('#slots').innerHTML=h;$('#slotset').hidden=false}
function ch(nm){var e=document.querySelector('input[name='+nm+']:checked');return e?e.value:null}
function pick(day){var r=document.querySelector('input[name=d][value="'+day+'"]');if(!r)return;r.checked=true;slots(day);$('#e-date').textContent='';
  var lb=r.parentNode,box=$('#dates');box.scrollLeft=lb.offsetLeft-(box.clientWidth-lb.offsetWidth)/2}
function sum(){var d=ch('d'),t=ch('t'),ks=[].slice.call(document.querySelectorAll('input[name=ev]:checked')).map(function(c){return EV[c.value]});
  $('#s-d').textContent=d?'10/'+d+'（'+WD[(d-10)%7]+'）':'未選択';
  $('#s-t').textContent=t||'未選択';
  $('#s-n').textContent='予約者＋'+n+'名（計'+(1+n)+'名）';
  $('#s-e').textContent=ks.length?ks.map(function(x){return x.s.split('」')[0]+'」'}).join('、'):'なし';
  $('#s-p').textContent='¥'+((1+n)*PRICE).toLocaleString('ja-JP')+'（一般 ¥1,500 × '+(1+n)+'名）';
  var h='';
  if(!ks.length){h='<b>選択中のイベント：なし</b>来場予約と同時に、トーク・ライブも申し込めます。参加したい回にチェックしてください。'}
  else{h='<b>選択中のイベント</b>'+ks.map(function(x){return '<span>'+x.s+'</span>'}).join('');
    var ds=ks.map(function(x){return x.d}).filter(function(v,i,a){return a.indexOf(v)===i});
    if(ds.length>1)h+='<span class="wn">日をまたぐ場合は、日ごとに来場予約が必要です。</span>';
    else if(d&&+d!==ds[0])h+='<span class="wn">来場日を10/'+ds[0]+'に合わせてください。</span>'}
  h+='<em>来場の時間枠は、開始の30分前までをおすすめします。</em>';
  $('#sel').innerHTML=h}
$('#dates').addEventListener('change',function(e){slots(+e.target.value);sum()});
$('#f').addEventListener('change',sum);
function cn(v){n=Math.max(0,Math.min(2,n+v));$('#co').textContent=n+'名';sum()}
$('#mn').onclick=function(){cn(-1)};$('#pl').onclick=function(){cn(1)};
/* イベントの「予約する」：イベントのチェックと来場日を自動で選び、フォームへ移動 */
document.querySelectorAll('[data-ev]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();
  var k=a.dataset.ev,c=document.querySelector('input[name=ev][value='+k+']');if(c)c.checked=true;pick(EV[k].d);sum();
  $('#reserve').scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(function(){$('#sel').scrollIntoView({behavior:'smooth',block:'start'})},650)})});
/* Xシェア */
var TW='GALLERY DOT 10周年『AFTER IMAGE』10/10–10/26 #AFTERIMAGE';
document.querySelectorAll('.xshare').forEach(function(a){a.href='https://twitter.com/intent/tweet?text='+encodeURIComponent(a.id==='okshare'?'予約しました！ '+TW:TW)+'&url='+encodeURIComponent(location.href)});
sum();
/* 送信 */
function er(id,m){$(id).textContent=m;return !m}
$('#f').addEventListener('submit',function(e){e.preventDefault();var ok=true;
ok&=er('#e-date',ch('d')?'':'来場日を選んでください');
ok&=er('#e-slot',ch('t')||$('#slotset').hidden?'':'時間帯を選んでください');
ok&=er('#e-nm',$('#nm').value.trim()?'':'氏名を入力してください');
ok&=er('#e-em',/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test($('#em').value)?'':'メールアドレスを正しく入力してください');
ok&=er('#e-ag',$('#agree').checked?'':'同意にチェックしてください');
if(!ok){var f=document.querySelector('.err:not(:empty)');if(f)f.scrollIntoView({block:'center',behavior:'smooth'});return}
/* 本番：ここで予約APIへ送信（メール重複チェック・予約番号・QR発行） */
$('#no').textContent='GD-'+Math.random().toString(36).slice(2,8).toUpperCase();
$('#okd').innerHTML='来場日：'+$('#s-d').textContent+'　'+$('#s-t').textContent+'<br>人数：'+$('#s-n').textContent+'<br>イベント：'+$('#s-e').textContent+'<br>料金：'+$('#s-p').textContent;
$('#f').style.display='none';$('#ok').style.display='block';$('#ok').focus();$('#ok').scrollIntoView({behavior:'smooth',block:'center'})});
})();

(function(){
var $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');$$('.rh',e.target).forEach(function(x){x.classList.add('in')});io.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -5% 0px'});
/* 出現アニメーション */
$$('.sec h2,.sec .sub,.info .it,.cds .cd,.xb,.steps,.ev,.rule li,.friend,.rt,.addr,.ba,.map,.btn.k,.rsv .lead,.rsv .chips,form fieldset,details,.mug h2,footer .sns,footer .cp,#a-h,.sub').forEach(function(el){
  if(el.closest('.art')||el.closest('.concept'))return;
  var sib=$$(':scope > '+el.tagName.toLowerCase(),el.parentNode),i=Math.max(0,sib.indexOf(el));
  el.style.setProperty('--d',Math.min(i,5)*.09+'s');el.classList.add('rv');io.observe(el)});
$$('.concept h2,.concept p').forEach(function(el){el.classList.add('rh')});$$('.concept').forEach(function(c){io.observe(c)});
/* 画像：視差用のラッパー */
var pimgs=[];
$$('.art figure,.wide,.cupf').forEach(function(f){var im=f.querySelector('img');if(!im)return;
  var w=document.createElement('div');w.className='pxw';im.parentNode.insertBefore(w,im);w.appendChild(im);
  if(!f.classList.contains('art')&&!f.closest('.art')){io.observe(w)}
  pimgs.push(im)});
/* アーティスト */
var map={'折原 柚衣':['fx-o',2],'NORI':['fx-n',0],'佐伯 凛':['fx-s',0],'Hanna K.':['fx-h',3],'境 直斗':['fx-k',0]};
$$('.art').forEach(function(a){var nm=a.querySelector('.nm'),t=nm.textContent.trim(),m=map[t];if(!m)return;
  a.classList.add(m[0]);
  nm.setAttribute('aria-label',t);
  var w=a.querySelector('.pxw'),im=w.querySelector('img');
  for(var k=1;k<=m[1];k++){var g=im.cloneNode();g.className='gh gh'+k;g.alt='';g.setAttribute('aria-hidden','true');w.appendChild(g);pimgs.push(g)}
  io.observe(a)});
/* スクロール連動：進捗バーと視差 */
var pg=document.getElementById('pgb'),tk=false;
function sc(){tk=false;var h=document.documentElement.scrollHeight-innerHeight;pg.style.setProperty('--p',h>0?Math.min(1,scrollY/h):0);
  pimgs.forEach(function(im){var r=im.parentNode.getBoundingClientRect();if(r.bottom<-100||r.top>innerHeight+100)return;
    var c=r.top+r.height/2-innerHeight/2,y=Math.max(-24,Math.min(24,-c*.06));im.style.setProperty('--py',y+'px')})}
addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(sc)}},{passive:true});sc();
})();
