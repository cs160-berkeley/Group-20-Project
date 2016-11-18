/*  * this is the part where timing screen is implemented; includes: * 	Variables: *		TimingContent	- an instance of TimingContentTemplate, timing page's content *		TimingScreen	- an instance of TimingScreenTemplate, the whole timing page's screen *	Functions: *		getTimeSet - 		return the timing set values, in string, calling translate_time as assistance
 *		translate_time -	translate time value from integer to string * 	Templates: *		TimingScreenTemplate - the template of the whole timing screen * 			TimingContentTemplate - serves as a parameter of the whole timing screen's template, contains the main contents *				TimingTopBar - the title part of the timing screen, contains brief discription & back button *					BackTemplate - 	the "< BACK" button on top left of the screen,  *									click it to return to "device" page *					Blank - used completely as an indentation element *					SaveTemplate - 	save button, save timing, update data and synch with hardware
 *									but nothing would happen if you don't finish selecting "start" & "end" in advance *				TimingSettingsOptions - the timing setting options (such as start, end, etc.)
 *										calling getTimeSet
 *				 */import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';import {    FieldScrollerBehavior,    FieldLabelBehavior} from 'lib/field';import {    SystemKeyboard} from 'lib/keyboard';import {	DATA,	save_data,
	synch_data,	TMP_SCREEN,
	skins,	texts,	device_list_item_padding,	device_list_topbar_height,	device_list_setting_height,} from "global_settings";import {	DeviceScreenTemplate,	DeviceContentTemplate,	DeviceScreen,	DeviceContent,	Divide} from "device";// instance of templates: screen & content// screen = content + scroller (no topbar / bottombar as nav bar in this case)export var TimingScreen;export var TimingContent;// the template of screenexport var TimingScreenTemplate = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,    skin: skins.background.timing,    contents: [        VerticalScroller($, {             active: true, top: 0, bottom: 0,            contents: [                $.TimingContent,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),    ]}));// the template of main contents in the timing screenexport var TimingContentTemplate = Column.template($ => ({    top: 0, left: 0, right: 0,     contents: [    	new TimingTopBar({idx: $.idx}),    	new Line({height: 20}),    	new TimingSettingsOptions({settingName:"Starts",idx:$.idx}),    	new Divide({height: 1, length: 200}),    	new TimingSettingsOptions({settingName:"Ends", idx:$.idx}),    	new Divide({height: 1, length: 200}),    	new TimingSettingsOptions({settingName:"Repeat", idx:$.idx}),    	new Divide({height: 1, length: 200}),    ]}));// the title part of the timing screen (not real topbar, not sticking to the top, will scroll)var TimingTopBar = Container.template($ => ({	// top-bar	top: device_list_item_padding, left: device_list_item_padding, right: device_list_item_padding, bottom: device_list_item_padding,	height: device_list_topbar_height,	contents: [		new Column( { contents: [			new Line( { contents: [				new BackTemplate({idx: $.idx}),				new Blank({length: 200}),				new SaveTemplate({idx:$.idx})			] }),			new Label({				string: "TIMING",				style: texts.timing.title,			}),		]}),	]}));

// the timing setting options (such as start, end, etc.)var TimingSettingsOptions = Line.template($ => ({	top: device_list_item_padding, left: device_list_item_padding, right: device_list_item_padding, bottom: device_list_item_padding,	height: device_list_setting_height,	active: true,	contents: [		new Label({			string: $.settingName,			style: texts.timing.content,			width: 100,		}),		new Blank({length: 100}),		new Label({			string: getTimeSet($.settingName, $.idx),			style: texts.timing.content,			width: 60,			name: "val",		}),	],	behavior: Behavior({		onTouchEnded: function(container) {			//application.remove(TMP_SCREEN)			if ($.settingName == "Starts"){				container.val.string = "2:00 PM";
				// DATA.init[$.idx].timing = 1;				DATA.init[$.idx].time_start = 14;				// DATA.init[$.idx].time_end = 16;			}else if($.settingName == "Ends"){				container.val.string = "4:00 PM";
				// DATA.init[$.idx].timing = 1;				// DATA.init[$.idx].time_start = 14;				DATA.init[$.idx].time_end = 16;			}		}	}),			}));

// translate time value from integer to string
function translate_time(time_val) {
	if(time_val == 14)
		return "2:00 PM";
	else if (time_val == 16)
		return "4:00 PM";
}

// get the time set, return the proper stringfunction getTimeSet(settingName, idx){	var timing = DATA.init[idx].timing;	// trace("TIMING:"+timing+"\n");	// trace("IDX:"+idx+"\n");	if (timing) {		if (settingName == "Starts"){	 		return translate_time(DATA.init[idx].time_start);		}		else if (settingName == "Ends"){			return translate_time(DATA.init[idx].time_end);		}	}	return "None";}
// the back button "< BACK", click it to go back to device screenlet BackTemplate = Container.template($ => ({	active: true,	contents: [		new Label({			string: "< BACK",			style: texts.timing.topbutton,		})	],	behavior: Behavior({		onTouchEnded: function(container) {
			if ( DATA.init[$.idx].timing == 0){
				DATA.init[$.idx].time_start = -1;
				DATA.init[$.idx].time_end = -1;
				save_data(DATA);
			}			application.remove(TMP_SCREEN);			DeviceContent = DeviceContentTemplate({idx: $.idx});        	DeviceScreen = new DeviceScreenTemplate({ DeviceContent });        	TMP_SCREEN = DeviceScreen;        	application.add(TMP_SCREEN);		}	})}));

// the SAVE button on right of the screenlet SaveTemplate = Container.template($ => ({	active: true,	contents: [		new Label({			string: "SAVE",			style: texts.timing.topbutton,		})	],	behavior: Behavior({		onTouchEnded: function(container) {
			if (DATA.init[$.idx].time_start != -1 && DATA.init[$.idx].time_end != -1) {
				DATA.init[$.idx].timing = 1;
				save_data(DATA);
				synch_data();
				// jump back to previous screen: "device"
				application.remove(TMP_SCREEN);				DeviceContent = DeviceContentTemplate({idx: $.idx});	        	DeviceScreen = new DeviceScreenTemplate({ DeviceContent });	        	TMP_SCREEN = DeviceScreen;	        	application.add(TMP_SCREEN);
			}
			else {
				trace("timing isn't completely setted, can't save now\n");
				DATA.init[$.idx].timing = 0;
				// save_data(DATA);
			}		}	})}));// just for indentationlet Blank = Container.template($ => ({	width: $.length,}));