/**
 * Litro Receiver Interface
 * Since 2014-09-25 08:01:52
 * @author しふたろう
 * ver 0.02.01
 */
var LITRORECEIVER_VERSION = '0.02.01';
var LITRORECEIVER_NAME = 'LitroReceiver';

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
	{a: [248, 120, 88, 255], h: [240, 208, 176, 255], d: [248, 120, 88, 255], s: [248, 56, 0, 255], r: [168, 16, 0, 255]}
	, {a: [252, 160, 68, 255], h: [252, 224, 168, 255], d: [252, 160, 68, 255], s: [228, 92, 16, 255], r: [136, 20, 0, 255]}
	, {a: [248, 184, 0, 255], h: [248, 216, 120, 255], d: [248, 184, 0, 255], s: [172, 124, 172, 255], r: [80, 48, 0, 255]}
	, {a: [184, 248, 24, 255], h: [216, 248, 120, 255], d: [184, 248, 24, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
	, {a: [184, 248, 24, 255], h: [216, 248, 120, 255], d: [184, 248, 24, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
	, {a: [184, 248, 24, 255], h: [216, 248, 120, 255], d: [184, 248, 24, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
	, {a: [184, 248, 24, 255], h: [216, 248, 120, 255], d: [184, 248, 24, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
	, {a: [184, 248, 24, 255], h: [216, 248, 120, 255], d: [184, 248, 24, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
];

var COLOR_VOLUMES = [
	{b:[0, 0, 252, 255], r:[168, 0, 32, 255]}
	, {b:[0, 120, 248, 255], r:[228, 0, 88, 255]}
	, {b:[60, 188, 252, 255], r:[248, 88, 152, 255]}
	, {b:[164, 228, 252, 255], r:[248, 164, 192, 255]}
];

var USER_ID = 0;

function LitroReceiver() {
	var mr = function(x, y, w, h){
		var c = cellhto;
		return makeRect(c(x), c(y), c(w), c(h))
	};
	
	this.frameChunks = []; //背景フレーム用ChunkRepeat
	this.frameSprites = {}; //背景フレーム用spriteChunk
	this.frameChunksKeys = {}; //framechunksのkeyインデックス重複はArray
	this.frameOpenBgPos = {x:0, y:0} //背景フレーム用位置調整
	this.isAnimTransition = {};
	this.countAnimTransition = {};
	this.callBackAnimTransition = {};
	this.functionAnimTransition = {}
	this.prevDrawFramePartsNum = -1;
	
	this.isOpen = false;
	
	this.sprites = {};
	this.channelSprites = [];
	this.volumeSprites = [];
	
	this.blinkDrawParams = []; //点滅スプライト保持
	this.blinkDrawEventset = []; //点滅スプライト保持
	this.catchEventset = {}; // tune{param0:x param1:x}
	
	this.tapStartPos = {x: 0, y :0};
	this.tapMovePos = {x: 0, y: 0};
	
	this.titleSlideString = '';
	this.titleSlideSpace = '　　　　　　';
	this.titleSlideRate = 0.05;
	this.titleSlideCount = 0;
	this.titleCmargin = {x: 2, y: 4};
	this.titleCellWidth = 6;
	this.titleCellHeight = 1;

	this.debugCell = false;
	this.debugCellPos = {x: 0, y :0};
	this.debugPage = 0;
	
	
	this.VOLUME_INC = VOLUME_CELLSIZE
	this.VOLUME_MAX = this.VOLUME_INC * 80;
	this.VOLUME_MIN = 0.0;
	this.durativeVolume = 0; //イベントによる重複描画防止


	this.menuDispCmargin = {x: 24, y: 17};
	this.snsCmargin = {x:34, y:17};
	
	this.rects = {
		play: mr(6, 7, 2, 2)
		, 'return': mr(4, 7, 2, 2)
		, share: mr(2, 7, 2, 2)
		, volume: mr(2, 6, 6, 1)
		, open: mr(4, 7, 2, 2)
		, close: mr(4, 1, 2, 1)
		, 'screen': mr(0, 0, 10, 10)
	};

	this.finalConf = ["NO", "OK"];
	this.loginParams = {user_id: 0, sns_type: null, user_name: null};
	if(window.location.href.indexOf('localhost') >= 0){
		this.loginURLs = {'TWITTER' : '//localhost:58104/oauth/twitter/'};
	}else{
		this.loginURLs = {'TWITTER' : 'http://bitchunk.fam.cx/litrosound/oauth/twitter/'};
	}
	this.shareURLs = {'TWITTER': 'https://twitter.com/intent/tweet?'};
	
	
	this.allowHosts = ['bitchunk.fam.cx', 'litrosound.bitchunk.com', 'localhost'];
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
			self.touchEndEvent();
			
			self.drawFrameParts(1);
			self.initTappables();
			self.initFlickables();

			self.initOpenTappables();
			// self.initOpenFlickables();

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

		this.litroSound.init(CHANNELS_NUM);

		// this.sePlayer.init("se");
		this.player.init("system");
		
		// this.durativeVolume = this.player.volume();
		
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
			, match ={
				 sound_id: href.match(/[?|&]+sound_id\=([0-9]+)/)
				, step: href.match(/[?|&]+step\=([0-9]+)/)
				, multi: href.match(/[?|&]+screen\=([0-9]+)/)
				, buff: href.match(/[?|&]+buff\=([0-9a-zA-Z]+)/)
				, debug: href.match(/[?|&]+debug\=([0-9]+)/)
			}
			, self = this
			, scr = document.getElementById('screen')
			, mfunc = function(e){
					var pos = self.getTouchPos(e);
					self.debugCellPos.x = (pos.x / cellhto(1)) | 0;
					self.debugCellPos.y = (pos.y / cellhto(1)) | 0;
					e.preventDefault();
					// e.stopPropagation();
				}
			, debugPartsFunc = function(e){
				self.debugPage = (self.debugPage + 1) % 7;
				self.drawFrameParts(self.debugPage);
			}
			;
			
		if(match.buff != null){
			PROCESS_BUFFER_SIZE = parseInt(match.buff[1], 10) == null ? 4096 : match.buff[1];
			if(this.litroSound.context != null){
				this.litroSound.connectOff();
				this.litroSound.createContext(PROCESS_BUFFER_SIZE);;
			}
			this.analysedData = new Uint8Array(PROCESS_BUFFER_SIZE * this.analyseRate);
			this.analysedData_b = new Uint8Array(PROCESS_BUFFER_SIZE * this.analyseRate);
		}
		if(match.step != null){
			this.noteRangeScale = (match.step[1] | 0) * this.noteRangeCells;
		}
		if(match.multi != null){
			if(match.multi[1] == 0){
				this.hiddenScreen = true;
				match.multi[1] = 1;
			}
			VIEWMULTI = match.multi[1] | 0;
			// console.log(VIEWMULTI);
		}
		if(match.sound_id != null){
			this.viewMode = 'full';
			this.editMode = 'play';
			this.player.loadFromServer(this.loginParams.user_id, match.sound_id[1], 
			function(data){
				var player = self.player, s = self.titleSlideSpace;
					if(data == null || data === false){
						self.setError(data != null ? data : {error_code: 0, message: 'error'});
						return;
					}
					player.setPlayData(data);
					// self.titleSlideString = s + player.title + s + player.fileUserName + s;
					return;
				},
				function(data){
					self.setError(data != null ? data : {error_code: 0, message: 'error'});
				});
		}
		if(match.debug != null){
			this.debugCell = true;
			// document.getElementById('display').addEventListener('drag', mfunc, false);
			// scr.addEventListener('drag', mfunc, false);
			scr.addEventListener('mousemove', mfunc, false);
			scr.addEventListener('touchmove', mfunc, false);
			switch(match.debug[1] | 0){
				case 2:
				scr.addEventListener('mouseup', debugPartsFunc, false);
				scr.addEventListener('touchend', debugPartsFunc, false);
				break;
			}
			scr.ondrag = function(){
				alert(11);
			};
			
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
		this.player.setSetChannelEvent(function(ch, key, value){
				// self.setChannelSprite(ch, key);
		});
		this.player.setOnNoteKeyEvent(function(ch, key){
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
		word.setMaxRows(2);
		word.setMarkAlign('holizon');
		this.word4 = word;
	},
	
	initCanvas: function()
	{
		makeScroll('screen', true);
		makeScroll('view', false);
		makeScroll('bg1', false);
		makeScroll('bg2', false);
		makeScroll('sprite', false);
		// makeScroll('tmp', false);
		
		var bg1 = scrollByName('bg1')
			, bg2 = scrollByName('bg2')
			, spr = scrollByName('sprite')
			, view = scrollByName('view')
			, scr = scrollByName('screen')
			;
		scr.clear(COLOR_BLACK);
		view.clear(COLOR_BLACK);
		bg1.clear(COLOR_BLACK);
		bg2.clear(COLOR_BLACK);
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
		
		mk('pwLamp1', 72);
		mk('pwLamp2', 88);
		mk('pwLamp3', 104);
		mk('pwLamp3', 120);
		
		mk('black', 16);
		mk('volKnob1', 200);
		mk('volKnob2', 201);
		
		for(i = 0; i < CHANNELS_NUM; i++){
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
			closeFrame_1: msq('1+1:0+4 2+1:0+4*6 1+1:0+4|fh'),
			closeFrame_2: msq('3+1:0+4 4+1:0+4*6 3+1:0+4|fh'),
			closeFrame_3: msq('5+1:0+4 6+1:0+4*6 5+1:0+4|fh'),
			closeShine_1: msq('0+8:4+1;0+2:7+2'),
			closeShine_2: msq('0+8:5+1;2+2:7+2'),
			closeShine_3: msq('0+8:6+1;4+2:7+2'),
			zenmai_1: msq('121'),
			zenmai_2: msq('122'),
			zenmai_con_1: msq('136'),
			zenmai_con_2: msq('137'),
			zenmai_con_3: msq('138'),
			zenmai_con_4: msq('139'),
			
			power_off_1: msq('0+1:9+2 0+1:9+2|fh'),
			power_off_2: msq('2+1:9+2 2+1:9+2|fh'),
			power_off_3: msq('3+1:9+2 3+1:9+2|fh'),
			
			power_on: msq('1+1:9+2 1+1:9+2|fh'),

			
			litoni_close_1: msq('13+3:4+3'),
			litoni_close_b: msq('13+3:7+3'),
			litoni_close_2: msq('13+3:10+3'),
			litoni_close_3: msq('13+3:13+3'),
			
			litoni_hand_1: msq('10+3:13+1'),
			litoni_hand_2: msq('10+3:14+1'),
			litoni_hand_3: msq('10+3:15+1'),

			litoni_wing_1: msq('11+1:10+1 0 0 12+1:10+1'),
			litoni_wing_2: msq('11+1:11+1 0 0 12+1:11+1'),
			litoni_wing_3: msq('11+1:12+1 0 0 12+1:12+1'),

			openFrame_1: msq(
				'(8;8+1:1+2) (9;123^2)*6 8+1:0+3|fh'
				+ '!;14 15 56*4 15 14|fh'
				+ '!;(9+1:1+2!;8|fv) (123^2!;9|fv)*6 (9+1:1+2!;8|fv)|fh'
				),
				
			openFrame_2: msq(
				'(10;10+1:1+3) (11;63;123^2)*6 (10;10+1:1+3)|fh'
				+ '!;30 31 57*4 31 30|fh'
				+ '!;(11+1:1+3!;10|fv) (123^3!;11|fv)*6 (11+1:1+3!;10|fv)|fh'
				),
				
			openFrame_3: msq(
				'(12;12+1:1+3) (13;123^3)*6 (12;12+1:1+3)|fh'
				+ '!;46 47 62*4 47 46|fh'
				+ '!;(13+1:1+3!;12|fv) (123^3!;13|fv)*6 (13+1:1+3!;12|fv)|fh'
				),
				
			openShaft_1: msq('(73;89;105) (0*6)^3 (73;89;105)|fh'),
			openShaft_2: msq('(74;90;106) (0*6)^3 (74;90;106)|fh'),
			openShaft_3: msq('(75;91;107) (0*6)^3 (75;91;107)|fh'),
			
			power_on_top_1: msq('148 148|fh'),
			power_on_top_2: msq('149 149|fh'),
			power_on_top_3: msq('150 150|fh'),
			
			power_on_bottom_1: msq('164 164|fh'),
			power_on_bottom_2: msq('165 165|fh'),
			power_on_bottom_3: msq('166 166|fh'),
			
				// openFrame: msq(
				// '8-8:0-3 (9;42^3)*6 8-8:0-3|fh'
				// + '!;10 26 58*4 26 10|fh'
				// + '!;(9-9:1-3!;8|fv) (42^3!;9|fv)*6 (9-9:1-3!;8|fv)|fh'
				// ),
			// openShaft: msq('10+1:7+3 (0*6)^3 10+1:7+3|fh'),
			// openShine: msq('(128;144;128;0)^2 (0^8)*6 ((128;144;128;0)|fh)^2'),

			power_on_top: msq('137 137|fh'),
			power_on_bottom: msq('153 153|fh'),
			
			mainFlickArea: msq('0 208*4 0'),
			menuButtons: msq('2+6:13+2'),
			
			shareButton: msq('2+2:13+2'),
			playButton: msq('6+2:13+2'),
			stopButton: msq('8+2:13+2'),
			returnButton: msq('4+2:13+2'),
			
			noteStart: ms(5),

		};
		
		mcc('power_open', [4, 7, 1, 1]);
		mcc('power_open', [5, 7, 1, 1], {h: true, v: false});
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
			, rect = this.rects.open
		;
		this.clearTappableItem();
		this.appendTappableItem(rect, function(){
			self.litroSound.connectOff();
			self.litroSound.connectOn();

			self.startAnimation('f_open', function(cnt, k)
				{
					var c = cnt
					, aFrame = {	0: 1, 4: 2, 8: 3, 12: 4, 16: 6, 20: 5, 24: 6, 32: 7} 
					if(aFrame[c] == null){return false;}
					self.drawFrameParts(aFrame[c]);
			
					if(c >= 28){
						return true;
					}
					return false;
				}, 
				function(){
					self.drawVolumeSprite();
					self.isOpen = true;
					self.initCloseTappables();
					self.initPlayTappables();
					self.initTapShare();
					self.initTapReturn();
					self.initPlayFlickables();
				}
			);

			self.clearTappableItem();
			self.clearTapStartItem();
			self.clearFlickableItem();
			
			return false;
		}, null, 'open');
		
		this.appendTapStartItem(rect, function(){
			self.drawFrameParts(0);
			
		}, null, 'open');
		this.appendFlickableItem(rect, null, function(){
			self.drawFrameParts(1);
		}, 'open');

	},
	
	initCloseTappables: function()
	{
		var c = cellhto
			, bg2 = scrollByName('bg2')
			, bg1 = scrollByName('bg1')
			, self = this, fs = this.frameSprites
			rect = this.rects.close
		;
		// this.clearTappableItem();
		this.appendTappableItem(rect, function(){
			self.player.stop();
			self.player.finishChannelEnvelope();
			self.litroSound.connectOff();
			self.clearTappableItem();
			self.clearTapStartItem();
			self.clearFlickableItem();
			// self.clearTapEndItem();
			// self.drawFrameParts(0);
			bg2.clear();
			self.isOpen = false;
			// bg2.clear();
			
			self.startAnimation('f_close', function(cnt, k)
				{
					var c = cnt
					, aFrame = {	0: 6, 4: 5, 8: 4, 12: 3, 16: 1} 
					if(aFrame[c] == null){return false;}
					self.drawFrameParts(aFrame[c]);
			
					if(c >= 16){
						return true;
					}
					return false;
				}, 
				function(){
					// self.initOpenFlickables();
					self.initOpenTappables();
				}
			);
			return false;
		},null,  'play');
	},	
	
	initPlayTappables: function()
	{
		var c = cellhto
			, bg = scrollByName('bg1')
			, self = this, fs = this.frameSprites
			, pos = {x: this.rects.play.x, y: this.rects.play.y}
			, cw = COLOR_DISP_B , cb = COLOR_BLACK
		;
		this.appendTappableItem(this.rects.play, function(){
			if(self.player.isPlay()){
				self.player.stop();
			}else{
				self.player.play();
				fs.stopButton = setSwapColorSprite(fs.stopButton);
				self.setTitle(self.player.title, self.player.fileUserName);
				bg.drawSpriteChunk(fs.stopButton, pos.x, pos.y);
				self.player.setOnStopFunc(function(){
					self.stopPlayer();
				});
			}
			return false;
		}, null, 'play');
		this.appendTapStartItem(this.rects.play, function(){
			if(self.player.isPlay()){
				self.drawFrameParts(-1);
				fs.stopButton = setSwapColorSprite(fs.stopButton, cb, cw, true);
				fs.stopButton = setSwapColorSprite(fs.stopButton, cw, cb);
				bg.drawSpriteChunk(fs.stopButton, pos.x, pos.y);
			}else{
				self.drawFrameParts(-1);
				fs.playButton = setSwapColorSprite(fs.playButton, cw, cb, true);
				fs.playButton = setSwapColorSprite(fs.playButton, cb, cw);
				bg.drawSpriteChunk(fs.playButton, pos.x, pos.y);
			}
			return false;
		}, null, 'play');
		this.appendFlickableItem(this.rects.play, null, function(){
			self.drawFrameParts(7);
		}, 'play');
	},
	
	initTapReturn: function()
	{
		var c = cellhto
			, bg = scrollByName('bg1')
			, self = this, fs = this.frameSprites
			, rect = this.rects['return']
			, cw = COLOR_DISP_B , cb = COLOR_BLACK
		;
		this.appendTappableItem(rect, function(){
			self.titleSlideCount = 0;
			self.drawFrameParts(-1);
			self.player.seekMoveBack(-1);
			setSwapColorSprite(fs.returnButton);
			bg.drawSpriteChunk(fs.returnButton, rect.x, rect.y);
			return false;
		}, null, 'return');
		this.appendTapStartItem(rect, function(){
			self.drawFrameParts(-1);
			setSwapColorSprite(fs.returnButton, cw, cb, true);
			setSwapColorSprite(fs.returnButton, cb, cw);
			bg.drawSpriteChunk(fs.returnButton, rect.x, rect.y);
			return false;
		}, null, 'return');
		this.appendFlickableItem(rect, null, function(){
			self.drawFrameParts(7);
		}, 'return');
	},
	
	initTapShare: function()
	{
		var c = cellhto
			, bg = scrollByName('bg1')
			, self = this, fs = this.frameSprites
			, rect = this.rects.share
			, cw = COLOR_DISP_B , cb = COLOR_BLACK
		;
		this.appendTappableItem(rect, function(){
			self.drawFrameParts(-1);
			self.openShareWindow('TWITTER', self.player);
			setSwapColorSprite(fs.shareButton);
			bg.drawSpriteChunk(fs.shareButton, rect.x, rect.y);
			return false;
		}, null, 'share');
		this.appendTapStartItem(rect, function(){
			self.drawFrameParts(-1);
			setSwapColorSprite(fs.shareButton, cw, cb, true);
			setSwapColorSprite(fs.shareButton, cb, cw);
			bg.drawSpriteChunk(fs.shareButton, rect.x, rect.y);
			return false;
		}, null, 'share');
		this.appendFlickableItem(rect, null, function(){
			self.drawFrameParts(7);
		}, 'share');
	},
	
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
			, apf = function(r, x, y){self.appendFlickableItem(r, x, y);}
			;
		// this.clearFlickableItem();
		apf(this.rects.volume, function(item, x, y){
			self.flickVolume(x, y);
		}, null, 'volume');

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
		// scr.addEventListener('drag', mvfunc, false);
		scr.addEventListener('touchmove', mvfunc, false);
	},

	
	//リピートchipchunk(Array, Array)
	makeChipChunk: function(name, sprite, repeatRect, flip)
	{
		return {name: name, sprite: sprite, rect: repeatRect, flip: flip};
	},
	
	//未使用
	initCatchEvent: function(defaultset)
	{
		var i, type;
		if(defaultset == null){
			for(i = 0; i < LitroWaveChannel.sortParam.length; i++){
				type = LitroWaveChannel.sortParam[i];
				this.catchEventset[type] = {};
			}
		}else{
			this.catchEventset = defaultset;
		}
		// console.log("init", this.catchEventset);
	},
	//未使用
	initSelect: function()
	{
		this.selectNote = {time: -1, ch: -1, type:'note'};
		this.selectNoteHistory = [];
		this.selectNoteHistory.push({time: -1, ch: -1, type:'note'});
	},
	
	stopPlayer: function()
	{
		var  bg = scrollByName('bg1')
			, fs = this.frameSprites
			, pos = {x: this.rects.play.x, y: this.rects.play.y}
			, cw = COLOR_DISP_B , cb = COLOR_BLACK
		;
		this.player.seekMoveBack(-1);
		fs.playButton = setSwapColorSprite(fs.playButton);
		bg.drawSpriteChunk(fs.playButton, pos.x, pos.y);
		
	},
	
	//未使用
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
	
	//未使用
	isBlackKey: function(name){
		if(this.BLACK_KEY[name] == null){
			return false;
		}else{
			return true;
		}
	},
	
	//未使用
	isPackedFile: function(file){
		return this.packedFiles.some(function(pack, i){
				return pack.sound_id == file.sound_id;
		});
	},

	//未使用
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
	
	//未使用
	seekStep: function()
	{
		return (this.noteRangeScale / this.noteRangeCells) | 0;
	},
	
	//未使用
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

	//未使用
	getKeysDefine: function(){
		return this.CONTROLL_CHARS;
	},
	
	//未使用
	getLastCommand: function(a)
	{
		a = a == null ? 0 : a;
		return this.commandPath[this.commandPath.length - 1 - a] == null ? '' : this.commandPath[this.commandPath.length - 1 - a];
	},
	
	//未使用
	getShareMenuList: function()
	{
		return this.shareMenuList;
	},
	
	//未使用
	getManualMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.manualMenuList;
		}
		return null;
	},
	
	//未使用
	getLoginParams: function()
	{
		return this.loginParams.user_id == 0 ? null : this.loginParams;
	},
	
	//未使用
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
	
	//未使用
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
	
	//未使用
	autoLogin: function()
	{
		var self = this;
		sendToAPIServer('POST', 'login', {session: 1}, function(data){
			if(data == null){return;}
			if(data.error_code != null){
				console.info(data.error_code + ": " + data.message);
				// self.changeEditMode('error');
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
			// self.changeEditMode('error');
			self.drawMenu();
		});
		
	},
	
	//未使用
	loginSNS: function()
	{
		var self = this;
		//SNSログイン完了
		window.addEventListener('message', function(event){
			if(event.data.match(/\{\S*\}/) == null){return;} //twitterのトラップ
			if(event.data == null || event.data == 'null'){self.setError('server error'); window.removeEventListener('message'); return;}
			var data, hostMatch = event.origin.match(/https?\:\/\/([^\s:\/]*):?/);
			if(hostMatch == null || self.allowHosts.indexOf(hostMatch[1]) < 0){self.setError('server error'); window.removeEventListener('message'); return;}
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
	
	makeTapEvent: function(rect, func, cancel, name){
		return {rect: rect, func: func, cancel: cancel == null ? null : cancel, name: name, pos:{x:-1, y:-1}};
	},
	
	appendTapStartItem: function(rect, func, cancel, name)
	{
		this.tapStartItems.push(this.makeTapEvent(rect,func, cancel == null ? null : cancel, name == null ? this.tapStartItems.lengh : name));
		return this.tapStartItems.length;
	},
	
	clearTapStartItem: function(name){
		this.tapStartItems = this.clearEventItem(this.tapStartItems, name);
		return this.tapStartItems.length;
	},	
	
	appendTappableItem: function(rect, func, cancel, name)
	{
		this.tappableItems.push(this.makeTapEvent(rect,func, cancel == null ? null : cancel, name == null ? this.tappableItems.lengh : name));
		return this.tappableItems.length;
	},
	
	clearTappableItem: function(name){
		this.tappableItems = this.clearEventItem(this.tappableItems, name);
		return this.tappableItems.length;
	},
	
	appendFlickableItem: function(rect, func, cancel, name)
	{
		this.flickableItems.push(this.makeTapEvent(rect,func, cancel == null ? null : cancel, name == null ? this.flickableItems.lengh : name));
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
		var i, item, mpos = this.tapMovePos, tpos = this.tapStartPos, isContain;
		for(i = 0; i < this.flickableItems.length; i++){
			item = this.flickableItems[i];
			isContain = item.rect.isContain(x, y);
			item.pos.x = x;
			item.pos.y = y;
			if(item.rect.isContain(tpos.x, tpos.y)){
				if(isContain){
					if(item.func != null && item.func(item, x, y) == false){
						break;
					};
				}else{
					if(item.cancel != null && item.cancel(item, x, y) == false){
						break;
					};
				}
			}
		}
		this.tapMovePos.x = x;
		this.tapMovePos.y = y;
		
	},
	
	//未使用
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
	
	drawFrameParts: function(num, force)
	{
		var f = this.frameSprites
			, spr = this.sprites
			, scr = scrollByName('bg1')
			, cto = cellhto
			, drawc = function(s, x, y){scr.drawSpriteChunk(s, x, y);}
			, draws = function(s, x, y){scr.drawSprite(s, x, y);}
			, pos = this.frameOpenBgPos
			, clf = function(){scr.clear(COLOR_BLACK, makeRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT));}
		;
		force = force == null ? false : force;
		if(!force && this.prevDrawFramePartsNum == num){
			return;
		}
		this.prevDrawFramePartsNum = num;
		switch(num){
			case 0: 
			clf();
			drawc(f.closeFrame_1, cto(1), cto(6));
			drawc(f.closeShine_1, cto(1), cto(6));
			drawc(f.zenmai_1, cto(9), cto(8));
			drawc(f.zenmai_con_1, cto(8), cto(8));
			drawc(f.power_on, cto(4), cto(7));
			drawc(f.litoni_wing_1, cto(3), cto(5) - 2);
			drawc(f.litoni_close_b, cto(3.5), cto(3) + 2);
			drawc(f.litoni_hand_1, cto(3.5), cto(6));
			draws(spr.pwLamp1, cto(2), cto(8) + 1);
			pos.x = 0;
			pos.y = 0;
			break;
			
			case 1: 
			clf();
			drawc(f.closeFrame_1, cto(1), cto(6));
			drawc(f.closeShine_1, cto(1), cto(6));
			drawc(f.zenmai_1, cto(9), cto(8));
			drawc(f.zenmai_con_1, cto(8), cto(8));
			drawc(f.power_off_1, cto(4), cto(7));
			drawc(f.litoni_wing_1, cto(3), cto(5) - 2);
			drawc(f.litoni_close_1, cto(3.5), cto(3) + 2);
			drawc(f.litoni_hand_1, cto(3.5), cto(6));
			draws(spr.pwLamp1, cto(2), cto(8) + 1);
			pos.x = 0;
			pos.y = 0;
			break;
			
			case 2: 
			clf();
			drawc(f.closeFrame_2, cto(1), cto(6));
			drawc(f.closeShine_2, cto(1), cto(6));
			drawc(f.zenmai_1, cto(9), cto(8));
			drawc(f.zenmai_con_2, cto(8), cto(8));
			drawc(f.power_off_2, cto(4), cto(7));
			drawc(f.litoni_wing_2, cto(3), cto(5) - 1);
			drawc(f.litoni_close_2, cto(3.5), cto(3) + 2);
			drawc(f.litoni_hand_2, cto(3.5), cto(6) - 1);
			draws(spr.pwLamp2, cto(2), cto(8) + 2);
			pos.x = 0;
			pos.y = -1;
			break;
			
			case 3: 
			clf();
			drawc(f.closeFrame_3, cto(1), cto(6));
			drawc(f.closeShine_3, cto(1), cto(6));
			drawc(f.zenmai_1, cto(9), cto(8));
			drawc(f.zenmai_con_3, cto(8), cto(8));
			drawc(f.power_off_3, cto(4), cto(7) + 1);
			drawc(f.litoni_wing_3, cto(3), cto(5) + 1);
			drawc(f.litoni_close_3, cto(3.5), cto(3) + 2);
			drawc(f.litoni_hand_3, cto(3.5), cto(6) - 2);
			draws(spr.pwLamp3, cto(2), cto(8) + 3);
			pos.x = 0;
			pos.y = -2;
			break;
			
			case 4: 
			clf();
			drawc(f.openFrame_1, cto(1), cto(3) );
			drawc(f.openShaft_1, cto(1), cto(5));
			drawc(f.power_on_top_1, cto(4), cto(3));
			drawc(f.power_on_bottom_1, cto(4), cto(9));
			drawc(f.zenmai_1, cto(9), cto(7.5));
			drawc(f.zenmai_con_4, cto(8), cto(7.5));
			pos.x = 0;
			pos.y = 1;
			break;
			
			case 5: 
			clf();
			drawc(f.openFrame_2, cto(1), cto(1) );
			drawc(f.openShaft_2, cto(1), cto(4));
			drawc(f.power_on_top_2, cto(4), cto(1));
			drawc(f.power_on_bottom_2, cto(4), cto(9));
			drawc(f.zenmai_1, cto(9), cto(7) + 1);
			drawc(f.zenmai_con_4, cto(8), cto(7) + 1);
			pos.x = 0;
			pos.y = 0;
			break;
			
			case 6:
			clf();
			drawc(f.openFrame_3, cto(1), cto(1));
			drawc(f.openShaft_3, cto(1), cto(4));
			drawc(f.power_on_top_3, cto(4), cto(1));
			drawc(f.power_on_bottom_3, cto(4), cto(9));
			drawc(f.zenmai_1, cto(9), cto(7) + 1);
			drawc(f.zenmai_con_4, cto(8), cto(7) + 1);
			pos.x = 0;
			pos.y =0;
			
			// drawc(f.openShaft, cto(1), cto(4));
			// drawc(f.openShine, cto(1), cto(2));
			// drawc(f.power_on_top, cto(4), cto(1));
			// drawc(f.power_on_bottom, cto(4), cto(9));
// 			
			break;
			
			case 7:
			clf();
			drawc(f.openFrame_3, cto(1), cto(1));
			drawc(f.openShaft_3, cto(1), cto(4));
			drawc(f.power_on_top_3, cto(4), cto(1));
			drawc(f.power_on_bottom_3, cto(4), cto(9));
			drawc(f.zenmai_1, cto(9), cto(7) + 1);
			drawc(f.zenmai_con_4, cto(8), cto(7) + 1);
			drawc(f.mainFlickArea, cto(2), cto(6));
			drawc(f.menuButtons, cto(2), cto(7));
			this.drawVolumeSprite(true);
			scrollByName('bg1').clear(null, makeRect(cellhto(this.titleCmargin.x), cellhto(this.titleCmargin.y), cellhto(this.titleCellWidth), cellhto(this.titleCellHeight)));
			pos.x = 0;
			pos.y =0;
			break;
			

		}

	},
	
	startAnimation: function(anim, func, callback)
	{
		this.isAnimTransition[anim] = true;
		this.countAnimTransition[anim] = 0;
		this.functionAnimTransition[anim] = func == null ? null : func;
		this.callBackAnimTransition[anim] = callback == null ? null : callback;
	},
	
	endAnimation: function(anim)
	{
		this.isAnimTransition[anim] = false;
		// this.countAnimTransition[anim] = 0;
		if(this.callBackAnimTransition[anim] != null){
			this.callBackAnimTransition[anim]();
		};
	},
	
	setChannelSprite: function(ch, key)
	{
		var spr = this.channelSprites[ch]
			, env = this.player.getEnvelopes(ch)
		;
		// spr.timer = env.attack + env.decay + env.length + env.release;
		spr.timer = env.attack + env.decay + env.length;
	},
	
	setTitle: function(title, user)
	{
		var bg = scrollByName('bg2')
			, str = '☆ ☆ ☆ ' + title + ' ☆ ' + user
			, x = cellhto(2), y = cellhto(4)
			, bgCellWidth = 10, bgCellHeight = 10, i, start, end
			, maxWords = bgCellWidth * bgCellHeight
			, len =  str.length;
			
		str = str.substr(0, maxWords);
		for(i = 0; i < maxWords - len; i++){
			str += i % 2 == 0 ? ' ' : '☆';
		}
		// console.log(maxWords , str.length);
		this.word8.setScroll(bg);
		this.word8.setLineCols(bgCellWidth);
		this.word8.setMaxRows(bgCellHeight);
		this.word8.print(str, 0, 0, COLOR_BLACK, COLOR_WHITE);
	},
	
	drawBgTitle: function()
	{
		var cnt = this.titleSlideCount
			, bgCellWidth = 10, bgCellHeight = bgCellWidth
			, titlePos = ((this.titleSlideCount * this.titleSlideRate) % (bgCellWidth * bgCellHeight)) | 0
			, sx = titlePos % bgCellWidth
			, sy = (titlePos / bgCellWidth) | 0
			, x1 = 2, y1 = 4
			, x2 = 7, y2 = 4
			, view = scrollByName('view')
			;
		x1 = x1 - sx;
		x2 = x1 + bgCellWidth;
		y1 = y1 - (sy % bgCellHeight);
		y2 = y2 - ((sy + 1)% bgCellHeight);
		scrollByName('bg2').rasterto(view, 0, 0, null, null, cellhto(x1), cellhto(y1));
		scrollByName('bg2').rasterto(view, 0, 0, null, null, cellhto(x2), cellhto(y2));
		scrollByName('bg1').rasterto(view, 0, 0, null, null, 0, 0);
		if(this.player.isPlay()){
			++this.titleSlideCount;
		}
		// printDebug('y1: ' + y1 + ' y2: ' + y2 );

	},
	
	drawVolumeSprite: function(force)
	{
		var spr
			, bg = scrollByName('bg1')
			, bright, phase, rot, cycle
			, vol = this.player != null ? this.player.volume() : 0
			, len = this.volumeSprites.length
			, xk = cellhto(6), xv = cellhto(7), yk = cellhto(3), yv = yk
			, cl = COLOR_VOLUMES
		;
		force == null ? false : force;
		if(!force){
			if(!this.isOpen || this.durativeVolume == vol){return;}
		}
		this.durativeVolume = vol;
		
		cycle = (vol / this.VOLUME_INC) | 0;
		rot = ((cycle / 2) | 0) % 4;
		spr = ((cycle + 1) % 2) == 1 ? this.sprites.volKnob1 : this.sprites.volKnob2;
		
		spr.rot(rot);
		xk -= (rot == 2 || rot == 3) ? 1 : 0;
		yk += (rot == 1 || rot == 2) ? 1 : 0;
		// bg.drawSprite(spr, (rot == 2 || rot == 3) ? xk - 1 : xk, (rot == 1 || rot == 2) ? y + 1 : y);
		bg.drawSprite(spr, xk, yk);
		bg.drawSprite(this.sprites.black, xv, yv);
		spr = this.volumeSprites[((vol / (this.VOLUME_MAX / len)) | 0) % 8];
		spr.resetSwapColor();
		if(vol > this.VOLUME_MIN && vol < this.VOLUME_MAX){
			bg.drawSprite(spr, xv, yv);
		}else if(vol >= this.VOLUME_MAX){
			spr = this.volumeSprites[len - 1];
			spr.pushSwapColor(cl[0].r, cl[0].b);
			spr.pushSwapColor(cl[1].r, cl[1].b);
			spr.pushSwapColor(cl[2].r, cl[2].b);
			spr.pushSwapColor(cl[3].r, cl[3].b);
			bg.drawSprite(spr, xv, yv);
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
			, enables = this.litroSound != null ? this.player.enableChannels() : null
		;
		if(enables == null){return;}
		if(!this.isOpen){return;}
		for(i = 0; i < this.channelSprites.length; i++){
			if(!enables[i]){continue;}
			// console.log(this.litroSound.channel[i].envelopeClock);
			phase = this.player.channel[i].getPhase();
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
			, y = cellhto(cy - (cy < 2 ? -1 : 2))
			, str = (cx < 10 ? 'x:0' : 'x:') + cx + '$n'
			 + (cy < 10 ? 'y:0' : 'y:') + cy + ''
			;
		if(!this.debugCell || this.word4 == null){
			return;
		}
		// console.log(str, x, y);
		this.word4.setScroll(spr);
		this.word4.print(str, x, y);
		
		spr.drawSprite(this.sprites.cellCursorSprite, cellhto(cx), cellhto(cy));
	},
	
	//未使用
	clearLeftScreen: function()
	{
		var scr = scrollByName('bg1')
			, cm = this.leftScreenCmargin
			, size = this.leftScreenSize
		;
		scr.clear(COLOR_BLACK, makeRect(cellhto(cm.x), cellhto(cm.y), cellhto(size.w), cellhto(size.h)));
	},
	
	//未使用
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
	
	//未使用
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
	
	animTransition: function()
	{
		var k
			, is = this.isAnimTransition
			, func = this.functionAnimTransition
			, cback = this.callBackAnimTransition
			, cnt = this.countAnimTransition
		;
		
		for(k in is){
			if(!is[k] || func[k] == null){continue;}
			// console.log(cnt[k], k)
			if(func[k](cnt[k], k)){
				this.endAnimation(k);
				continue;
			};
			cnt[k]++;
		}
	},
	
	repeatDraw: function()
	{
		//channel note file play
		switch(this.playMode){
			default: break;
		}
		
		this.animTransition();
		this.drawDebugCell();
		this.drawVolumeSprite();
		this.drawChannelSprites();
		// console.time('rep');
		// console.timeEnd('rep');

	},
	
	//未使用
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
	
	openButtonsWindow: function()
	{
		var c = cellhto
			, crect = {x:c(4), y:c(23), w: c(40), h: c(15)}
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
	
	openShareWindow: function(type, file)
	{
		var url = this.shareURLs[type];
		if(type == 'TWITTER'){
			url += [
				'url=' + encodeURIComponent(location.protocol + '//' + location.host + location.pathname 
				+ (file.sound_id == 0 ? '' : '?sound_id=' + file.sound_id)),
				'text=' + encodeURIComponent(file.sound_id == 0 ? '' : ('"'+ file.title + '" play on the litroreceiver!!')),
				'hashtags=' + encodeURIComponent('litrokeyboard,dtm'),
				// 'via=' + 'LitroKeyboard'
				].join('&');
			}
		window.open(url, null,"width=640,height=480,scrollbars=yes");
		// this.closeSNSTab();
		// this.changeEditMode('file');
		// this.clearMenu();
		// this.drawMenu();
		// this.drawFileMenu();
		// this.drawFileMenuCursor();
		// this.clearLeftScreen();
		// this.
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
			, word = ltrc.word4
			, mc = {x: 0, y: 9};
		;
		if(row == null){
			row = 0;
		}
		if(word == null){
			return;
		}
		
		word.setFontSize('4v6px');
		word.setMarkAlign('horizon');
		word.setLineCols(null);
		word.setScroll(scr);
		word.setColor(COLOR_WHITE, COLOR_BLACK);
		word.print(val, cellhto(mc.x), cellhto(mc.y - row) + 2);
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
	ltrc.repeatDraw();
			// ltrc.drawBgTitle();

	drawCanvasStacks(spmax);
	// if(!ltrc.player.isPlay()){
		// bg2.rasterto(view, 0, 0, null, null, ltrc.manualScrollParams.bg2.x, ltrc.manualScrollParams.bg2.y);
		// bg1.rasterto(view, 0, 0, null, null, ltrc.frameOpenBgPos.x, ltrc.frameOpenBgPos.y);
	// }else{
		ltrc.drawBgTitle();
	// }

	// printDebug(Math.round(litroSoundInstance.context.currentTime), 0);
	// printDebug(testval);
	spr.drawto(view);
	spr.clear();
	// view.drawto(view);
	
	screenView(scr, view);
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
	// try{
		litroSoundMain();
		litroReceiverMain();
		keyStateCheck();
	// }
	// catch(e){
		// console.error(e);
		// return;
	// }
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


