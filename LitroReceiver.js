/**
 * Litro Keyboard Interface
 * Since 2014-09-25 08:01:52
 * @author しふたろう
 * ver 0.01.00
 */

var PaformTime = 0; //時間計測
// var litroReceiverInstance = null;
var VIEWMULTI = 3;
var DISPLAY_WIDTH = 80;
var DISPLAY_HEIGHT = 80;
// var CHIPCELL_SIZE = 16;
var CHIPCELL_SIZE = 8;
// var layerScroll = null;
var COLOR_STEP = [184, 248, 216, 255];
var COLOR_TIME = [248, 216, 120, 255];

var COLOR_NOTEFACE = [184, 248, 184, 255];
var COLOR_NOTEPRINT = [0, 168, 0, 255];
var COLOR_PARAMKEY = [188, 188, 188, 255];
var COLOR_DISABLE = [120, 120, 120, 255];
var COLOR_LINE = [88, 216, 84, 255];
var COLOR_ARRAY = [[248, 120, 88, 255], [252, 168, 68, 255], [248, 184, 0, 255], [88, 216, 84, 255], [60, 188, 252, 255], [152, 120, 248, 255], [248, 120, 248, 255], [248, 88, 152, 255], ];

var COLOR_CHBRIGHT = [
	{a: [248, 120, 88, 255], d: [240, 208, 176, 255], s: [248, 56, 0, 255], r: [168, 16, 0, 255]}
	, {a: [252, 160, 88, 68], d: [252, 224, 168, 255], s: [228, 92, 16, 255], r: [136, 20, 0, 255]}
	, {a: [248, 184, 0, 255], d: [248, 216, 120, 255], s: [172, 124, 172, 255], r: [80, 48, 0, 255]}
	, {a: [184, 248, 24, 255], d: [216, 248, 120, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
	, {a: [184, 248, 24, 255], d: [216, 248, 120, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
	, {a: [184, 248, 24, 255], d: [216, 248, 120, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
	, {a: [184, 248, 24, 255], d: [216, 248, 120, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
	, {a: [184, 248, 24, 255], d: [216, 248, 120, 255], s: [0, 184, 0, 255], r: [0, 120, 0, 255]}
];

var USER_ID = 0;

function LitroReceiver() {
	
	this.frameChunks = []; //背景フレーム用ChunkRepeat
	this.frameSprites = {}; //背景フレーム用spriteChunk
	this.frameChunksKeys = {}; //framechunksのkeyインデックス重複はArray
	
	this.sprites = {};
	this.channelSprites = [];
	
	this.blinkDrawParams = []; //点滅スプライト保持
	this.blinkDrawEventset = []; //点滅スプライト保持
	this.catchEventset = {}; // tune{param0:x param1:x}

	this.debugCell = false;
	this.debugCellPos = {x: 0, y :0};
	// this.cellCursorSprite = 88; //font8
	this.noteSprite = 176;
	// this.eventsetSprite = 192;
	
	this.noteCmargin = {x: 0, y: 11.5};
	
	this.titleCmargin = {x: 2, y: 17};
	this.titleVolCmargin = {x: 21, y: 21};
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
	
	this.clickableItems = [];
	
	this.viewMode =null;
	
	this.uiImageName = 'ui_8p';
	this.snsImageName = 'sns';
		
	return;
}

LitroReceiver.prototype = {
	init : function() {
		var self = this;
		this.litroSound = new LitroSound();
		litroReceiverInstance = this;
		
		//効果音用
		this.sePlayer = new LitroPlayer();
		
		this.keyControll = new KeyControll('cont1');
		this.player = new LitroPlayer();
		//

		this.litroSound.init(CHANNELS);
		this.player.init("system");
		this.sePlayer.init("se");


			
		// this.player = litroPlayerInstance;
		
		//基本キー
		this.initKeys();

		this.loadImages(function(){
			self.imageLoaded = true;
			self.initSprite();
			self.initFrameSprites();
			
			// self.openFrameParts(0);
			self.openFrameParts(1);
			// self.openFrame();
			self.initClickables();
			requestAnimationFrame(main);

		});
		// this.initFingerState(this.fingers);
		this.initWords();
		this.initCanvas();
		this.initViewMode();
		// this.setBg2Position(this.noteScrollPos.x);
		this.initCatchEvent();
		this.initEventFunc();
		this.initManual();
		this.autoLogin();
		this.initControllDisp();
		
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
			, self = this;
			
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
					if(data == null || data === false){
						self.setError(data != null ? data : {error_code: 0, message: 'error'});
						return;
					}
					self.player.setPlayData(data);
					return;
				},
				function(data){
					self.setError(data != null ? data : {error_code: 0, message: 'error'});
				});
		}
		if(debug != null){
			this.debugCell = true;
			window.document.getElementById('screen').addEventListener('mousemove', function(e){
					var bounds = this.getBoundingClientRect()
						;
					self.debugCellPos.x = (((e.clientX - bounds.left) / VIEWMULTI) / cellhto(1)) | 0;
					self.debugCellPos.y = (((e.clientY - bounds.top) / VIEWMULTI) / cellhto(1)) | 0;
			}, false);
			
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
			var seekPage = self.getNoteSeekPage();
			// self.drawEventsetBatch(seekPage);
			if(seekPage > 0){
				// self.drawEventsetBatch(seekPage - 1);
			}else{
				// self.drawEventsetBatch(0);
			}
		});
	},
	
	initWords: function()
	{
		var word;//, WordPrint = wordPrint;
		word = new WordPrint();
		word.init();
		word.setFontSize('8px');
		word.rowSpace = 0;
		this.word8 = word;
		word = new WordPrint();
		word.init();
		word.setFontSize('4v6px');
		word.rowSpace = 0;
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
			, mk = function(name, id, imageName){
				imageName = imageName == null ? self.uiImageName : imageName;
				// console.log(name, id, imageName);
				self.sprites[name] = makeSprite(imageName, id);
			}
			, chmk = function(ch){
				var base = 176;
				return makeSprite(self.uiImageName, base + ch);
			}
		;
		
		// this.word.setFontSize('8px');
		mk('cellCursorSprite', 88, this.word8.imageName);
		
		mk('pwLamp1', 34);
		mk('pwLamp2', 152);
		mk('pwLamp3', 136);
		
		for(i = 0; i < CHANNELS; i++){
			this.channelSprites[i] = {sprite: chmk(i), timer: 0, x: cellhto((i % 4) + x), y: cellhto(((i / 4) | 0) + y), color: COLOR_CHBRIGHT[i].s};
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
			openShine: msq('(128;144;128;0)^2 (0^8)*6 ((128;144;128;0)|fh)^2'),
			power_on_top: msq('137 137|fh'),
			power_on_bottom: msq('153 153|fh'),
			
			mainFlickArea: msq('0 208*4 0'),
			mainButtons: msq('2+6:13+2'),
			playButton: msq('6+2:13+2'),
			stopButton: msq('8+2:13+2'),
			
			
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
	
	initClickables: function()
	{
		var c = cellhto
			, view = scrollByName('view')
			, bg = scrollByName('bg1')
			, self = this
			, fs = this.frameSprites
		;
		this.appendClickableItem(makeRect(c(6), c(7), c(2), c(2)), function(){
			if(self.player.isPlay()){
				self.player.stop();
				bg.drawSpriteChunk(fs.playButton, c(6), c(7));
			}else{
				self.player.play();
				bg.drawSpriteChunk(fs.stopButton, c(6), c(7));
			}
			
		}, 'play');
		document.getElementById('screen').onclick = function(e){
			var bounds = this.getBoundingClientRect(), w = view.canvas.width, h = view.canvas.height
				, x = ((((e.clientX - bounds.left) / VIEWMULTI) | 0) - view.x + w) % w
				, y = ((((e.clientY - bounds.top) / VIEWMULTI) | 0) - view.y + h) % h
			;
			self.clickEvent(x, y);
		};

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
	
	noteCurrentHeight: function(key)
	{
		var start = this.octaveLevel * this.octaveInKeys
			, append = 0
			, cheight = 0
			, skip = 0
		;
		key = key - start;
		while(this.octaveInKeys < key - 1){
			key = key - this.octaveInKeys;
			append++;
		}
		cheight = this.iWHITE_KEYS[this.CHARS_INDEX[key]] == null ? this.iBLACK_KEYS[this.CHARS_INDEX[key]] + this.BLACK_KEY_SKIP[this.CHARS_INDEX[key]]: this.iWHITE_KEYS[this.CHARS_INDEX[key]];
		return cheight + (append * this.octaveInWhiteKeys);
	},
	
	eventValue2Key: function(value)
	{
		var ids = AudioChannel.tuneParamsIDKey();
		if(ids[value] != null){
			return ids[value];
		}
		return '';
	},
	
	getOctaveFromKeyChar: function(chr)
	{
		var chars, i, ocnt, oct;
		
		chars = this.ROW_CHARS.top.concat(this.ROW_CHARS.bottom);
		// console.log(this.ROW_CHARS.bottom);
		// code = this.ROW_KEYCODE.top.join(this.ROW_KEYCODE.bottom);
		for(i = 0; i < chars.length; i++){
			if(chars[i] == chr){
				ocnt = this.octaveSeparateCount;
				if(i < ocnt[0]){
					return this.octaveLevel;
				}else if(i < ocnt[0] + ocnt[1]){
					oct = this.octaveLevel + 1;
					return (oct > this.litroSound.OCTAVE_MAX) ? this.litroSound.OCTAVE_MAX : oct;
				}else{
					oct = this.octaveLevel + 2;
					return (oct > this.litroSound.OCTAVE_MAX) ? this.litroSound.OCTAVE_MAX : oct;
				}
			}
		}
	},
	
	key2Char: function(key)
	{
		var i = 0, chr, sepcnt = this.octaveSeparateCount
			, index = key - (this.octaveLevel * this.octaveInKeys)
			, chars = this.ROW_CHARS.top.concat(this.ROW_CHARS.bottom)
		;
		return chars[index] == null ? null : chars[index];
	},
	
	getCodeNameFromKeyChar: function(chr){
		var chars, row, i;
		for(row in this.ROW_CHARS){
			chars = this.ROW_CHARS[row];
			for(i = 0; i < chars.length; i++){
				if(chars[i] == chr){
					return ;
				}
			}
		}	
	},

	getKeysDefine: function(){
		return this.CONTROLL_CHARS;
	},
	
	getLastCommand: function(a)
	{
		a = a == null ? 0 : a;
		return this.commandPath[this.commandPath.length - 1 - a] == null ? '' : this.commandPath[this.commandPath.length - 1 - a];
	},
	
	getNoteMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.noteMenuList;
		}
		return null;
	},
	
	getFileMenuList: function()
	{
		var mapIndex, com = this.getLastCommand();
		if(this.commandPath.length == 0){
			if(this.getLoginParams() != null){
				return this.fileMenuList_login;
			}
			return this.fileMenuList;
		}
		mapIndex = this.commandPath[this.commandPath.length - 1];
		
		return  this.fileMenuMap[mapIndex] == null ? 
		null :  this.fileMenuMap[mapIndex];
	},
	
	getPackMenuList: function()
	{
		var com = this.getLastCommand();
		return this.packMenuList;
	},
		
	getShareMenuList: function()
	{
		return this.shareMenuList;
	},
		
	getCatchMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.catchMenuList;
		}else{
			return this.catchKeepMenuList;
		}
	},
	
	getEventsetMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.eventsetMenuList;
		}
		return null;
	},
	
	getManualMenuList: function()
	{
		if(this.commandPath.length == 0){
			return this.manualMenuList;
		}
		return null;
	},
	
	getActiveModeMenuList: function()
	{
		switch(this.getMode())
		{
			case 'tune': return this.ltSoundChParamKeys;
			case 'note': return this.getNoteMenuList();
			case 'play': return this.getFileMenuList();
			case 'catch': return this.getCatchMenuList();
			case 'file': return this.getFileMenuList();
			case 'share': return this.getShareMenuList();
			case 'pack': return this.getPackMenuList();
			case 'eventset': return this.getEventsetMenuList();
			case 'manual': return this.getManualMenuList();
			default: return [];
		}
	},
	
	getModeCursor: function(mode)
	{
		switch(mode)
		{
			case 'tune': return this.paramCursor;
			case 'note': return this.noteMenuCursor;
			case 'play': return this.fileMenuCursor;
			case 'catch': return this.catchMenuCursor;
			case 'file': return this.fileMenuCursor;
			case 'share': return this.fileMenuCursor;
			case 'pack': return this.packMenuCursor;
			case 'eventset': return this.eventsetMenuCursor;
			case 'manual': return this.manualCursor;
			default: return {};
		}
	},
	
	getActiveModeCursor: function()
	{
		return this.getModeCursor(this.getMode());
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
	
	editChannel: function()
	{
		return this.paramCursor.x;
	},
	
	/**
	 * 位置調整系
	 * @param {Object} pos
	 */
	getNoteDispPos: function(pos)
	{
		pos = pos == null ? this.player.noteSeekTime : pos;
		return (pos % this.noteRangeScale) * (DISPLAY_WIDTH / this.noteRangeScale);
	},
	
	getNoteSeekPage: function(putpos)
	{
		putpos = putpos == null ? this.player.noteSeekTime : putpos;
		return (putpos / this.noteRangeScale) | 0;
	},
	
	getParamKeyName: function(index)
	{
		index = index == null ? this.paramCursor.x : index;
		return this.ltSoundChParamKey[this.paramKeys[index]];
	},
	
	getTuneParam: function()
	{
		return this.litroSound.channel[this.paramCursor.x].tune([this.paramCursor.y]);
	},
	
	isCatch: function(time, ch, dataType)
	{
		if(time in this.catchEventset[dataType] && this.selectNote.ch == ch){
			return true;
		}
		return false;
	},
	
	resolutedTime: function(time)
	{
		var cellTime = (this.noteRangeScale / this.noteRangeCells) | 0
			, abTime = time % cellTime
		;
		return cellTime - abTime > abTime ? time - abTime : time - abTime + cellTime ;
	},
	
	playLitro: function()
	{
		if(!this.player.isPlay()){
			return;
		}
		// this.updateForwardSeek();
	},
	
	appendClickableItem: function(rect, func, name)
	{
		this.clickableItems.push({rect: rect, func: func, name: (name == null ? this.clickableItems.lengh : name)});
		return this.clickableItems.length;
	},
	
	clearClickableItem: function(name){
		var rep = [], i;
		if(name == null){
			this.clickableItems = [];
			return;
		}
		for(i = 0; i < this.clickableItems.length; i++){
			if(this.clickableItems[i].name){
				continue;
			}
			rep.push(this.clickableItems[i]);
		}
		this.clickableItems = [];
		this.clickableItems = rep;
		return this.clickableItems.length;
	},
	
	makeAllTuneParamSet: function(ch, time)
	{
		time = time == null ? null : time;
		var value, res = {}, tindex
		, types = this.player.typesArray('TUNE', ['event', 'enable']);
		;
		
		for(tindex = 0; tindex < types.length; tindex++){
			type = types[tindex];
			res[type] = {};
			value = this.litroSound.getChannel(ch, type);
			res[type][time] = this.makeEventset(type, value, time);
		}
		return res;
	},
	
	makeEventset: function(type, value, time)
	{
		time = time == null ? this.player.noteSeekTime: time;
		time = this.player.isPlay() ? time - 1 : time; //プレイ中は重複再生防止
		var e = {
			// time: this.resolutedTime(time),
			time: time,
			type: type == null ? this.getParamKeyName() : type,
			value: value
		}
		;
			// console.log(type, value, time);
		return e;
	},
	
	deleteAtTime: function(ch, time, type)
	{
		type = type == null ? 'ALL' : type;
		var types = this.player.typesArray(type)
		, sort = AudioChannel.sortParam, tindex
		, player = this.player, deleted = {}
		;
		for(tindex = 0; tindex < types.length; tindex++){
			type = types[tindex];
			deleted[type] = {};
			if(this.player.eventsetData[ch] != null && this.player.eventsetData[ch][type] != null && this.player.eventsetData[ch][type][time] != null){
				eventset = this.player.eventsetData[ch][type][time];
				deleted[type][time] = this.makeEventset(type, eventset.value, eventset.time);
				delete this.player.eventsetData[ch][type][time];
				
			}
		}
	},
	
	deleteEventChange: function(ch, events)
	{
		var eventset
		, type, t //, samp = []
		, deleted = {}, cnt = 0
		// , data
		, sort = AudioChannel.sortParam
		;
		ch = ch == null ? this.paramCursor.x : ch;
		events = events == null ? this.catchEventset : events;
		for(type in events){
			deleted[type] = {};
			for(t in events[type]){
				// samp.push(t);
				// data = events[type][t];
				if(this.player.eventsetData[ch][type][t] != null){
					eventset = this.player.eventsetData[ch][type][t];
					deleted[type][t] = this.makeEventset(type, eventset.value, eventset.time);
					delete this.player.eventsetData[ch][type][t];
					cnt++;
				}
			}
		}
		
		return cnt == 0 ? null : deleted;
	
	},
	
	// setEventChange: function(ch, type, value, time)
	setEventChange: function(ch, eventset)
	{
		if(this.viewMode != null){return;}
		var idKeys = AudioChannel.tuneParamsIDKey()
			, time, set, events
		;
		if(eventset.type == 'event' && idKeys[eventset.value] in AudioChannel.commonTuneType){
			ch = this.player.COMMON_TUNE_CH;
			events = this.player.eventsetData[ch][eventset.type];
			for(time in events){
				if(events[time].value == eventset.value){
					set = {}; set[eventset.type] = {};
					set[eventset.type][time] = eventset;
					this.deleteEventChange(ch, set);
				}
			}
			events[eventset.time] = eventset;
		}else{
			events = this.player.eventsetData[ch][eventset.type];
			events[eventset.time] = eventset;
		}
	},
	
	pasteEventCange: function(ch, time, events)
	{
		var type, eventset = {}, t, eventArray = []
			, startTime = 9999999999, endTime = -1, moveTime;
		events = events == null ? this.catchEventset : events;
		//type-time -> time-type
		for(type in events){
			for(t in events[type]){
				eventset[t] = eventset[t] == null ? {} : eventset[t];
				eventset[t][type] = events[type][t];
				t = t | 0;
				startTime = startTime > t ? t : startTime;
				endTime = endTime < t ? t : endTime;
			}
		}
		
		for(t in eventset){
			for(type in eventset[t]){
				eventArray.push(eventset[t][type]);
			}
		}

		if(eventArray.length == 0){
			return;
		}
		moveTime = startTime <= this.selectNote.time ? time - startTime : time - endTime;
		// moveTime = time;
		for(type in events){
			for(t in events[type]){
				if((t | 0) + moveTime < 0){
					continue;
				}
				eventset = this.makeEventset(type, events[type][t].value, (t | 0) + moveTime);
				this.setEventChange(ch, eventset);
			}
		}
	},
	
	incNotekeys: function(eventset)
	{
		var type = 'note', time;
		if(eventset[type] == null){return;}
		for(time in eventset[type]){
			if(eventset[type][time].value + 1 >= this.litroSound.KEYCODE_MAX){
				return;
			}
		}
		for(time in eventset[type]){
			eventset[type][time].value++;
		}
	},
	
	decNotekeys: function(eventset)
	{
		var type = 'note', time;
		if(eventset[type] == null){return;}
		for(time in eventset[type]){
			if(eventset[type][time].value - 1 < 0){
				return;
			}
		}
		for(time in eventset[type]){
			eventset[type][time].value--;
		}
	},
	
	insertSpace: function(ch, startTime, space)
	{
		var types = this.player.typesArray()
			, tindex, type, eventStack, result = {}, t
		;
		eventStack = this.player.allStackEventset(ch, types);
		for(tindex = 0; tindex < eventStack.length; tindex++){
			e = eventStack[tindex];
			t = e.time;
			type = e.type;
			if(startTime <= t){
				t += space;
				if(startTime > t){return;}
			}
			if(result[type] == null){
				result[type] = {};
			}
			result[type][t] = this.makeEventset(type, e.value, t);
		}
		for(type in result){
			this.player.eventsetData[ch][type] = result[type];
		}
	},

//TODO 複数キーの操作は選択中チャンネルで
	onCode: function(chr)
	{
			// console.log(chr);

		var channel, chars, row, octave, code, i
			, pos = this.getNoteDispPos()
			, seekPage = this.getNoteSeekPage()
		;
		// console.log(chr);
		octave = this.getOctaveFromKeyChar(chr);
		code = this.CODE_NAME_INDEX[this.CHARS_CODE_NAME[chr]];
		channel = this.searchReadySlot();
		
		if(channel < 0){
			return;
		}else{
			this.status_on[channel] = chr;
		}
		this.litroSound.onNoteFromCode(channel, code, octave, this.editChannel());
		
		if(this.onkeyEvent != null){
			this.onkeyEvent(chr);
		}
		
		//仮使用
		if(channel == this.editChannel()){
			this.setEventChange(this.editChannel(), this.makeEventset('note', code + (octave * this.octaveInKeys)));
		}
		this.drawNoteScroll(seekPage);
		if(pos < cellhto(2) ){
			this.drawNoteScroll(seekPage - 1);
		}else if(pos > cellhto(this.noteRangeCells) - cellhto(2) ){
			this.drawNoteScroll(seekPage + 1);
		}
		this.drawNoteScroll(null, true);

	},
	
	offCode: function(chr)
	{
		var channel = this.searchState(chr)
			, paramChannel = this.paramCursor.x
			;
		if(chr == null || channel < 0){
			// this.offkeyEvent();
			// this.initFingerState(this.fingers);
			// this.litroSound.offNoteFromCode();
			// console.log('chr: ' + chr);
			return;
		}
		if(this.offkeyEvent != null){
			this.offkeyEvent(chr);
		}
		this.status_on[channel] = null;
		// this.litroSound.offNoteFromCode(channel);
		// this.litroSound.channel[channel].refChannel = -1;
		this.litroSound.fadeOutNote(channel, paramChannel);
	},
	
	incOctave: function()
	{
		if(this.octaveLevel <= this.litroSound.OCTAVE_MAX - this.octaveRange + 1){
			this.octaveLevel++;
			this.drawOctaveMeter(this.octaveLevel);
			this.drawEventsetBatch();
		}
	},
	
	decOctave: function()
	{
		if(this.octaveLevel > 0){
			this.octaveLevel--;
			this.drawOctaveMeter(this.octaveLevel);
			this.drawEventsetBatch();
		}
	},
	
	isEnableOnlyChannel: function(ch, enable)
	{
		for(var i = 0; i < this.litroSound.channel.length; i++){
			if(this.litroSound.getChannel(i, 'enable', false) != (((ch == i) == enable) | 0)){
				return false;
			}
		}
		return true;
	},
	
	toggleOnlyChannel: function(ch, enable)
	{
		for(var i = 0; i < this.litroSound.channel.length; i++){
			this.litroSound.toggleOutput(i, (ch == i) == enable);
			this.drawChannelTab_on(i, (ch == i) == enable);
		}
	},
	
	toggleAllChannel: function(enable)
	{
		for(var i = 0; i < this.litroSound.channel.length; i++){
			this.litroSound.toggleOutput(i, enable);
			this.drawChannelTab_on(i, enable);
		}
	},
	
	searchReadySlot: function()
	{
		var i, key
		;
		for(i = 0; i < this.fingers; i++){
			key = (i + this.editChannel()) % this.litroSound.channel.length;
			// key = i;
			if(this.status_on[key] == null){
				return key;
			}
		}

		return -1;
	},
	
	searchState: function(chr)
	{
		var i, key;
		for(i = 0; i < this.fingers; i++){
			key = (i + this.paramCursor.x) % this.litroSound.channel.length;
			// key = i;
			if(this.status_on[key] == chr){
				return key;
			}
		}

		return -1;
	},
	
	getMode: function()
	{
		return this.editMode;
	},
	
	getTimeNoteByRange: function(ch, startTime, endTime)
	{
		var eventsetData = this.eventsetData[ch]
			, i
			, trimData = {}
			, note
		;
		
		for(i = 0; i < eventsetData.length; i++){
			note = eventsetData[i];
			if(startTime > note.time){
				continue;
			}else if(endTime <= note.time){
				break;
			}
			trimData[note.time] = note;
		}

		return trimData;
	},
	
	indexAtWhite: function(chr)
	{
		return this.iWHITE_KEYS[chr] != null ? this.iWHITE_KEYS[chr] : -1;
	},
		
	indexAtBlack: function(chr)
	{
		return this.iBLACK_KEYS[chr] != null ? this.iBLACK_KEYS[chr] : -1;
	},
	
	fileInListAtIndex: function(index)
	{
		var id, c = 0, list = this.player.fileList();
		for(id in list){
			if(c++ == index){return list[id];}
		}
		return null;
	},
	
	pushPackFile: function(file)
	{
		if(this.isPackedFile(file)){
			return false;
		}
		this.packedFiles.push(file);
		this.packedFiles = this.packedFiles.slice(0, this.packMaxSize);
		return this.packedFiles.length >= this.packMaxSize;
	},
	popPackFile: function()
	{
		return this.packedFiles.length == 0 ? null : this.packedFiles.pop();
	},
	
	clearPackedFiles: function()
	{
		this.packedFiles = [];
	},
	
	shipPackFiles: function()
	{
		var packstr, ids = [], len = this.packedFiles.length
		;
		this.packedFiles.map(function(file, i){
			ids.push(file.sound_id);
		});
		packstr = '[' + ids.join(',') + ']';
		prompt('Add Your Script :', 'LitroPlayer.loadPack(' + packstr + ');');
		this.keyControll.allReset();
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
	
	changeEditMode: function(mode, comClear)
	{
		comClear = comClear == null ? true : comClear;
		if(this.viewMode != null){
			this.editMode = 'play';
			return;
		}
		if(typeof mode == 'string'){
			this.editMode = mode;
		}else if(mode == parseInt(mode, 10)){
			this.editMode = this.modeNames[mode];
		}
		// var self = this;
		// if(this.editMode == 'error'){
			// setTimeout(function(){
				// self.changeEditMode('note');
				// self.drawMenu();
			// }, 1000);
		// }
// console.log(comClear);
		if(comClear){
			this.commandPath = [];
		}
		if(this.getActiveModeCursor().y >= this.getActiveModeMenuList().length){
			this.getActiveModeCursor().y = 0;
		}
		
		return;
	},
	
	loadList: function(page, limit)
	{
		var self = this, commonError = {error_code: 0, message: 'server error'};
		try{
			this.player.listFromServer(this.loginParams.user_id, page, limit, 
				function(list){
					if(list == null || list.error_code != null){
						// self.setError(list, 'file');
						list = {};
						// self.changeEditMode('error');
						// self.drawMenu();
						// return;
					}
					// append = append.length == null ? [append] : append;

					self.finishLoadList(list);
					self.drawMenu();
					
				}, function(){
					// self.setError(commonError, 'file');
					self.finishLoadList(null);
					// self.drawMenu();
				});
		}catch(e){
			console.error(e);
			self.setError(commonError, 'file');
		}
	},
	
	finishLoadList: function(list)
	{
		var i, player = self.player, com1 = this.getLastCommand(1), com0 = this.getLastCommand(0)
			, mode = '', curX = 0, title = '', isError = false, clear = false
			, commonError = {error_code: 0, message: 'server error'};
		;
		if(list == null || list.error_code != null){
			list = {};
			isError = true;
			this.player.fileList(list);
		}
		
		if(com1 == 'SAVE'){
			title = 'NEW FILE';
			mode = 'file';
			clear = true;
		}else if(com1 == 'LOAD'){
			//最初にスコア削除を入れておく
			title = '！！CLEAR　NOTES！！';
			mode = 'file';
		}else if(com0 == 'SHARE'){
			title = 'SHARE LITROKEYBOARD！';
			mode = 'share';
		}else if(com0 == 'PACK'){
			title = 'PACK RESET';
			mode = 'pack';
			curX = 1;
			this.packMenuCursor.x = curX;
		}
		list[0] = {sound_id: 0, user_id: this.loginParams.user_id, title: title, packed: false};
		
		if(isError){
			console.log(list);
			this.setError(commonError, mode, clear);
		}else{
			this.changeEditMode(mode, false);
		}

		if(mode == 'pack'){
			this.drawPackedFileList();
			this.drawFileListCursor();
		}else{
			this.drawFileList();
			this.drawFileListCursor();
		}
	},
	
	/*
	 * 最後のコマンドがOKだったら実行
	 */
	commandExecute: function()
	{
		var com_conf = this.getLastCommand()
			, com_type = this.getLastCommand(1)
			, com_method = this.getLastCommand(2)
			, com_submethod = this.getLastCommand(3)
		;
		if(this.commandPath.indexOf('COOKIE') == -1){
			com_type = com_method;
			com_method = com_submethod;
		}
		
		// this.player.listFromSever()
		if(com_conf != 'OK'){
			return;
		}
		switch(com_method){
			case 'SAVE': this.saveCommand(com_type); break;
			case 'LOAD': this.loadCommand(com_type); break;
		}
	},
	
	saveCommand: function(type)
	{
		var self = this, tid;
		switch(type){
			case 'COOKIE': this.player.saveToCookie(); this.changeEditMode('note'); break;
			case 'SERVER': this.changeEditMode('loading'); this.player.playerAccount = this.getLoginParams().account;
			 this.player.saveToServer(this.loginParams.user_id, this.fileInListAtIndex(this.fileListCursor.y).sound_id, this.player.eventsetData, 
			
				function(data){
					if(data == null || data === false || data.error_code != null){
						self.changeEditMode('error');
						self.drawMenu();
						return;
					}
					self.changeEditMode('note');
					self.drawMenu();
					self.drawParamKeys();
					self.drawChannelParams();
					self.drawParamCursor();
					return;
				},
				function(){
					self.changeEditMode('error');
					self.drawMenu();
				}); break;
		}
	},
	
	loadCommand: function(type)
	{
		var self = this, tid, file, pack;
		switch(type){
			case 'COOKIE': this.player.loadFromCookie(); this.changeEditMode('note');break;
			case 'SERVER': 
				file = this.fileInListAtIndex(this.fileListCursor.y);
				if(file == null){
					this.fileListCursor.y = 0;
					return;
				}
				//削除
				if(file.sound_id == 0){
					this.player.clearEventsData();
					this.changeEditMode('note');
					this.drawParamKeys();
					this.drawChannelParams();
					return;
				}
				this.changeEditMode('loading');
				this.player.loadFromServer(this.loginParams.user_id, file.sound_id, 
				function(data){
					if(data == null || data === false){
						self.changeEditMode('error');
						self.drawMenu();
						return;
					}
					self.changeEditMode('note');
					self.player.setPlayData(data);
					self.drawMenu();
					self.selectMenuItem();//drawNoteのため
					self.drawParamKeys();
					self.drawChannelParams();
					self.drawParamCursor();
					return;
				},
				function(data){
					self.setError(data != null ? data : {error_code: 0, message: 'error'});
				}); break;
			case 'PACK': 
				// pack = this.fileInListAtIndex(this.packListCursor.y);
				// if(pack == null){
					// this.packListCursor.y = 0;
					// return;
				// }
			break;
		}
	},
		
	appendOctaveEvent: function(e)
	{
		this.octaveEvent = e;
	},
	appendOnkeyEvent: function(e)
	{
		this.onkeyEvent = e;
	},
	appendOffkeyEvent: function(e)
	{
		this.offkeyEvent = e;
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
	seekPosition: function(seekTime)
	{
		seekTime = seekTime == null ? this.player.noteSeekTime : seekTime;
		// console.log(seekTime *DISPLAY_WIDTH / (this.noteRangeScale * this.noteRange));
		return  seekTime * DISPLAY_WIDTH / (this.noteRangeScale * this.noteRange);
	},
	//スクロール合わせ
	// setBg2Position: function(scrollPos)
	// {
		// var pos = scrollPos | 0
			// // , pos = ((DISPLAY_WIDTH * (scrollPos / this.noteRangeScale)) | 0)
			// , pre = (this.bg2x.t / DISPLAY_WIDTH) | 0
		// ;
		// this.bg2x.t = - (((pos + DISPLAY_WIDTH) % (DISPLAY_WIDTH * 2)) - DISPLAY_WIDTH);
// 		
		// if(this.bg2x.t >= 0){
			// this.bg2x.b = this.bg2x.t - DISPLAY_WIDTH;
		// }else{
			// this.bg2x.b = this.bg2x.t + DISPLAY_WIDTH;
		// }
	// },
	
	updateForwardSeek: function(pos)
	{
		var centerPos = this.seekCenterPosition()
			, setPos = this.seekPosition()
			, player = this.player
			;
		this.noteScrollPos.x = setPos > centerPos ? setPos - centerPos: 0;
		// this.setBg2Position(this.noteScrollPos.x);
		if(this.updateScrollPage()){
			this.drawNotesCount = 0; //ノート描画カウントリセット
			this.drawNoteScroll(this.noteScrollPage + 1);
		}
	},

	updateBackSeek: function()
	{
		var centerPos = this.seekPosition(this.noteRangeScale * this.noteRange / 2)
			, setPos = this.seekPosition()
			, player = this.player
			;
		this.noteScrollPos.x = setPos < centerPos ? 0 : setPos - centerPos;
		this.noteScrollPos.x = this.noteScrollPos.x < 0 ? 0 : this.noteScrollPos.x;
		this.setBg2Position(this.noteScrollPos.x);
		if(setPos == 0){
			this.updateScrollPage();
			this.drawNoteScroll(this.noteScrollPage);
			this.drawNoteScroll(this.noteScrollPage + 1);
		}else if(this.updateScrollPage()){
			this.drawNotesCount = 0; //ノート描画カウントリセット
			this.drawNoteScroll(this.noteScrollPage);
		}		
		this.drawNoteScroll(null, true);
	},
	
	/**
	 * キーチェック
	 */
	moveMenuCursorCommon: function(cur, dir, list, ext)
	{
		var limit = list.length
			, seekTime = this.player.noteSeekTime, moveTime = this.seekTime(cellhto(1))
			, divTime = seekTime % moveTime
			, nextTime = divTime == 0 ? moveTime : divTime
			, prevTime = divTime == 0 ? moveTime : moveTime - divTime
		;
		
		nextTime = ext ? this.noteRangeScale : nextTime;
		prevTime = ext ? this.noteRangeScale : prevTime;
		
		// console.log(moveTime, divTime);
		switch(dir){
			case 'up': cur.y = (cur.y + limit - 1) % limit;
					// this.drawNoteMenu();
					// this.drawNoteCursor();
					this.drawMenuList(list);
					this.drawMenuListCursor(list, cur.y);
					break;
			case 'down': cur.y = (cur.y + 1) % limit;
					// this.drawNoteMenu();
					// this.drawNoteCursor();
					this.drawMenuList(list);
					this.drawMenuListCursor(list, cur.y);
					break;
			case 'left':
						this.player.seekMoveBack(nextTime); 
						this.updateBackSeek(); break;
			
			case 'right':
					this.player.seekMoveForward(prevTime);
					this.updateForwardSeek();
					this.drawNoteScroll(null, true);
					break;
		}
	},
	
	channelMove: function(dir)
	{
		var cur = this.paramCursor
			, chLength = this.litroSound.channel.length
			, ch = this.editChannel();
		;
		switch(dir){
			case 'up': if(this.litroSound.getChannel(ch, 'enable', false) == 0){
								this.litroSound.toggleOutput(ch, true);
								this.drawChannelTab_on(ch, true);
							}else{
								if(!this.isEnableOnlyChannel(ch, true)){
									this.toggleOnlyChannel(ch, true);
								}else{
									this.toggleAllChannel(true);
								}
							}
							break;
			case 'down': if(this.litroSound.getChannel(ch, 'enable', false) == 1){
									this.litroSound.toggleOutput(ch, false);
									this.drawChannelTab_on(ch, false);
								}else{
									if(!this.isEnableOnlyChannel(ch, false)){
										this.toggleOnlyChannel(ch, false);
									}else{
										this.toggleAllChannel(false);
									}
								}
							break;
			case 'left': cur.x = (cur.x + chLength - 1) % chLength;
							break;
			case 'right': cur.x = (cur.x + 1) % chLength;
							break;
		}
		// this.drawParamKeys();
		this.drawChannelParams();
		this.drawParamCursor();
		
		this.drawEventsetBatch();
		// this.drawNoteScroll(this.noteScrollPage);
		// this.drawNoteScroll(this.noteScrollPage + 1);
		// this.drawNoteScroll(null, true);
	},
	
	moveChannelParamCursor: function(dir, ext)
	{
		var cur = this.paramCursor
			, curr = this.paramCursorCurrent
			, limit = this.paramLimit
			, offset = this.paramOffset
			, param = this.ltSoundChParamKeys[this.paramKeys[cur.y]]
			, paramsLength = this.paramKeys.length
			, currentLength = paramsLength - (limit - 1)
		;
		// this.drawParamCursor(curr.x, curr.y, true);
		if(!ext){
			switch(dir){
				case 'up': cur.y = (cur.y + paramsLength - 1) % paramsLength;
								if(--curr.y < 0){
									curr.y = offset == 0 ? limit - 1 : 0;
									offset = (offset + currentLength - 1) % currentLength; //4
								}
								break;
				case 'down': cur.y = (cur.y + 1) % paramsLength;
								if(++curr.y > limit - 1){
									curr.y = offset + limit - 1 >= paramsLength - 1 ? 0 : limit - 1;
									offset = (offset + 1) % currentLength;
								}
								break;
				case 'left': this.litroSound.setChannel(cur.x, param, this.litroSound.getChannel(cur.x, param, false) - 1);
								this.drawParamCursor();
								break;
				case 'right': this.litroSound.setChannel(cur.x, param, this.litroSound.getChannel(cur.x, param, false) + 1);
								this.drawParamCursor();
								break;
			}
			this.paramOffset = offset;
			this.drawParamKeys(offset, limit);
			this.drawChannelParams(offset, limit);
			this.drawParamCursor();
		}else{
			//描画込み
			this.channelMove(dir);
		}
	},
	
	moveCatchCursor: function(dir, ext)
	{
		var cur = this.getActiveModeCursor()
			// , curr = this.paramCursorCurrent
			// , limit = this.paramLimit
			// , offset = this.paramOffset
			, searchTime = -1
			, catchKey = ['note', 'TUNE', 'ALL']
			, catchVal, eventset = null
			, ignore = this.selectNote
			, prevNote
			, ch = this.editChannel()
		;
		
		if(this.getLastCommand() == "KEEP"){
			 if(ext){
				switch(dir){
					case 'up':
						this.incNotekeys(this.catchEventset);
						this.drawEventsetBatch();
						break;
					case 'down':
						this.decNotekeys(this.catchEventset);
						this.drawEventsetBatch();
						break;
					case 'left': this.channelMove(dir);
									break;
					case 'right': this.channelMove(dir);
									break;
				}
				
			}else{
				this.moveMenuCursorCommon(cur, dir, this.getActiveModeMenuList(), ext);
			}
			return;
		}

		//キャッチタイプのインデックス
		for(catchVal = 0; catchVal < catchKey.length; catchVal++){
			if(catchKey[catchVal] == this.catchType){break;}
		}
		switch(dir){
			case 'up': this.catchType = catchKey[(catchVal + catchKey.length - 1) % catchKey.length];
							break;
			case 'down': this.catchType = catchKey[(catchVal + 1) % catchKey.length];
							break;
			case 'left': eventset = this.player.searchNearBack(ch, this.player.noteSeekTime, 0, this.catchType, ignore);
							break;
			case 'right': eventset = this.player.searchNearForward(ch, this.player.noteSeekTime, -1, this.catchType, ignore);
							break;
		}
		this.drawMenu(this.editMode);

		if(eventset != null){
			this.player.soundEventPush(ch, eventset.type, eventset.value);

			if(!ext || (this.catchType != 'ALL' && ((this.catchType == 'TUNE' && this.selectNote.type == 'note') || (this.catchType == 'note' && this.selectNote.type != 'note')) && (this.selectNote.ch != ch || this.selectNote.type != this.catchType))){
				//違うチャンネルをキャッチした
				this.initCatchEvent();
				this.initSelect();
			}
			prevNote = this.selectNoteHistory.pop();
			if(eventset.time == prevNote.time && eventset.type == prevNote.type){
				//もどった
				delete this.catchEventset[this.selectNote.type][this.selectNote.time];
				prevNote = null;
				this.selectEventset(ch, eventset, true);
			}else{
				this.selectNoteHistory.push(prevNote);
				this.selectEventset(ch, eventset, false);
			}
			
			if(eventset.time > this.player.noteSeekTime){
				//前へキャッチ
				this.player.noteSeekTime = eventset.time;
				this.updateForwardSeek();
				// this.drawNoteScroll(null, true);
			}else{
				//後ろへキャッチ
				this.player.noteSeekTime = eventset.time;
				this.updateBackSeek();
			}
			
			// eventset = this.player.eventsetData[ch][this.selectNote.type][searchTime];

			this.catchEventset[eventset.type][eventset.time] = eventset;
			
			// console.log(this.catchEventset);
			this.drawSelectEvents(this.selectNote);
			this.drawEventsetBatch();
			// this.drawNoteScroll(this.noteScrollPage);
			// this.drawNoteScroll(this.noteScrollPage + 1);
			// this.drawNoteScroll(null, true);
		}else{
			eventset = this.player.searchNearBack(ch, this.player.noteSeekTime, 0, this.catchType);
			if(eventset != null){
				this.player.soundEventPush(ch, eventset.type, eventset.value);
			}
		}
		
		return eventset;
	},
	
	moveCharBoardCursor: function(dir, ext)
	{
		var skip = 3
			,Ccur =  this.charBoardCursor, Fcur =  this.fileMenuCursor
			, Climit = this.charBoardLimit, Flimit = this.getActiveModeMenuList().length - skip
			, curr = this.charBoardCurrent, dispNum = this.charBoardDispNum
			, Tcur = this.fileTitleCursor, Tlimit = this.player.titleMaxLength
			, tlength = this.player.title.length + 1
			,y = Fcur.y
		;
		if(ext){
			switch(dir){
				case 'up': Ccur.y = (Ccur.y + Climit.y - 2) % Climit.y;
						curr.y = curr.y - 2; break;
				case 'down': Ccur.y = (Ccur.y + 2) % Climit.y;
						curr.y = curr.y + 2; break;
				case 'left': Tcur.x = tlength == 1 ? Tcur.x : (Tcur.x + tlength - 1) % tlength; break;
				case 'right': Tcur.x = tlength == 1 ? Tcur.x : (Tcur.x + 1) % tlength; break;
			}			
			curr.y = Ccur.y - curr.y >= dispNum.y ? Ccur.y - dispNum.y + 1 : curr.y;
			curr.y = Ccur.y - curr.y + 1 < 0 ? Ccur.y : curr.y;
			this.drawCharBoard();
		}else if(Fcur.x == 0){
			y -= skip;
			switch(dir){
				case 'up': Fcur.y = ((y + Flimit - 1) % Flimit) + skip; break;
				case 'down': Fcur.y = ((y + 1) % Flimit) + skip; break;
				case 'left': Fcur.x = Fcur.x - 1; break;
				case 'right': Fcur.x = Fcur.x + 1; break;
			}
			if(Fcur.x > 0){
				Ccur.x = 0;
				this.drawCharBoard();
				this.drawMenuList(this.getFileMenuList());
				// this.drawFileMenu();
			}else if(Fcur.x < 0){
				Ccur.x = Climit.x - 1;
				this.drawCharBoard();
				this.drawMenuList(this.getFileMenuList());
				// this.drawFileMenu();
			}else{
				this.drawMenu();
				this.drawFileCursor();
				this.drawCharBoard();
			}
		}else{
			switch(dir){
				case 'up': Ccur.y = (Ccur.y + Climit.y - 1) % Climit.y; break;
				case 'down': Ccur.y = (Ccur.y + 1) % Climit.y; break;
				case 'left': Ccur.x = Ccur.x - 1; break;
				case 'right': Ccur.x = Ccur.x + 1; break;
			}
			curr.y = Ccur.y - curr.y >= dispNum.y ? Ccur.y - dispNum.y + 1 : curr.y;
			curr.y = Ccur.y - curr.y < 0 ? Ccur.y : curr.y;
			if(Ccur.x >= Climit.x || Ccur.x < 0){
				Fcur.x = 0;
				this.drawFileCursor();
				this.drawCharBoard();
			}else{
				this.drawCharBoard();
			}
		}
	},
	
	moveFileListCursor: function(dir, ext)
	{
		var cur = this.fileListCursor
			, limit = Object.keys(this.player.fileList()).length
			, offset = this.fileListOffset, page = this.fileListPage
			, dispHeight = 6
			;
		switch(dir){
			case 'up': cur.y = (cur.y + limit - 1) % limit; break;
			case 'down': cur.y = (cur.y + 1) % limit; break;
			case 'left': cur.y = 0; break;
			case 'right': cur.y = limit - 1; break;
		}
		if(dispHeight <= limit){
		}else{
		}
		offset = cur.y - offset < 0 ? cur.y : offset;
		offset = cur.y - offset >= dispHeight ? cur.y - dispHeight + 1 : offset;

		this.fileListOffset = offset;
		
		// this.drawFileMenu();
		// this.drawFileCursor();

	},
	
	moveFileMenuCursor: function(dir, ext)
	{
		if(this.getLastCommand() == 'TITLE'){
			this.moveCharBoardCursor(dir, ext);
			return;
		}else if(this.getLastCommand() == 'SERVER'){
			this.moveFileListCursor(dir, ext);
			this.drawFileList();
			this.drawFileListCursor();

			return;
		}
		var cur = this.fileMenuCursor
			, limit
			, chLength = this.litroSound.channel.length
			, paramsLength = this.paramKeys.length
			, list = this.getFileMenuList()
			, currentLength
		;
		if(list == null){
			 return;
		}
		limit = list.length;
		
		currentLength = paramsLength - (limit - 1);
		switch(dir){
			case 'up': cur.y = (cur.y + limit - 1) % limit; break;
			case 'down': cur.y = (cur.y + 1) % limit; break;
			case 'left': cur.y = 0; break;
			case 'right': cur.y = limit - 1; break;
		}
		this.drawFileMenu();
		this.drawFileCursor();
	},
	
	movePackMenuCursor: function(dir, ext)
	{
		var cur = this.getActiveModeCursor()
			, limit
			, list = this.getPackMenuList()
			, currentLength
		;
		if(list == null){
			 return;
		}
		limit = list.length;
		
		if(cur.x == 0){
			switch(dir){
				case 'up': cur.y = (cur.y + limit - 1) % limit; break;
				case 'down': cur.y = (cur.y + 1) % limit; break;
				case 'left': cur.y = 0; break;
				case 'right': cur.y = limit - 1; break;
			}
			this.drawPackMenu();
			this.drawPackCursor();
		}else{
			this.moveFileListCursor(dir, ext);
			this.drawPackMenu();
			this.drawPackedFileList();
			this.drawFileListCursor();
		}
	},
	
	moveShareMenuCursor: function(dir, ext)
	{
		this.moveFileListCursor(dir, ext);
		this.drawFileList();
		this.drawFileListCursor();
		this.drawShareMenu();
		this.drawShareCursor();
	},
	
	moveEventsetCursor: function(dir, ext)
	{
		var cur = this.getActiveModeCursor()
			, list = this.getActiveModeMenuList()
		;
		switch(dir)
		{
			case 'up': cur.y = (cur.y + list.length - 1) % list.length; break;
			case 'down': cur.y = (cur.y + 1) % list.length; break;
			case 'left': this.moveMenuCursorCommon(cur, dir, list, ext); break;
			case 'right': this.moveMenuCursorCommon(cur, dir, list, ext); break;
		}
		this.drawEventsetMenu();
		this.drawEventsetCursor();

	},
	
	moveNoteMenuCursor: function(dir, ext)
	{
		var cur = this.noteMenuCursor
			, list = this.noteMenuList
		;
		this.moveMenuCursorCommon(cur, dir, list, ext);
	},
	
	moveManualMenuCursor: function(dir, ext)
	{
		var cur = this.getActiveModeCursor()
			, list = this.getActiveModeMenuList()
		;
		return;
		// switch(dir)
		// {
			// case 'up': cur.y = (cur.y + list.length - 1) % list.length; break;
			// case 'down': cur.y = (cur.y + 1) % list.length; break;
			// case 'left': this.moveMenuCursorCommon(cur, dir, list); break;
			// case 'right': this.moveMenuCursorCommon(cur, dir, list); break;
		// }
	},
	
	movePlayCursor: function(dir, ext)
	{
		var cur = this.getActiveModeCursor()
			, list = this.getActiveModeMenuList()
			, vol = this.player.volume()
		;
		switch(dir)
		{
			// case 'up': cur.y = (cur.y + list.length - 1) % list.length; break;
			// case 'down': cur.y = (cur.y + 1) % list.length; break;
			case 'left': this.player.volume(vol > this.VOLUME_MIN ? vol - this.VOLUME_INC : vol); break;
			case 'right': this.player.volume(vol < this.VOLUME_MAX - this.VOLUME_INC ? vol + this.VOLUME_INC : vol); break;
		}

	},

	getMenuCommandPath: function()
	{
		var list = this.getActiveModeMenuList()
			, cur = this.getActiveModeCursor()
			;
		if(list == null){
			return null;
		}
		return list[cur.y];
	},
	
	setMenuCommandPath: function()
	{
		var path = this.getMenuCommandPath()
			;
		if(path == null){
			return this.getLastCommand();
		}
		this.commandPath.push(path);
		return path;
	},
	
	backMenu: function()
	{
		var list = this.getActiveModeMenuList()
			, cur = this.getActiveModeCursor()
			, p
			;
			/*
		if(this.commandPath.length == 0){
			return []; //??
			// return list[cur.y];
		}*/
		p = this.commandPath.pop();
		return list == null ? p : list[cur.y];
	},
	
	commonTabKey: function(back)
	{
		var mode;
		back = back == null ? false : back;
		if(this.viewMode != null){return;}
		if(this.player.isPlay()){
			if(this.editMode == 'tune'){
				this.changeEditMode('play');
				this.drawPlayTitle();
			}else{
				this.changeEditMode('tune');
				this.drawPlayOnSpacekey();
			}
		}else if(back){
				this.changeEditMode('note');
		}else{
			mode = this.editMode;
			if(mode == this.prevEditMode){this.prevEditMode = 'tune';}
			this.changeEditMode(this.prevEditMode);
			this.prevEditMode = mode;
		}
		this.drawParamKeys();
		this.drawChannelParams();
		this.drawParamCursor();
		this.drawMenu();
	},
	
	baseKeyOnChannel: function(key, ext)
	{
		var cur = this.paramCursor
			// , curr = this.paramCursorCurrent
			, param = this.ltSoundChParamKeys[this.paramKeys[cur.y]]
			, eventset, types = {}, player = this.player, time = player.noteSeekTime, ch = this.editChannel()
		;
		switch(key){
			case '<': 
				types = ext ? 'TUNE' : param;
				// this.initCatchEvent();
				// this.initSelect();
				this.deleteAtTime(ch, time, types);
				break;
			case '>': 
				if(ext){
					eventset = this.makeAllTuneParamSet(ch, time);
					this.pasteEventCange(ch, time, eventset);
				}else{
					eventset = this.makeEventset(param, this.litroSound.getChannel(ch, param, false));
					this.setEventChange(ch, eventset);
				}
					
				break;
			case 'select': 
				this.commonTabKey();
				// this.changeEditMode(this.editMode == 'tune' ? 'note' : 'tune');
				break;
			case 'space': 
				this.playKeyOn(ext);
				break;
		}
		this.drawEventsetBatch();
		// this.drawNoteScroll(this.noteScrollPage);
		// this.drawNoteScroll(this.noteScrollPage + 1);
		// this.drawNoteScroll(null, true);
	},
	
	baseKeyOnCatch: function(key, ext)
	{
		var cur, deldat
			, selCommand = this.getMenuCommandPath()
			, lastCommand = this.getLastCommand()
			, i
		;
		switch(key){
			case '<': 
				if(lastCommand == 'KEEP'){
					com = this.backMenu();
					this.getActiveModeCursor().y = 0;
					// break;
				}else{
					this.editMode = this.selectNote.time < 0 ? 'note' : this.editMode;
					this.initCatchEvent();
					this.initSelect();
				}
				this.drawMenu();
				break;
			case '>': 
				if(lastCommand == 'KEEP'){
					if(selCommand == 'PASTE'){
						this.pasteEventCange(this.editChannel(), this.player.noteSeekTime, this.catchEventset);
					}else if(selCommand == 'REMOVE'){
						deldat = this.deleteEventChange(this.selectNote.ch, this.catchEventset);
						if(deldat == null){
							this.backMenu();
						}
						this.initCatchEvent(deldat);
					}
					this.getActiveModeCursor().y = 0;
				}else{
					com = this.setMenuCommandPath();
				}
				// this.changeEditMode('note');
				// for(i = 0; i < this.noteMenuList.length; i++){
					// if(this.noteMenuList[i] == 'PASTE'){cur.y = i; break;}
				// };
				// this.drawMenuList(list);
				// this.drawMenuListCursor(list, cur.y);
				this.drawMenu();
				break;
			case 'select': 
				this.initCatchEvent();
				this.initSelect();
				this.changeEditMode('note');
				this.drawMenu();
				break;
		}
		this.drawSelectEvents({time: -1});
		this.drawEventsetBatch();
		// this.drawNoteScroll(this.noteScrollPage);
		// this.drawNoteScroll(this.noteScrollPage + 1);
		// this.drawNoteScroll(null, true);
	},
	
	baseKeyMenuCommon: function(cursor, key)
	{
		var com = ''
			, player = this.player
			;
		switch(key){
			case '<': 
				com = this.backMenu();
				this.selectMenuItem(com, key);
				// this.drawSelectEvents(this.selectNote);
				this.drawMenu();
				break;
			case '>': 
				com = this.setMenuCommandPath();
				this.selectMenuItem(com, key);
				// this.drawSelectEvents(this.selectNote);
				this.drawMenu();
				break;
			case 'select': 
				this.commonTabKey();
				break;
			case 'space': 
				this.playStartLitro();
				com = 'space';
			break;
		}
		return com;
	},
	
	selectMenuItem: function(item, key)
	{
		var cur = this.noteMenuCursor
			, deldat = {}
		;
		switch(item){
			case 'CATCH':
				cur.y = 0;
				if(key == '<'){
					break;
				}
				this.changeEditMode('catch');
				this.getActiveModeCursor().y = 0;
				this.initCatchEvent();
				this.initSelect();
				break;
			case 'PASTE': 
				// if(key == '<'){
					// cur.y = 0;
					// break;
				// }
				// this.pasteNote(cur.x, this.player.noteSeekTime, this.catchNotes.note);
				// this.pasteEventCange(this.paramCursor.x, this.player.noteSeekTime, this.catchEventset);
				// this.commandPath = [];
				break;
			// case 'REMOVE':
				// if(key == '<'){
					// cur.y = 0;
					// break;
				// }
				// console.log(key);
				// // this.deleteNote(this.catchNotes.ch, this.catchNotes.note);
				// deldat = this.deleteEventChange(this.selectNote.ch, this.catchEventset);
				// this.initCatchEvent(deldat);
				// // this.initSelect();
				// this.commandPath = [];
				// break;
			case 'EVENTSET': 
				//未使用
				if(key == '<'){
					cur.y = 0;
					break;
				}
				this.changeEditMode('eventset');
				break;
			case 'CHANNEL':
				cur = this.paramCursor;
				if(key == '<'){
					this.channelMove('left');
				}else{
					this.channelMove('right');
				}
				this.commandPath = [];
				break;
			case 'FILE':
				// cur.y = 0;
				if(key == '<'){
					break;
				}
				this.changeEditMode('file');
				break;
			case 'MANUAL':
				if(key == '<'){
					break;
				}
				this.openManual();
				break;
			case 'SAVE':
				cur = this.fileMenuCursor;
				cur.y = 0;
				break;
			case 'COOKIE':
				cur = this.fileMenuCursor;
				if(key == '<'){
					cur.y = 0;
					break;
				}
			break;
			case 'LOGIN':
				this.getActiveModeCursor().y = 0;
				if(key == '<'){
					break;
				}
				break;
			case 'FINISH':
				this.getActiveModeCursor().y = 0;
				if(key == '<'){
					this.getActiveModeCursor().y = 0;
					this.fileTitleCursor.x = this.titleBackup.length;
					this.player.title = this.titleBackup;
					break;
				}
				this.word.setLineCols(this.player.titleMaxLength + 1);
				this.player.titleCodes = this.word.makeStrId(this.player.title);
				this.titleBackup = this.player.title;
				// console.log(this.player.titleCodes, this.player.titleCodes.length, this.player.titleMaxLength, this.word.cols);
				this.changeEditMode('file');
				break;
			case 'OK':
				this.getActiveModeCursor().y = 0;
				if(key == '<'){
					break;
				}
				this.commandExecute();
				break;
			case 'CANCEL':
				this.getActiveModeCursor().y = 0;
				this.fileTitleCursor.x = this.titleBackup.length;
				this.player.title = this.titleBackup;
				if(key == '>'){
					this.backMenu();
					this.backMenu();
				}
				break;
			case 'NO':
				this.getActiveModeCursor().y = 0;
				if(key == '>'){
					this.backMenu();
					this.backMenu();
				}
				break;
			default: 
				// cur.y = 0;
		}
		this.drawEventsetBatch();
		// this.drawNoteScroll(this.noteScrollPage);
		// this.drawNoteScroll(this.noteScrollPage + 1);
		// this.drawNoteScroll(null, true);
	},
	
	baseKeyOnNote: function(key, ext)
	{
		var cur = this.noteMenuCursor
			, ch = this.editChannel(), time = this.player.noteSeekTime
			, space = this.seekStep()
		;
		if(ext){
			switch(key){
				case '<': this.insertSpace(ch, time, -space); break;
				case '>': this.insertSpace(ch, time, space); break;
			}
			this.drawEventsetBatch();
			// this.drawNoteScroll(this.noteScrollPage);
			// this.drawNoteScroll(this.noteScrollPage + 1);
			// this.drawNoteScroll(null, true);
		}else{
			switch(key){
				case '<': this.deleteAtTime(ch, time, 'note'); break;
			}
			com = this.baseKeyMenuCommon(cur, key);
		}
	},	
	
	baseKeyOnEventset: function(key, ext)
	{
		var cur = this.paramCursor, mCur = this.getActiveModeCursor()
			, param = this.ltSoundCommonParamskeys[this.eventsetMenuList[mCur.y]]
			, id = AudioChannel.tuneParamsProp[param].id
			, ch = this.editChannel(), time = this.player.noteSeekTime, events
			// , id = AudioChannel.tuneParamsID[param]
		;
		switch(key){
			case '<': 
				if(ext){this.deleteAtTime(ch, time, 'event');}
				else{this.deleteAtTime(ch, time, 'event');}
				// else{this.changeEditMode('note');}
				break;
			case '>': 
				this.setEventChange(cur.x, this.makeEventset('event', id));
				break;
			case 'select': 
				this.commonTabKey(true);
				break;
			case 'space': 
				this.playKeyOn(ext);
				break;
		}
		// cur.y = 0;
		this.drawMenu();
		this.drawEventsetBatch();
		// this.drawNoteScroll(this.noteScrollPage);
		// this.drawNoteScroll(this.noteScrollPage + 1);
		// this.drawNoteScroll(null, true);
	},
	
	baseKeyOnTitle: function(key, ext)
	{
		var cur = this.fileTitleCursor, limit = this.player.titleMaxLength
			, Ccur = this.charBoardCursor, Climit = this.charBoardLimit
			, title = this.player.title, cha = this.word.indexOf(Ccur.x + (Ccur.y * Climit.x))
		;
		switch(key){
			case '<': 
				if(ext){
					title = title.substr(0, cur.x) + title.substr(cur.x + 1);
				}else{
					cur.x = cur.x > 0 ? cur.x - 1 : cur.x;
					title = title.substr(0, cur.x) + title.substr(cur.x + 1);
				}
				break;
			case '>': 
				if(ext){
					if(title.length <= cur.x){
						title = title.substr(0, cur.x) + cha + title.substr(cur.x);
					}else{
						title = title.substr(0, cur.x) + cha + title.substr(cur.x + 1);
					}
				}else{
					if(title.length <= cur.x){
						title = title.length < limit
						? title.concat(cha)
						: title.substr(0, title.length - 1) + cha;
					}else{
						title = title.substr(0, cur.x) + cha + title.substr(cur.x);
					}
					cur.x = cur.x < limit ? cur.x + 1 : cur.x;
				}
				break;
			case 'select': 
				break;
			case 'space': 
				this.playKeyOn(ext);
				break;
		}
		this.player.title = title.substr(0, limit);
	},
	
	baseKeyOnFile_title: function(key, ext)
	{
		var fcur = this.fileMenuCursor, ccur = this.charBoardCursor
		;
		if(key == 'select'){
			if(fcur.x == 0){
				ccur.x = 0; fcur.x = 2;
				this.drawMenuList(this.getFileMenuList());
			}else{
				fcur.x = 0;	ccur.x = -1;
				this.drawFileCursor();
			}
			this.drawCharBoard();
			return true;
		}
		if(fcur.x != 0){
			this.baseKeyOnTitle(key, ext);
			this.drawCharBoard();
			return true;
		}
		return false;
	},
	
	baseKeyOnFile_login: function(key, ext)
	{
		this.fileMenuCursor.y = 0;
		if(key == '>'){
			return;
		}else if(key == '<'){
			this.backMenu();
		}else if(key == 'select'){
			this.changeEditMode('note');
		}
		this.closeSNSTab();
		this.drawMenu();
	},
	
	baseKeyOnFile: function(key, ext)
	{
		var fcur = this.fileMenuCursor, ccur = this.charBoardCursor
			, cLimit = this.charBoardLimit
			, com, self = this
		;
		if(this.getLastCommand() == 'TITLE'){
			if(this.baseKeyOnFile_title(key, ext)){
				return;
			};
		}

		if(this.getLastCommand() == 'LOGIN'){
			this.baseKeyOnFile_login(key, ext);
			return;
		}
		
		if(key == 'select'){
			this.commonTabKey(true);
			return;
		}		
		com = this.baseKeyMenuCommon(fcur, key);
		if(key == '<' && (this.fileMenuList.indexOf(com) >= 0 || this.fileMenuList_login.indexOf(com) >= 0)){
			this.changeEditMode('note');
			this.drawMenu();
		}else{
			switch(com){
				case 'FILELIST':
					this.commandExecute(); //未使用？
					break;
				case 'TITLE':
					this.titleBackup = this.player.title;
					this.getActiveModeCursor().y = 0;
					
					this.fileMenuCursor.x = -1;
					this.fileMenuCursor.y = 3;
					this.charBoardCursor.x = 0;
					this.clearLeftScreen();
					this.drawCharBoard();
					this.drawMenuList(this.getFileMenuList());
					break;
				case 'SHARE':
				case 'PACK':
					this.packMenuCursor.x = 1;
				case 'SERVER':
					cur = this.fileMenuCursor;
					if(key == '<'){
						cur.y = 0;
					}else{
						this.changeEditMode('loading', false);
						this.loadList(this.fileListPage, this.fileListLoadLimit);
						this.getActiveModeCursor().y = 0;
						this.drawMenu();
					}
					break;
				case 'LOGIN':
					fcur.y = 0;
					this.loginSNS();
					this.openSNSTab(function(item){
						self.openLoginWindow(item.name);
					});
					break;
				case 'LOGOUT':
					fcur.y = 0;
					this.logoutSNS();
					break;
				default: fcur.y = 0;
			}
		}
		this.drawEventsetBatch();
	},	
	
	baseKeyOnPack: function(key, ext)
	{
		var fcur = this.fileMenuCursor, ccur = this.charBoardCursor
			, menu = this.getPackMenuList(), path = this.getMenuCommandPath()
			, cur = this.getActiveModeCursor(), self = this
			, refreshRight = function(enable){
				self.drawMenu();
				if(enable){
					self.drawPackCursor();
				}}
			, refreshLeft = function(enable){
				self.drawPackedFileList();
				if(enable){
					self	.drawFileListCursor();
				}}
			;
		if(key == 'select'){
			cur.x ^= 1;
			if(cur.x == 0){
				refreshRight(true);
				refreshLeft(false);
			}else{
				refreshRight(false);
				refreshLeft(true);
			}
			return;
		}
		
		com = this.baseKeyMenuCommon(fcur, key);
		
		if(key == '<'){
			if(cur.x == 0){
				if(menu.indexOf(com) < 0){return;}
				this.changeEditMode('file');
				this.drawMenu();
				this.clearLeftScreen();
				return;
			}else{
				//file選択
				if(this.popPackFile() == null){
					cur.x = 0;
					refreshRight(true);
					refreshLeft(false);
				}else{
					refreshRight(false);
					refreshLeft(true);
				}
			}
		}else{
			if(cur.x == 0){
				switch(com){
					case 'CANCEL':
						this.changeEditMode('file');
						this.drawMenu();
						this.clearLeftScreen();
						return;
					case 'PACKFILES': cur.x = 1;
						this.drawFileListCursor();
						break;
					case 'SHIP': this.shipPackFiles(); break;
				}
			}else{
				if(this.fileListCursor.y == 0){
					this.clearPackedFiles();
				}else{
					this.pushPackFile(this.fileInListAtIndex(this.fileListCursor.y));
				}
				refreshRight(false);
				refreshLeft(true);
			}
		}
		
		// this.drawMenu();
		// this.drawPackCursor();
	},
	
	baseKeyOnShare: function(key, ext)
	{
		var fcur = this.fileMenuCursor
			, menu = this.getShareMenuList(), path = this.getMenuCommandPath()
			, self = this
			;
		if(key == 'select'){
			this.commonTabKey(true);
			this.clearLeftScreen();
			return;
		}
		com = this.baseKeyMenuCommon(fcur, key);
		if(key == '<'){
			this.changeEditMode('file');
			this.drawMenu();
			this.clearLeftScreen();
			return;
		}else if(key == '>'){
			this.openSNSTab(function(item){
				self.openShareWindow(item.name, self.fileInListAtIndex(self.fileListCursor.y));
			});

		}else{
			return;
		}
		
		this.drawMenu();
		this.drawShareCursor();
	},
	
	baseKeyOnManual: function(key, ext)
	{
		var cur = this.paramCursor, mCur = this.getActiveModeCursor()
			, param = this.ltSoundCommonParamskeys[this.eventsetMenuList[mCur.y]]
			, id = AudioChannel.tuneParamsProp[param].id
			// , id = AudioChannel.tuneParamsID[param]
		;
		switch(key){
			case '<': 
				if(ext){
					if(this.manualPage == 0){
						this.closeManual();
					}else{
						this.openManual(this.manualChapterName(-1));
					}
				}else{
					if(this.manualPage == 0){
						this.closeManual();
					}else{
						this.openManual(this.manualPage - 1);
					}
				}
				break;
			case '>': 
				if(ext){
					this.openManual(this.manualChapterName(1));
				}else{
					this.openManual(this.manualPage + 1);
				}
				break;
			case 'select': 
				this.closeManual();
				// this.commonTabKey(true);
				break;
			case 'space': 
				// this.playKeyOn(ext);
				break;
		}
		// cur.y = 0;

	},
	playKeyOn: function(ext)
	{
		var  player = this.player
			;
		if(this.getMode() == 'manual'){return;}
		this.initCatchEvent();
		this.initSelect();
		this.drawSelectEvents({time: -1});

		if(!player.isPlay()){
			if(!ext){
				player.seekMoveBack(-1);
			}
			this.updateBackSeek();
			this.editMode = 'play';
			this.drawMenu('play');
			this.drawOscillo();
			this.drawPlayTitle();
		}else{
			if(this.editMode != 'tune'){
				this.getActiveModeCursor().y = 0;
			}
			this.changeEditMode(this.prevEditMode);
			this.prevEditMode = 'note';
			// this.changeEditMode('note');
			// this.editMode = 'note';
			
			this.clearLeftScreen();
			this.drawParamKeys();
			this.drawParamCursor();
			this.drawChannelParams();
			this.drawMenu();
			if(this.viewMode != null){
				this.drawPlayOnSpacekey();
			}
			// this.drawChannelCursor();
		}
		// this.initFingerState(this.fingers);
		player.isPlay() == true ? player.stop() : player.play();
	},
	
	baseKeyOn: function(key, ext)
	{
		if(key == 'space'){
			this.playKeyOn(ext);
			return;
		}
		
		switch(this.editMode){
			case 'tune': this.baseKeyOnChannel(key, ext);break;
			case 'note': this.baseKeyOnNote(key, ext);break;
			case 'play': this.baseKeyOnChannel(key, ext);break;
			case 'catch': this.baseKeyOnCatch(key, ext);break;
			case 'eventset': this.baseKeyOnEventset(key, ext);break;
			case 'file': this.baseKeyOnFile(key, ext);break;
			case 'pack': this.baseKeyOnPack(key, ext);break;
			case 'share': this.baseKeyOnShare(key, ext);break;
			case 'manual': this.baseKeyOnManual(key, ext);break;
			default: break;
		}
	},
	
	holdKeyCommon: function(key, ext)
	{
		this.baseKeyOn(key, ext);
	},
	
	moveCursor: function(dir, ext)
	{
		switch(this.editMode){
			case 'tune': this.moveChannelParamCursor(dir, ext);break;
			case 'note': this.moveNoteMenuCursor(dir, ext);break;
			case 'play': this.movePlayCursor(dir, ext); break; //this.moveChannelParamCursor(dir, ext);break;
			case 'catch': this.moveCatchCursor(dir, ext);break;
			case 'eventset': this.moveEventsetCursor(dir, ext);break;
			case 'file': this.moveFileMenuCursor(dir, ext);break;
			case 'pack': this.movePackMenuCursor(dir, ext);break;
			case 'share': this.moveShareMenuCursor(dir, ext);break;
			case 'manual': this.moveManualMenuCursor(dir, ext);break;
			// case 3: this.baseKeyOnChannel(dir);break;
		}
	},
	
	zoomKeyOn: function(key, ext)
	{
		var r = this.noteRangeScale
			, c = this.noteRangeCells
			, p = 0
			, max = this.NOTE_RANGE_SCALE_MAX
			, min = this.NOTE_RANGE_SCALE_MIN
		;
		
		if(key == '['){
			for(c; c < max; c += c){
				if((c + p) * 16 > r){break;}
				p += c;
			}
			
			c = ext ? min : c;
			this.noteRangeScale = r + c >= max ? max : r + c;
		}else if(key == ']'){
			for(c; c < max; c += c){
				if((c + p) * 16 >= r){break;}
				p += c;
			}
			c = ext ? min : c;
			this.noteRangeScale = r - c <= min ? min : r - c;
		}else if(key == '[]'){
			this.noteRangeScale = ext ? min * 10 : this.NOTE_RANGE_SCALE_DEFAULT;
		}
		this.drawZoomScale(this.noteRangeScale);
		this.updateForwardSeek();
		this.drawEventsetBatch();
		// this.drawNoteScroll(this.noteScrollPage);
		// this.drawNoteScroll(this.noteScrollPage + 1);
		// this.drawNoteScroll(null, true);
	},
	
	clickEvent: function(x, y)
	{
		var i, item;
		for(i = 0; i < this.clickableItems.length; i++){
			item = this.clickableItems[i];
			if(item.rect.isContain(x, y)){
				item.func(item);
			}
		}
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
	
	openFrameParts: function(num)
	{
		var f = this.frameSprites
			, spr = this.sprites
			, scr = scrollByName('bg1')
			, cto = cellhto
			, drawc = function(s, x, y){scr.drawSpriteChunk(s, x, y);}
			, draws = function(s, x, y){scr.drawSprite(s, x, y);}
		;
		scr.clear(COLOR_BLACK, makeRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT / 2));
		switch(num){
			case 0: 
			// drawc(f.closeFrame, cto(1), cto(6));
			// drawc(f.closeShine, cto(1), cto(6));
			// drawc(f.zenmai1, cto(8), cto(8));
			// drawc(f.power_off, cto(4), cto(7));
			// draws(spr.pwLamp3, cto(2), cto(8));
			break;
			case 1:
			drawc(f.openFrame, cto(1), cto(1));
			drawc(f.openShine, cto(1), cto(2));
			drawc(f.power_on_top, cto(4), cto(1));
			drawc(f.power_on_bottom, cto(4), cto(9));
			drawc(f.mainFlickArea, cto(2), cto(6));
			drawc(f.mainButtons, cto(2), cto(7));
			break;
			
			
		}
		this.word8.setMaxRows(0);
		this.word8.setLineCols(4);
		this.word8.setScroll(scr);
	},

	setChannelSprite: function(ch, key)
	{
		var spr = this.channelSprites[ch]
			, env = this.litroSound.getEnvelopes(ch, true)
		;
		// spr.timer = env.attack + env.decay + env.length + env.release;
		spr.timer = env.attack + env.decay + env.length;
	},
	
	drawChannelSprites: function()
	{
		var spr
			, bg = scrollByName('sprite')
			, bright, phase
			, enables = this.litroSound.enableChannels()
		;
		for(i = 0; i < this.channelSprites.length; i++){
			if(!enables[i]){continue;}
			// console.log(this.litroSound.channel[i].envelopeClock);
			phase = this.litroSound.getPhase(i);
			// console.log(phase);
			if(phase == '' || phase == 0){continue;}
			spr = this.channelSprites[i];
			// spr.sprite.swapColor(COLOR_CHBRIGHT[i][phase], spr.color);
			spr.color = COLOR_CHBRIGHT[i][phase];
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
	
	repeatDrawMenu : function()
	{
		//channel note file play
		switch(this.playMode){
			default: break;
		}
		this.drawDebugCell();
		this.drawChannelSprites();
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
		this.appendClickableItem(makeRect(cellhto(iconCrect.x), cellhto(iconCrect.y), cellhto(iconCrect.w), cellhto(iconCrect.h)), itemFunc, 'TWITTER');
		
		window.document.getElementById('screen').onclick = function(e){
			var bounds = this.getBoundingClientRect(), w = view.canvas.width, h = view.canvas.height
				, x = ((((e.clientX - bounds.left) / VIEWMULTI) | 0) - view.x + w) % w
				, y = ((((e.clientY - bounds.top) / VIEWMULTI) | 0) - view.y + h) % h
			;
			self.clickEvent(x, y);
		};
	},
	
	closeSNSTab: function()
	{
		var view = scrollByName('view')
		;
		view.y = 0;
		this.openFrame();
		this.clearClickableItem();
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
	ltrc.repeatDrawMenu();
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
	litroSoundMain();
	litroReceiverMain();
	keyStateCheck();
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


