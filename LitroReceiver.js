/**
 * Litro Keyboard Interface
 * Since 2014-09-25 08:01:52
 * @author しふたろう
 * ver 0.01.00
 */

var PaformTime = 0; //時間計測
var litroReceiverInstance = null;
var VIEWMULTI = 4;
var DISPLAY_WIDTH = 80;
var DISPLAY_HEIGHT = 80;
// var CHIPCELL_SIZE = 16;
var CHIPCELL_SIZE = 8;
// var layerScroll = null;
var COLOR_STEP = [184, 248, 216, 255];
var COLOR_TIME = [248, 216, 120, 255];

// var COLOR_NOTEFACE = [184, 248, 184, 255];
// var COLOR_NOTEPRINT = [0, 168, 0, 255];
// var COLOR_PARAMKEY = [188, 188, 188, 255];
// var COLOR_DISABLE = [120, 120, 120, 255];
// var COLOR_LINE = [88, 216, 84, 255];
// var COLOR_ARRAY = [[248, 120, 88, 255], [252, 168, 68, 255], [248, 184, 0, 255], [88, 216, 84, 255], [60, 188, 252, 255], [152, 120, 248, 255], [248, 120, 248, 255], [248, 88, 152, 255], ];

var COLOR_DISP_B = [184, 248, 184, 255];

var COLOR_CHBRIGHT = [
	{a: [248, 120, 88, 255], d: [240, 208, 176, 255], s: [248, 56, 0, 255], r: [168, 16, 0, 255]}
	, {a: [252, 160, 68, 255], d: [252, 224, 168, 255], s: [228, 92, 16, 255], r: [136, 20, 0, 255]}
	, {a: [248, 184, 0, 255], d: [248, 216, 120, 255], s: [172, 124, 172, 255], r: [80, 48, 0, 255]}
	, {a: [184, 248, 24, 255], d: [216, 248, 120, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
	, {a: [184, 248, 24, 255], d: [216, 248, 120, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
	, {a: [184, 248, 24, 255], d: [216, 248, 120, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
	, {a: [184, 248, 24, 255], d: [216, 248, 120, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
	, {a: [184, 248, 24, 255], d: [216, 248, 120, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
];

var COLOR_VOLUMES = [
	{b:[0, 0, 252, 255], r:[168, 0, 32, 255]}
	, {b:[0, 120, 248, 255], r:[228, 0, 88, 255]}
	, {b:[60, 188, 252, 255], r:[248, 88, 152, 255]}
	, {b:[164, 228, 252, 255], r:[248, 164, 192, 255]}
];

var USER_ID = 0;

function LitroReceiver() {
	
	this.frameChunks = []; //背景フレーム用ChunkRepeat
	this.frameSprites = {}; //背景フレーム用spriteChunk
	this.frameChunksKeys = {}; //framechunksのkeyインデックス重複はArray
	
	this.sprites = {};
	this.channelSprites = [];
	this.volumeSprites = [];
	
	this.blinkDrawParams = []; //点滅スプライト保持
	this.blinkDrawEventset = []; //点滅スプライト保持
	this.catchEventset = {}; // tune{param0:x param1:x}
	
	this.tapStartPos = {x: 0, y :0};
	this.tapMovePos = {x: 0, y: 0};
	
	this.titleSlideString = '';
	this.titleSlideSpace = '　　　　　　　';
	this.titleSlideRate = 0.05;
	this.titleSlideCount = 0;

	this.debugCell = false;
	this.debugCellPos = {x: 0, y :0};
	
	
	this.VOLUME_INC = 0.01;
	this.VOLUME_MAX = 0.80;
	this.VOLUME_MIN = 0.0;

	this.menuDispCmargin = {x: 24, y: 17};
	this.snsCmargin = {x:34, y:17};

	this.finalConf = ["NO", "OK"];
	this.loginParams = {user_id: 0, sns_type: null, user_name: null};
	if(window.location.href.indexOf('localhost') >= 0){
		this.loginURLs = {'TWITTER' : 'http://localhost:58104/oauth/twitter/'};
	}else{
		this.loginURLs = {'TWITTER' : 'http://bitchunk.fam.cx/litrosound/oauth/twitter/'};
	}
	this.shareURLs = {'TWITTER': 'https://twitter.com/intent/tweet?'};
	
	
	this.arrowHosts = ['bitchunk.fam.cx', 'litrosound.bitchunk.com', 'localhost'];
	this.snsIconId = {twitter : 0, 'google+': 1};
	this.packedFiles = [];
	
	this.word8 = null;
	this.word4 = null;
	
	// this.playSound = false;
	this.bg2x = {t: 0, b: 0};
	
	this.manualDir = './img/manual/';
	this.manualImage = [];
	this.manualChapters = [];
	this.manualMenuList = ['NEXT, BACK, CLOSE'];
	this.manualCursor = {x: 0, y:0};
	this.manualPage = 0;
	this.manualScrollParams = {dir: null, count: 0, dulation: 24, bg1: {x: 0, y: 0}, bg2: {x: 0, y: 0}, changeMode: null, openTime:Date.now()};
	
	this.tappableItems = [];
	this.tapStartItems = [];
	this.flickableItems = [];

	this.viewMode =null;
	
	this.uiImageName = 'ui_8p';
	this.snsImageName = 'sns';
		
	return;
}

LitroReceiver.prototype = {
	init : function() {
		var self = this;
		litroReceiverInstance = this;
		this.keyControll = new KeyControll('cont1');
		

		// this.player = litroPlayerInstance;
		this.initSound();
		
		//基本キー
		this.initKeys();

		this.loadImages(function(){
			self.imageLoaded = true;
			self.initSprite();
			self.initFrameSprites();
			
			self.drawFrameParts(0);
			// self.drawFrameParts(1);
			// self.openFrame();
			self.initTappables();
			self.initOpenTappables();
			self.initFlickables();
			requestAnimationFrame(main);

		});
		// this.initFingerState(this.fingers);
		this.initCanvas();
		this.initWords();
		this.initViewMode();
		// this.setBg2Position(this.noteScrollPos.x);
		this.initCatchEvent();
		this.initEventFunc();
		this.initManual();
		this.autoLogin();
		this.initControllDisp();
		
	},
	
	//TouchEventによる初期化パート
	initSound: function()
	{
		this.litroSound = new LitroSound();
		
		//効果音用
		this.sePlayer = new LitroPlayer();
		
		this.player = new LitroPlayer();
		//

		this.litroSound.init(CHANNELS);
		this.player.init("system", this.litroSound);
		this.sePlayer.init("se", this.litroSound);
		
	},
	
	initKeys: function(){
		var code, row, chars, i
		, whiteCount = 0
		, blackCount = 0
		, codeNameCount = 0
		, repkeys_ff = this.KEY_REPLACE_FIREFOX;
		
		this.keyControll.initDefaultKey('right');
		
		
		//キーボード設定
		
		//オクターブ設定

	},
	
	initViewMode: function(){
		var href = window.location.href
			, sound_id = href.match(/[?|&]+sound_id\=([0-9]+)/)
			, step = href.match(/[?|&]+step\=([0-9]+)/)
			, multi = href.match(/[?|&]+screen\=([0-9]+)/)
			, buff = href.match(/[?|&]+buff\=([0-9a-zA-Z]+)/)
			, debug = href.match(/[?|&]+debug\=([0-9]+)/)
			, self = this
			, scr = document.getElementById('screen')
			, mfunc = function(e){
					var pos = self.getTouchPos(e);
					self.debugCellPos.x = (pos.x / cellhto(1)) | 0;
					self.debugCellPos.y = (pos.y / cellhto(1)) | 0;
					// e.preventDefault();
					// e.stopPropagation();
				}
			;
			
		if(buff != null){
			PROCESS_BUFFER_SIZE = parseInt(buff[1], 10) == null ? 4096 : buff[1];
			if(this.litroSound.context != null){
				this.litroSound.connectOff();
				this.litroSound.createContext(PROCESS_BUFFER_SIZE);;
			}
			this.analysedData = new Uint8Array(PROCESS_BUFFER_SIZE * this.analyseRate);
			this.analysedData_b = new Uint8Array(PROCESS_BUFFER_SIZE * this.analyseRate);
		}
		if(step != null){
			this.noteRangeScale = (step[1] | 0) * this.noteRangeCells;
		}
		if(multi != null){
			if(multi[1] == 0){
				this.hiddenScreen = true;
				multi[1] = 1;
			}
			VIEWMULTI = multi[1] | 0;
			// console.log(VIEWMULTI);
		}
		if(sound_id != null){
			this.viewMode = 'full';
			this.editMode = 'play';
			this.player.loadFromServer(this.loginParams.user_id, sound_id[1], 
			function(data){
				var player = self.player, s = self.titleSlideSpace;
					if(data == null || data === false){
						self.setError(data != null ? data : {error_code: 0, message: 'error'});
						return;
					}
					player.setPlayData(data);
					self.titleSlideString = s + player.title + s + player.fileUserName + s;
					return;
				},
				function(data){
					self.setError(data != null ? data : {error_code: 0, message: 'error'});
				});
		}
		if(debug != null){
			this.debugCell = true;
			scr.addEventListener('mousemove', mfunc, false);
			scr.addEventListener('touchmove', mfunc, false);
			
		}
		return;
	},
	
	initManual: function(){
		var key, i, c = 0 , page, names = {
			top : [
			'manual_top'
			]
			, base_disp : [
			'basedisplay_label'
			, 'eventboard_label'
			, 'scoreboard_label'
			, 'leftroll_label'
			, 'rightroll_label'
			, 'tuneparams_label'
			, 'wavemenu_label'
			, 'keyboard_label'
			]
		, mode_keys : [
			'mode_top'
			, 'keys_000'
			, 'keys_001'
			, 'keys_002'
			, 'keys_003'
			, 'keys_004'
			, 'keys_005'
			, 'keys_006'
			, 'keys_007'
			, 'keys_008'
			, 'keys_009'
			, 'keys_010'
			, 'keys_011'
		] 
		, tune_params : [
			'tune_top'
			, 'tune_000'
			, 'tune_001'
			, 'tune_002'
			, 'tune_003'
			, 'tune_004'
			, 'tune_005'
		]}
		;
		for(key in names)
		{
			this.manualChapters.push({name: key, index: c});
			for(i = 0; i < names[key].length; i++){
				this.manualImage.push({name: names[key][i], chapter: key});
				c++;
			}
		}

	},

	initEventFunc: function()
	{
		var self = this;
		this.litroSound.setSetChannelEvent(function(ch, key, value){
				// self.setChannelSprite(ch, key);
		});
		this.litroSound.setOnNoteKeyEvent(function(ch, key){
			self.setChannelSprite(ch, key);
		});
		this.player.setRestartEvent(function(){
		});
	},
	
	initWords: function()
	{
		var word
			, scr = scrollByName('bg1')
		;//, WordPrint = wordPrint;
		word = new WordPrint();
		word.init();
		word.setFontSize('8px');
		word.rowSpace = 0;
		word.setLineCols(6);
		word.setMaxRows(1);
		word.setScroll(scr);
		this.word8 = word;
		word = new WordPrint();
		word.init();
		word.setFontSize('4v6px');
		word.rowSpace = 0;
		word.setLineCols(6);
		word.setMaxRows(1);
		word.setMarkAlign('vertical');
		this.word4 = word;
	},
	
	initCanvas: function()
	{
		makeScroll('screen', true);
		makeScroll('view', false);
		makeScroll('bg1', false);
		makeScroll('bg2', false);
		makeScroll('sprite', false);
		makeScroll('tmp', false);
		
		var bg1 = scrollByName('bg1')
			, bg2 = scrollByName('bg2')
			, spr = scrollByName('sprite')
			, view = scrollByName('view')
			, scr = scrollByName('screen')
			;
		scr.clear(COLOR_BLACK);
		view.clear(COLOR_BLACK);
		bg1.clear(COLOR_BLACK);
		bg2.clear();
		spr.clear();
	},
	
	// initFingerState: function(num)
	// {
		// var i;
		// this.status_on = [];
		// for(i = 0; i < num; i++){
			// this.status_on.push(null);
		// }
	// },
	
	initSprite: function()
	{
		var i, self = this
			, x = 2, y = 2
			, image = this.uiImageName
			, mk = function(name, id, imageName){
				imageName = imageName == null ? image : imageName;
				// console.log(name, id, imageName);
				self.sprites[name] = makeSprite(imageName, id);
			}
			, chmk = function(ch){
				var base = 176;
				return makeSprite(image, base + ch);
			}
			, vmk = function(v){
				var base = 192;
				return makeSprite(image, base + v);
			}
		;
		
		// this.word.setFontSize('8px');
		mk('cellCursorSprite', 88, this.word8.imageName);
		
		mk('pwLamp1', 34);
		mk('pwLamp2', 152);
		mk('pwLamp3', 136);
		
		mk('black', 42);
		mk('volKnob1', 200);
		mk('volKnob2', 201);
		
		for(i = 0; i < CHANNELS; i++){
			this.channelSprites[i] = {sprite: chmk(i), timer: 0, x: cellhto((i % 4) + x), y: cellhto(((i / 4) | 0) + y), color: COLOR_CHBRIGHT[i].s};
		}
		
		for(i = 0; i < 8; i++){
			this.volumeSprites[i] = vmk(i);
		}

	},
	
	initFrameSprites: function()
	{
		var img = this.uiImageName, self = this 
			, msc = function(rect){return makeSpriteChunk(img, makeRect(rect));}
			, msq = function(query){return makeSpriteQuery(img, query);}
			, msm = function(spmap){return makeSpriteChunk(img, spmap);}
			, mcc = function(name, rr, flip){
				var keys = self.frameChunksKeys, chunk, sprite = self.frameSprites[name];
				keys[name] = keys[name] == null ? []: keys[name];
				keys[name].push(self.frameChunks.length);
				flip = flip == null ? {v:false, h:false} : flip;
				self.frameChunks.push(self.makeChipChunk(name, sprite, makeRect(rr), flip));
			}
			, fspr = this.frameSprites
			, ms = function(id){return makeSprite(img, id);}
		;
		
		this.frameSprites = {
			closeFrame: msq('1-1:0-3 2-2:0-3*6 1-1:0-3|fh'),
			closeShine: msq('0-1:5-7 82 83*2 0 84 85'),
			zenmai1: msq('106 107'),
			zenmai2: msq('108 109'),
			
			power_off: msq('9+1:6+2 9+1:6+2|fh'),
			
			
			openFrame: msq(
				'8-8:0-3 (9;42^3)*6 8-8:0-3|fh'
				+ '!;10 26 58*4 26 10|fh'
				+ '!;(9-9:1-3!;8|fv) (42^3!;9|fv)*6 (9-9:1-3!;8|fv)|fh'
				),
			openShaft: msq('10+1:7+3 (0*6)^3 10+1:7+3|fh'),
			openShine: msq('(128;144;128;0)^2 (0^8)*6 ((128;144;128;0)|fh)^2'),
			power_on_top: msq('137 137|fh'),
			power_on_bottom: msq('153 153|fh'),
			
			mainFlickArea: msq('0 208*4 0'),
			mainButtons: msq('2+6:13+2'),
			playButton: msq('6+2:13+2'),
			stopButton: msq('8+2:13+2'),
			returnButton: msq('4+2:13+2'),
			
			
			// power_close_top: msc([9, 8, 1, 1]),
			// power_close_bottom: msc([9, 9, 1, 1]),
			// shineTopClose: msm([[80, 81, 82, 83, 83, 0, 84, 85]]),
			// shineBottomClose: msm([[96, 97], [112, 113]]),
			
			// sideOpenFrameTop: msm([[8], [24], [40], [24], [25]]),
			// sideOpenFrameBottom: msm([56], [72], [40], [24], [25]]),
 			
			// rightOpenFrame: msc([2, 1, 1, 4]),
			// leftDispEdge: msc([9, 2, 2, 1]),
			
			//, [0, 0, 1, 1]),
			
			//Not openframe
			noteStart: ms(5),

		};
		
		//閉じ
		// mcc('sideCloseFrame', [1, 6, 1, 1]);
		// mcc('centerCloseFrame', [2, 6, 6, 1]);
		// mcc('sideCloseFrame', [8, 6, 1, 1], {h: true, v:false});
		// mcc('zenmai_1', [8, 8, 1, 1]);
		// mcc('zenmai_2', [0, 0, 1, 1]);
		// mcc('shineTopClose', [1, 6, 1, 1]);
		// mcc('shineBottomClose', [1, 7, 1, 1]);
		
		mcc('power_open', [4, 7, 1, 1]);
		mcc('power_open', [5, 7, 1, 1], {h: true, v: false});
		
		
		//開き
		
	
		// mcc('baseKeyDisp', [18, 12, 1, 1]),
		
		// this.frameChunksKeys = {};
	},
	
	initControllDisp: function()
	{
		var wordPos = {}
			, make = function(n, l, p){wordPos[n] = {line: l, pos: p};}
			;
		make('Tab', 0, 0); make('C', 0, 4);
		make('+', 1, 0); make('-', 1, 1); make('コ', 1, 4);
		make(',', 2, 0); make('.', 2, 1);
		make('Shift', 3, 0); make('Space', 4, 0);
		this.controllDispNameStr = 'Tab C$n+-  コ$n,.   $nShift$nSpace';
		this.controllDispWordPos = wordPos;
	},
	
	initOpenTappables: function()
	{
		var c = cellhto
			, bg = scrollByName('bg1')
			, self = this, fs = this.frameSprites
			, scr = document.getElementById('screen')
		;
		this.clearTappableItem();
		this.appendTappableItem(makeRect(c(4), c(7), c(2), c(2)), function(){
			self.litroSound.connectOff();
			self.litroSound.connectOn();
			self.drawFrameParts(1);

			self.clearTappableItem();
			self.initPlayTappables();
			self.initTapReturn();
			self.initPlayFlickables();
			return false;
		}, 'play');
	},	
	
	initPlayTappables: function()
	{
		var c = cellhto
			, bg = scrollByName('bg1')
			, self = this, fs = this.frameSprites
			, rect = makeRect(c(6), c(7), c(2), c(2))
			, pos = {x: c(6), y: c(7)}
			, cw = COLOR_DISP_B , cb = COLOR_BLACK
		;
		this.appendTappableItem(rect, function(){
			if(self.player.isPlay()){
				self.player.stop();
				bg.drawSpriteChunk(fs.playButton, pos.x, pos.y);
			}else{
				self.player.play();
				bg.drawSpriteChunk(fs.stopButton, pos.x, pos.y);
			}
			return false;
		}, 'play');
		this.appendTapStartItem(rect, function(){
			if(self.player.isPlay()){
				fs.playButton = setSwapColorSprite(fs.playButton, cw, cb, true);
				fs.playButton = setSwapColorSprite(fs.playButton, cb, cw);
				bg.drawSpriteChunk(fs.playButton, pos.x, pos.y);
				fs.playButton = setSwapColorSprite(fs.playButton);
			}else{
				fs.stopButton = setSwapColorSprite(fs.stopButton, cb, cw, true);
				fs.stopButton = setSwapColorSprite(fs.stopButton, cw, cb);
				bg.drawSpriteChunk(fs.stopButton, pos.x, pos.y);
				fs.stopButton = setSwapColorSprite(fs.stopButton);
			}
			return false;
		}, 'play');
	},
	
	initTapReturn: function()
	{
		var c = cellhto
			, bg = scrollByName('bg1')
			, self = this, fs = this.frameSprites
			, scr = document.getElementById('screen')
			, rect = makeRect(c(4), c(7), c(2), c(2))
			, pos = {x: c(4), y: c(7)}
			, cw = COLOR_DISP_B , cb = COLOR_BLACK
		;
		this.appendTappableItem(makeRect(c(4), c(7), c(2), c(2)), function(){
			self.player.seekMoveBack(-1);
			setSwapColorSprite(fs.returnButton);
			bg.drawSpriteChunk(fs.returnButton, pos.x, pos.y);
			return false;
		}, 'play');
		this.appendTapStartItem(rect, function(){
			setSwapColorSprite(fs.returnButton, cw, cb, true);
			setSwapColorSprite(fs.returnButton, cb, cw);
			bg.drawSpriteChunk(fs.returnButton, pos.x, pos.y);
			setSwapColorSprite(fs.returnButton);
			return false;
		}, 'play');	},
	
	initTappables: function()
	{
		var self = this
			, tsfunc = function(e){
				var pos = self.getTouchPos(e);
				self.touchStartEvent(pos.x, pos.y);
				e.preventDefault();
				return false;
			}
			, tefunc = function(e){
				var pos = self.getTouchPos(e);
				self.touchEndEvent(pos.x, pos.y);
				e.preventDefault();
				return false;
			}
			, scr = document.getElementById('screen')
		;

		scr.addEventListener('mousedown', tsfunc, false);
		scr.addEventListener('mouseup', tefunc, false);
		scr.addEventListener('touchstart', tsfunc, false);
		scr.addEventListener('touchend', tefunc, false);
	},
	
	initPlayFlickables: function()
	{
		var c = cellhto
			, view = scrollByName('view')
			, bg = scrollByName('bg1')
			, self = this
			, fs = this.frameSprites
			, scr = document.getElementById('screen')
			;
		this.clearFlickableItem();
		this.appendFlickableItem(makeRect(c(2), c(6), c(6), c(1)), function(item, x, y){
			self.flickVolume(x, y);
			self.drawVolumeSprite();
		}, 'volume');
	},
	initFlickables: function()
	{
		var self = this
			, mvfunc =  function(e){
				var pos = self.getTouchPos(e);
				self.touchMoveEvent(pos.x, pos.y);
				e.preventDefault();
				return false;
			}
			, scr = document.getElementById('screen')
			;
		
		scr.addEventListener('mousemove', mvfunc, false);
		scr.addEventListener('touchmove', mvfunc, false);
	},

	
	//リピートchipchunk(Array, Array)
	makeChipChunk: function(name, sprite, repeatRect, flip)
	{
		return {name: name, sprite: sprite, rect: repeatRect, flip: flip};
	},
	
	initCatchEvent: function(defaultset)
	{
		var i, type;
		if(defaultset == null){
			for(i = 0; i < AudioChannel.sortParam.length; i++){
				type = AudioChannel.sortParam[i];
				this.catchEventset[type] = {};
			}
		}else{
			this.catchEventset = defaultset;
		}
		// console.log("init", this.catchEventset);
	},
	initSelect: function()
	{
		this.selectNote = {time: -1, ch: -1, type:'note'};
		this.selectNoteHistory = [];
		this.selectNoteHistory.push({time: -1, ch: -1, type:'note'});
	},
	selectEventset: function(ch, eventset, pop)
	{
		if(this.selectNote.time >= 0 && !pop){
			this.selectNoteHistory.push({time: this.selectNote.time, ch: this.selectNote.ch, type:this.selectNote.type});
		}
		this.selectNote = {time: eventset.time, ch: ch, type:eventset.type};
	},
		
	loadImages: function(onloadFunc)
	{
		// this.loader.init();
		var resorce = loadImages([
			 [this.uiImageName, 8, 8],
			 [this.snsImageName, 16, 16],
			 ['font4v6p', 4, 6],
			 ['font8p', 8, 8]],
			 onloadFunc 
		);

	},
	
	isBlackKey: function(name){
		if(this.BLACK_KEY[name] == null){
			return false;
		}else{
			return true;
		}
	},
	
	isPackedFile: function(file){
		return this.packedFiles.some(function(pack, i){
				return pack.sound_id == file.sound_id;
		});
	},

	seekDispSide: function(pos){
		var ppos = this.seekPosition()
			, center = DISPLAY_WIDTH / 2
		;
		pos = pos == null ? ppos : pos;
		if(center < pos){
			return 'right';
		}
			return 'left';
	},
	
	seekStep: function()
	{
		return (this.noteRangeScale / this.noteRangeCells) | 0;
	},
	
	seekCenterPosition: function()
	{
		return this.seekPosition(this.noteRangeScale * this.noteRange / 2);
	},
	
	getTouchPos: function(e)
	{
		var me = e.changedTouches != null ? e.changedTouches[0] : e
			, view = scrollByName('view')
			, scr = document.getElementById('screen')
			, bounds = scr.getBoundingClientRect(), w = view.canvas.width, h = view.canvas.height
			, x = ((((me.clientX - bounds.left) / VIEWMULTI) | 0) - view.x + w) % w
			, y = ((((me.clientY - bounds.top) / VIEWMULTI) | 0) - view.y + h) % h
		;
		return {x: x, y: y};
	},

	getKeysDefine: function(){
		return this.CONTROLL_CHARS;
	},
	
	getLastCommand: function(a)
	{
		a = a == null ? 0 : a;
		return this.commandPath[this.commandPath.length - 1 - a] == null ? '' : this.commandPath[this.commandPath.length - 1 - a];
	},
	getShareMenuList: function()
	{
		return this.shareMenuList;
	},
	
	getManualMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.manualMenuList;
		}
		return null;
	},
	
	getLoginParams: function()
	{
		return this.loginParams.user_id == 0 ? null : this.loginParams;
	},
	
	setError: function(errorObj, mode, comClear)
	{
		var self = this;
		comClear = comClear == null ? true : comClear;

		this.changeEditMode('error', comClear);
		this.drawMenu();
		window.setTimeout(function(){
			self.changeEditMode(mode == null ? 'note' : mode, comClear);
			self.drawMenu();
		}, 1200);
	},
	
	logoutSNS: function()
	{
		var self = this;
		this.changeEditMode('loading');
		self.drawMenu();
		
		sendToAPIServer('POST', 'logout', {}, function(data){
			if(data.error != null){
				self.setError(data.error_code);
				return;
			}
			self.loginParams = {user_id: 0, sns_type: null, user_name: null};
			self.changeEditMode('file');
			self.drawMenu();
		}, function(){
			self.setError('server error');
		});
		
	},
	
	autoLogin: function()
	{
		var self = this;
		sendToAPIServer('POST', 'login', {session: 1}, function(data){
			if(data == null){return;}
			if(data.error_code != null){
				console.error(data.error_code + ": " + data.message);
				self.changeEditMode('error');
				return;
			}
			// self.drawMenu();
			self.loginParams = {user_id: data.user_id, sns_type: data.sns_type, account: data.account};
			self.player.playerAccount = data.account;
			
		}, function(data){
			if(data == null){return;}
			if(data.error_code != null){
				console.error(data.error_code + ": " + data.message);
			}
			self.changeEditMode('error');
			self.drawMenu();
		});
		
	},
	
	loginSNS: function()
	{
		var self = this;
		//SNSログイン完了
		window.addEventListener('message', function(event){
			if(event.data.match(/\{\S*\}/) == null){return;} //twitterのトラップ
			if(event.data == null || event.data == 'null'){self.setError('server error'); window.removeEventListener('message'); return;}
			var data, hostMatch = event.origin.match(/https?\:\/\/([^\s:\/]*):?/);
			if(hostMatch == null || self.arrowHosts.indexOf(hostMatch[1]) < 0){self.setError('server error'); window.removeEventListener('message'); return;}
			data = JSON.parse(event.data);
			if(data.error_code != null){
				self.setError(data.message);
				return;
			}
			
			self.loginParams = {user_id: data.user_id, sns_type: data.sns_type, account: data.account};
			self.player.playerAccount = data.account;
			self.baseKeyOnFile('<');
			window.removeEventListener('message');
		}, false);
	},
	
	getTuneParam: function()
	{
		return this.litroSound.channel[this.paramCursor.x].tune([this.paramCursor.y]);
	},
	
	playLitro: function()
	{
		if(this.player == null){
			return;
		}
		if(!this.player.isPlay()){
			return;
		}
		// this.updateForwardSeek();
	},
	
	clearEventItem: function(items, name)
	{
		var rep = [], i;
		if(name == null){
			return [];
		}
		for(i = 0; i < items.length; i++){
			if(items[i].name){
				continue;
			}
			rep.push(items[i]);
		}
		items = [];
		items = rep;
		return items;
	},
	
	appendTapStartItem: function(rect, func, name)
	{
		this.tapStartItems.push({rect: rect, func: func, name: (name == null ? this.tappableItems.lengh : name)});
		return this.tapStartItems.length;
	},
	
	clearTapStartItem: function(name){
		this.tapStartItems = this.clearEventItem(this.tapStartItems, name);
		return this.tapStartItems.length;
	},	
	
	appendTappableItem: function(rect, func, name)
	{
		this.tappableItems.push({rect: rect, func: func, name: (name == null ? this.tappableItems.lengh : name)});
		return this.tappableItems.length;
	},
	
	clearTappableItem: function(name){
		this.tappableItems = this.clearEventItem(this.tappableItems, name);
		return this.tappableItems.length;
	},
	
	appendFlickableItem: function(rect, func, name)
	{
		this.flickableItems.push({rect: rect, func: func, name: (name == null ? this.tappableItems.lengh : name)});
		return this.flickableItems.length;
	},	
	
	clearFlickableItem: function(name){
		this.flickableItems = this.clearEventItem(this.flickableItems, name);
		return this.flickableItems.length;
	},	
	
	fileInListAtIndex: function(index)
	{
		var id, c = 0, list = this.player.fileList();
		for(id in list){
			if(c++ == index){return list[id];}
		}
		return null;
	},
	
	manualChapterName: function(next)
	{
		var index, i, chapter = this.manualImage[this.manualPage].chapter
		;
		
		for(i = 0; i < this.manualChapters.length; i++){
			if(this.manualChapters[i].name == chapter){
				index = this.manualChapters[i].index;
				if(next <  0){
					index = this.manualPage + next < index ? i + next : i;
				}else{
					index = i + next;
				}
				return this.manualChapters[index] == null ? '' : this.manualChapters[index].name;
			}
		}
		return '';
	},
	
	updateScrollPage: function(scrollPos)
	{
		var page
		;
		scrollPos = scrollPos == null ? this.noteScrollPos.x : scrollPos;
		page = (scrollPos / DISPLAY_WIDTH) | 0;
		if(this.noteScrollPage != page){
			this.noteScrollPage = page;
			return true;
		}else{
			return false;
		}
	},
	
	seekTime: function(seekPos)
	{
		seekPos = seekPos == null ? this.noteScrollPos.x : seekPos;
		return seekPos * (this.noteRangeScale * this.noteRange / DISPLAY_WIDTH);
	},
	
	flickVolume: function(x, y)
	{
		var pos = this.tapMovePos
			, vol = this.player.volume() + ((x - pos.x) * this.VOLUME_INC)
		;
		// console.log(x);
		
		vol = vol < this.VOLUME_MIN ? this.VOLUME_MIN : vol;
		vol = vol > this.VOLUME_MAX ? this.VOLUME_MAX : vol;

		this.player.volume(vol);
	},
	
	touchStartEvent: function(x, y)
	{
		var i, item, pos;
		this.tapStartPos.x = x;
		this.tapStartPos.y = y;
		this.tapMovePos.x = x;
		this.tapMovePos.y = y;
		pos = this.tapStartPos;
		for(i = 0; i < this.tapStartItems.length; i++){
			item = this.tapStartItems[i];
			if(item.rect.isContain(x, y) && item.rect.isContain(pos.x, pos.y)){
				if(item.func(item) == false){
					break;
				};
			}
		}
		
	},
	
	touchEndEvent: function(x, y)
	{
		var i, item, pos = this.tapStartPos;
		for(i = 0; i < this.tappableItems.length; i++){
			item = this.tappableItems[i];
			if(item.rect.isContain(x, y) && item.rect.isContain(pos.x, pos.y)){
				if(item.func(item) == false){
					break;
				};
			}
		}
		this.tapStartPos.x = -1;
		this.tapStartPos.y = -1;
		this.tapMovePos.x = x;
		this.tapMovePos.y = y;
	},
	
	touchMoveEvent: function(x, y)
	{
		var i, item, mpos = this.tapMovePos, tpos = this.tapStartPos;
		for(i = 0; i < this.flickableItems.length; i++){
			item = this.flickableItems[i];
			if(item.rect.isContain(x, y) && item.rect.isContain(tpos.x, tpos.y)){
				if(item.func(item, x, y) == false){
					break;
				};
			}
		}
		
		this.tapMovePos.x = x;
		this.tapMovePos.y = y;
		
	},
	
	
	openFrame: function()
	{
		scrollByName('bg1').clear(COLOR_BLACK, makeRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT / 2));
		this.frameChunks.forEach(function(chunk){
			var rect = chunk.rect;
			// console.log(rect.x, rect.y, rect.w, rect.h);
			chunk.sprite = flipSprite(chunk.sprite, chunk.flip.h, chunk.flip.v);
			this.drawFrameLine(chunk.sprite, rect.x, rect.y, rect.w, rect.h);
		}, this);
		
	},
	
	drawFrameParts: function(num)
	{
		var f = this.frameSprites
			, spr = this.sprites
			, scr = scrollByName('bg1')
			, cto = cellhto
			, drawc = function(s, x, y){scr.drawSpriteChunk(s, x, y);}
			, draws = function(s, x, y){scr.drawSprite(s, x, y);}
		;
		scr.clear(COLOR_BLACK, makeRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT));
		switch(num){
			case 0: 
			drawc(f.closeFrame, cto(1), cto(6));
			drawc(f.closeShine, cto(1), cto(6));
			drawc(f.zenmai1, cto(8), cto(8));
			drawc(f.power_off, cto(4), cto(7));
			draws(spr.pwLamp3, cto(2), cto(8));
			break;
			case 1:
			drawc(f.openFrame, cto(1), cto(1));
			drawc(f.openShaft, cto(1), cto(4));
			drawc(f.openShine, cto(1), cto(2));
			drawc(f.power_on_top, cto(4), cto(1));
			drawc(f.power_on_bottom, cto(4), cto(9));
			drawc(f.mainFlickArea, cto(2), cto(6));
			drawc(f.mainButtons, cto(2), cto(7));
			
			this.drawVolumeSprite();
			break;
			
			
		}
	},

	setChannelSprite: function(ch, key)
	{
		var spr = this.channelSprites[ch]
			, env = this.litroSound.getEnvelopes(ch, true)
		;
		// spr.timer = env.attack + env.decay + env.length + env.release;
		spr.timer = env.attack + env.decay + env.length;
	},
	
	drawTitle: function()
	{
		var bg = scrollByName('bg1')
			, sub = this.titleSlideString
			, slen = 6
			, rightSublen = 0
			, leftSublen = 0
			, titlePos = ((this.titleSlideCount * this.titleSlideRate) % (sub.length - slen)) | 0
			, x = cellhto(2), y = cellhto(4)
		;
		if(!this.player.isPlay()){
			return;
		}
		
		this.word8.print(sub.substr(titlePos, slen), x, y, COLOR_BLACK, COLOR_WHITE);
		
		++this.titleSlideCount;
	},
	
	drawVolumeSprite: function()
	{
		var spr
			, bg = scrollByName('bg1')
			, bright, phase, rot, cycle
			, vol = this.player != null ? this.player.volume() : 0
			, len = this.volumeSprites.length
			, xk = cellhto(6), xv = cellhto(7), y = cellhto(3)
			, cl = COLOR_VOLUMES
		;
		cycle = (vol / this.VOLUME_INC) | 0;
		rot = ((cycle / 2) | 0) % 4;
		spr = (cycle + 1) % 2 ? this.sprites.volKnob1 : this.sprites.volKnob2;
		spr.rot(rot);
		bg.drawSprite(spr, rot == 2 || rot == 3 ? xk - 1 : xk, rot == 1 || rot == 2 ? y + 1 : y);
		
		bg.drawSprite(this.sprites.black, xv, y);
		spr = this.volumeSprites[((vol / (this.VOLUME_MAX / len)) | 0) % 8];
		spr.resetSwapColor();
		if(vol > this.VOLUME_MIN && vol < this.VOLUME_MAX){
			bg.drawSprite(spr, xv, y);
		}else if(vol >= this.VOLUME_MAX){
			spr = this.volumeSprites[len - 1];
			spr.pushSwapColor(cl[0].r, cl[0].b);
			spr.pushSwapColor(cl[1].r, cl[1].b);
			spr.pushSwapColor(cl[2].r, cl[2].b);
			spr.pushSwapColor(cl[3].r, cl[3].b);
			bg.drawSprite(spr, xv, y);
		}

		
		// this.VOLUME_INC;
		// this.VOLUME_MAX;
		// this.VOLUME_MIN;
	},
	
	drawChannelSprites: function()
	{
		var spr
			, bg = scrollByName('sprite')
			, bright, phase
			, enables = this.litroSound != null ? this.litroSound.enableChannels() : null
		;
		if(enables == null){return;}
		for(i = 0; i < this.channelSprites.length; i++){
			if(!enables[i]){continue;}
			// console.log(this.litroSound.channel[i].envelopeClock);
			phase = this.litroSound.getPhase(i);
			// console.log(phase);
			if(phase == '' || phase == 0){continue;}
			spr = this.channelSprites[i];
			spr.sprite.setSwapColor(COLOR_CHBRIGHT[i][phase], spr.color);
			bg.drawSprite(spr.sprite, spr.x, spr.y);
		}
		
	},
	
	drawDebugCell: function()
	{
		var spr = scrollByName('sprite')
			, cx = this.debugCellPos.x, cy = this.debugCellPos.y
			, x = cellhto(cx - (cx < 1 ? 0 : 1))
			, y = cellhto(cy - (cy < 2 ? -2 : 2))
			, str = (cx < 10 ? 'x:0' : 'x:') + cx + '$n'
			 + (cy < 10 ? 'y:0' : 'y:') + cy + ''
			;
		if(!this.debugCell || this.word4 == null){
			return;
		}
		this.word4.setScroll(spr);
		this.word4.print(str, x, y);
		
		spr.drawSprite(this.sprites.cellCursorSprite, cellhto(cx), cellhto(cy));
	},
	
	clearLeftScreen: function()
	{
		var scr = scrollByName('bg1')
			, cm = this.leftScreenCmargin
			, size = this.leftScreenSize
		;
		scr.clear(COLOR_BLACK, makeRect(cellhto(cm.x), cellhto(cm.y), cellhto(size.w), cellhto(size.h)));
	},
	
	blinkDraw: function()
	{
		var scrpos, i, sparam, scr = scrollByName('sprite');
		this.catchNoteBlinkCycle++;
		this.blinkDrawParams.forEach(function(sparam, i){
			sparam = this.blinkDrawParams[i];
			if(this.catchNoteBlinkCycle % 8 == i % 8){return;}
			if(sparam.noref && this.catchNoteBlinkCycle % 2 == i % 2){return;}
			scr.drawSpriteChunk(sparam.sprite, sparam.x, sparam.y);
		}, this);
		scrpos = (this.noteScrollPos.x % DISPLAY_WIDTH);
		scrpos = 0;
		this.blinkDrawEventset.forEach(function(sparam, i){
			if(this.catchNoteBlinkCycle % 8 == i % 8){return;}
			if(sparam.noref && this.catchNoteBlinkCycle % 2 == i % 2){return;}
			this.drawNoteRaster(sparam.ch, sparam.type, sparam.x - scrpos, sparam.y, sparam.rot, sparam.bottom, sparam.catchMode, sparam.time);
		}, this);
	},
	
	scrollManual: function()
	{
		var params = this.manualScrollParams
			, d = params.dulation
			, c = params.count
			;
		params.bg1.x = 0;
		params.bg2.x = 0;
		params.bg1.y = 0;
		params.bg2.y = 0;
		if(params.dir == 'up'){
			params.bg1.y = -c * (DISPLAY_HEIGHT / d);
			params.bg2.y = -c * (DISPLAY_HEIGHT / d) + DISPLAY_HEIGHT;
		}else if(params.dir == 'down'){
			params.bg1.y = c * (DISPLAY_HEIGHT / d);
			params.bg2.y = c * (DISPLAY_HEIGHT / d) - DISPLAY_HEIGHT;
		}else if(params.dir == 'right'){
			params.bg1.x = -c * (DISPLAY_WIDTH / d);
			params.bg2.x = -c * (DISPLAY_WIDTH / d) + DISPLAY_WIDTH;
		}else if(params.dir == 'left'){
			params.bg1.x = c * (DISPLAY_WIDTH / d);
			params.bg2.x = (c * (DISPLAY_WIDTH / d)) - DISPLAY_WIDTH;
		}
		if(params.dir != null && params.count++ >= d){
			if(params.dir == 'left'){
				this.changeEditMode(params.changeMode);
				params.changeMode = null;
				this.openFrame();
			}else{
				scrollByName('bg2').drawto(scrollByName('bg1'));
			}
			params.count = 0;
			params.dir = null;
		}
		// console.log(params.pos.x);
	},
	
	repeatDraw: function()
	{
		//channel note file play
		switch(this.playMode){
			default: break;
		}
		this.drawDebugCell();
		this.drawChannelSprites();
		this.drawTitle();
		// console.time('rep');
		// console.timeEnd('rep');

	},
	drawOnBaseKey: function(code, status){
		if(this.getMode() == 'manual'){return;}

		var fchip = this.frameChunks[this.frameChunksKeys.baseKeyDisp[0]]
			, baseCm = {x: fchip.rect.x, y: fchip.rect.y}
			, wm = {x: cellhto((baseCm.x * 2) + 1) + 2, y:cellhto((baseCm.y * 2) + 1)}
			, name = (code != null) ? this.baseKeysDrawName[code] : '', select
			, word = this.word
			;
		word.setFontSize('4v6px');
		word.setMarkAlign('horizon');
		word.setMaxRows(5);
		word.setScroll(scrollByName('bg1'));
		if(name != '' ){
			select = this.controllDispWordPos[name];
			word.print(name, wm.x + (select.pos * word.chipSize), wm.y + (select.line * word.vChipSize), status ? COLOR_WHITE : COLOR_PARAMKEY, COLOR_BLACK);
		}else{
			word.print(this.controllDispNameStr, wm.x, wm.y, status ? COLOR_WHITE : COLOR_PARAMKEY, COLOR_BLACK);
		}
	},
	
	openSNSTab: function(itemFunc)
	{
		var crect = {x:cellhto(0), y:cellhto(23), w: cellhto(40), h: cellhto(15)}
			, r = makeRect(crect.x, crect.y, crect.w, crect.h)
			, bg = scrollByName('bg1')
			, view = scrollByName('view')
			, spr = makeSprite(this.snsImageName, 0)
			, self = this, word = this.word
			, iconCrect = {x: 18, y: 26, w:2, h: 2} //this.snsIconCmargin
		;
		view.y = cellhto(7);
		bg.clear(COLOR_BLACK, r);
		bg.drawSprite(spr, cellhto(iconCrect.x), cellhto(iconCrect.y));
		word.setScroll(bg);
		word.setFontSize('8px');
		word.setLineCols(0);
		word.setMarkAlign('horizon');
		word.print('Click SNS Icon for Login', crect.x + cellhto(1), crect.y + cellhto(1), COLOR_WHITE, COLOR_BLACK);
		this.appendTappableItem(makeRect(cellhto(iconCrect.x), cellhto(iconCrect.y), cellhto(iconCrect.w), cellhto(iconCrect.h)), itemFunc, 'TWITTER');
		
		window.document.getElementById('screen').onclick = function(e){
			var bounds = this.getBoundingClientRect(), w = view.canvas.width, h = view.canvas.height
				, x = ((((e.clientX - bounds.left) / VIEWMULTI) | 0) - view.x + w) % w
				, y = ((((e.clientY - bounds.top) / VIEWMULTI) | 0) - view.y + h) % h
			;
			self.touchStartEvent(x, y);
		};
	},
	
	closeSNSTab: function()
	{
		var view = scrollByName('view')
		;
		view.y = 0;
		this.openFrame();
		this.clearTappableItem();
		window.document.getElementById('screen').onclick = null;
	},
	
	openLoginWindow: function(type)
	{
		window.open(this.loginURLs[type], null,"width=640,height=480,scrollbars=yes");

	},
	
	openShareWindow: function(type, file)
	{
		var url = this.shareURLs[type];
		if(type == 'TWITTER'){
			url += [
				'url=' + encodeURIComponent('http://' + location.host + location.pathname 
				+ (file.sound_id == 0 ? '' : '?sound_id=' + file.sound_id)),
				'text=' + encodeURIComponent(file.sound_id == 0 ? 'ブラウザでPSG音源DTM！' : ('"'+ file.title + '" play on the litrokeyboard!!')),
				'hashtags=' + encodeURIComponent('litrokeyboard,dtm'),
				// 'via=' + 'LitroKeyboard'
				].join('&');
			}
		window.open(url, null,"width=640,height=480,scrollbars=yes");
		this.closeSNSTab();
		this.changeEditMode('file');
		// this.clearMenu();
		this.drawMenu();
		this.drawFileMenu();
		this.drawFileMenuCursor();
		this.clearLeftScreen();
	},

	closeManual: function()
	{
		var i, params = this.manualScrollParams
			// // , ltrc = litroReceiverInstance
			, spr = scrollByName('sprite')
			, bg1 = scrollByName('bg1')
			, bg2 = scrollByName('bg2')
			, view = scrollByName('view')
			, scr = scrollByName('screen')
		;
		params.count = 0;
		bg2.drawto(view);
		this.openFrame();
		this.drawMenu(params.changeMode);
		bg1.drawto(bg2);
		view.drawto(bg1);

		// this.manualPage = 0;
		params.dir = 'left';
	},
	
	openManual: function(page)
	{
		var self = this, pre, prePage = this.manualPage
			, img, i
			, params = this.manualScrollParams
		;
		page = page == null ? this.manualPage : page;
		if(page === ''){page = this.manualImage.length - 1;}
		if(typeof page == 'string'){
			for(i = 0; i < this.manualChapters.length; i++){
				if(this.manualChapters[i].name == page){
					page = this.manualChapters[i].index;
					break;
				}
			}
		}
		
		if(this.manualImage.length <= page){return;}
		img = this.manualImage[page];
		if(self.editMode != 'manual'){
			setImageLoadRefreshTime(Date.now());
		}

		// this.keyControll.allReset();
		this.manualPage = page;
		this.loadManualImage(img.name, function(){
			params.count = 0;
			scrollByName('view').drawto(scrollByName('bg1'));
			scrollByName('bg2').clear(COLOR_BLACK);
			var sprite = makeSprite(img.name, 0);
			scrollByName('bg2').drawSprite(sprite, ((DISPLAY_WIDTH - sprite.w) * 0.5) | 0, ((DISPLAY_HEIGHT - sprite.h) * 0.5) | 0);
			if(page == prePage || self.editMode != 'manual'){
				params.dir = 'right';
			}else if(page < prePage){
				params.dir = 'down';
			}else if(page > prePage){
				params.dir = 'up';
			}
			if(self.editMode != 'manual'){
				params.changeMode = self.editMode;
				self.changeEditMode('manual');
			}
		});
	},
	
	loadManualImage: function(name, func)
	{
		func = func == null ? function(){return;} : func;
		var pre;
		setLoadImageDir(this.manualDir);
		pre = preLoadImage(name, null, null, func);
		setLoadImageDir(pre);
	}
	
};

function printDebug(val, row){
		// if(litroReceiverInstance == null){return;}
		if(!imageResource.isload()){return;}
		var scr = scrollByName('sprite'), ltrc = litroReceiverInstance
			, word = ltrc.word
			, mc = {x: 0, y: 29};
		;
		if(row == null){
			row = 0;
		}
		if(word == null){
			return;
		}
		word.setFontSize('4v6px');
		word.setMarkAlign('horizon');
		word.setScroll(scr);
		word.setColor(COLOR_WHITE, COLOR_BLACK);
		word.print(val, cellhto(mc.x), cellhto(mc.y - row));
};

function drawLitroScreen()
{
	var i
	, ltrc = litroReceiverInstance
	, spr = scrollByName('sprite')
	, bg1 = scrollByName('bg1')
	, bg2 = scrollByName('bg2')
	, view = scrollByName('view')
	, scr = scrollByName('screen')
	, spmax = ltrc.debugCell == null ? null : 3200
	;
	// printDebug(ltrc.litroSound.channel[0].isRefreshClock(), 1);
	if(ltrc.hiddenScreen){
		return;
	}
	if(ltrc.imageLoaded === false){
		return;
	}
	// ltrc.drawNoteTest();
	// bg1.ctx.putImageData(imageResource.ctx.ui_8p.getImageData(0, 0, 128, 128), 0, 0);
	drawCanvasStacks(spmax);
	ltrc.repeatDraw();
	// bg2.drawSpriteChunk(makeSpriteQuery(ltrc.uiImageName, 'a'), 0,0 );
	// if(ltrc.editMode != 'manual'){
		// bg2.rasterto(view, 0, 0, null, DISPLAY_HEIGHT / 2, ltrc.bg2x.t + cellhto(ltrc.noteScrollCmargin.x), 0);
		// bg2.rasterto(view, 0, DISPLAY_HEIGHT / 2, null, DISPLAY_HEIGHT / 2, ltrc.bg2x.b + cellhto(ltrc.noteScrollCmargin.x), 0);
		// bg1.drawto(view);
	// }else{
		bg2.rasterto(view, 0, 0, null, null, ltrc.manualScrollParams.bg2.x, ltrc.manualScrollParams.bg2.y);
		bg1.rasterto(view, 0, 0, null, null, ltrc.manualScrollParams.bg1.x, ltrc.manualScrollParams.bg1.y);
	// }

	// printDebug(Math.round(litroSoundInstance.context.currentTime), 0);
	// printDebug(testval);
	spr.drawto(view);
	spr.clear();
	// view.drawto(view);
	
	screenView(scr, view, VIEWMULTI);
	// console.log(scr.canvas.width);
	return;

}

//call at 60fps
function litroReceiverMain()
{
	var i
	, ltrc = litroReceiverInstance
	;
	// ltrc.test();
	// console.time("key");
	// console.timeEnd("key");
	ltrc.playLitro();
	drawLitroScreen();
};

function main() {
	try{
		litroSoundMain();
		litroReceiverMain();
		keyStateCheck();
	}
	catch(e){
		console.error(e);
		return;
	}
	requestAnimationFrame(main);
};

// window.onbeforeunload = function(event){
	// // event = event || window.event;
	// return event.returnValue = 'LitroKeyboardを中断します';
// };

window.addEventListener('load', function() {
	var ltrc = new LitroReceiver()
	;
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	ltrc.init();
	// requestAnimationFrame(main);
	removeEventListener('load', this, false);
	
}, false);


