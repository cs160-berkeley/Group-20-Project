/* 
 * this is the part where device screen is implemented; includes:
 * 	Variables:
 *		DeviceContent	- an instance of DeviceContentTemplate, device page's content
 *		DeviceScreen	- an instance of DeviceScreenTemplate, the whole device page's screen
 *	Functions:
 *		getStr - 	get the annotation string that appears on screen for each option (such as "On/Off" for "TYPE")
 *					called by SettingOptions only
 * 	Templates:
 *		DeviceScreenTemplate - the template of the whole device screen
 * 			DeviceContentTemplate - serves as a parameter of the whole screen's template, contains the main contents
 *				DeviceTopBar - the title part of the device screen, contains brief discription & back button
 *					BackTemplate - 	the "< BACK" button on top left of the screen, 
 *									click it to return to "home" page
 *					Blank - used completely as an indentation element
 *				SettingOptions 	- 	the template of the three setting options (they use the same template)
 *									namely "TYPE", "TIMING", "ALERT"
 *									taking care of both the layout and the functionality: 
 *										will react to click, react differently according to the different options
 *										for example, click "TIMING" bar to jump to "timing" screen
 *				Divide - the line elements, simply layout purpose, no functionality
 * 				
 */

import {
    VerticalScroller,
    VerticalScrollbar,
    TopScrollerShadow,
    BottomScrollerShadow,
    HorizontalScroller,
    HorizontalScrollbar,
    LeftScrollerShadow,
    RightScrollerShadow
} from 'lib/scroller';

import {
	button_fave,
	img_off,
	img_on,
	on_uri,
	off_uri,
	img_liked,
	img_disliked,
	liked_uri,
	disliked_uri,
	DATA,
	save_data,
	TMP_SCREEN,
	texts,
	skins,
	device_list_item_padding,
	device_list_topbar_height,
	device_list_topbar_width,
	device_list_setting_height,
	device_image_size
} from "global_settings";

import {
	HomeContentTemplate,
	HomeScreenTemplate,
	HomeContent,
	HomeScreen,
	LoadHomeContent,
} from "home";

import {
	TimingScreen,
	TimingContent,
	TimingScreenTemplate,
	TimingContentTemplate
} from "timing";

// the variables: device screen (=content + top / bottom bar + scroller) & device screen's main content
export var DeviceScreen;
export var DeviceContent;

// the template: device screen, contains main contents & scroller (without top / bottom navbar on this page)
export var DeviceScreenTemplate = Container.template($ => ({
    left: 0, right: 0, top: 0, bottom: 0,
    skin: skins.background.device,
    contents: [
        VerticalScroller($, { 
            active: true, top: 0, bottom: 0,
            contents: [
                $.DeviceContent,
                VerticalScrollbar(), 
                TopScrollerShadow(), 
                BottomScrollerShadow(),    
            ]                     
        }),
    ]
}));

function getFaveImg(index) {
	var state = DATA.init[index].favorite;
	if (state) return button_fave.on;
	else return button_fave.off;
}

var HeartOnOff = Container.template($ => ({
	height: 30, left: 0, right: 0,
	active: true,
	contents: [
		new Picture({			top: 10,			right: 20,
			left: 20,			url: getFaveImg($.idx), //"./assets/favorites-on.png", //"./assets/favorites-off.png",			name: "img",			height: 30,		}),
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			// update on / off
			// trace("do something\n");
			// trace("container.img.url = " + container.img.url + "\n");
			DATA.init[$.idx].favorite = 1 - DATA.init[$.idx].favorite;
			container.img.url = getFaveImg($.idx);
        	save_data(DATA); // update data file
			// synch_data(); // update the hardware simulator
		}
	})
}));

// the template: device content, a parameter of device screen's template, contains the main contents
export var DeviceContentTemplate = Column.template($ => ({
    top: 0, left: 20, right: 20, 
    contents: [
    	new DeviceTopBar({idx: $.idx}),
    	new Line({height: 10}),
        new Line ( {
			contents: [
				new Picture({
					url:  DATA.init[$.idx].img,
					top: 0, left: 0, width: device_image_size, height: device_image_size,
				}),
			]
		}),
		new HeartOnOff({idx: $.idx}),
		new Line({height: 20}),
		// new DeviceOptions({idx: $.idx}),
		
		// new FavoriteOnOff({label: "FAVORITE", idx: $.idx}),
		new Divide({height: 1, length: 200}),
		new SettingOptions({label: "TYPE", idx: $.idx}),
		new Divide({height: 1, length: 200}),
		new SettingOptions({label: "TIMING", idx: $.idx}),
		new Divide({height: 1, length: 200}),
		new SettingOptions({label: "ALERT", idx: $.idx}),
		new Divide({height: 1, length: 200}),
		
    ]
}));

// get the annotation string that appears on screen for each option (such as "On/Off" for "TYPE")
// called by the template: SettingOptions only
function getStr(idx, option) {
	if (option == "TYPE") {
		var type = DATA.init[idx].type;
		// trace("\n" + type + "\n");
		if (type == "binary" || type == "lock") {
			return "On/Off";
		}
		return "?type";
	}
	else if (option == "TIMING") {
		// return "24 to 24";// probably showing this way (a proposal)
		var timing = DATA.init[idx].timing;
		if (timing) {
			return "Set";
			//return DATA.init[idx].time_start + " to " + DATA.init[idx].time_end;
		}
		return "None";
	}
	else if (option == "ALERT") {
		// return "24:00" // probably showing this way (a proposal)
		var alert = DATA.init[idx].alert;
		if (alert) {
			return DATA.init[idx].alert_time;
		}
		return "None";
	}
	return "NULL";
}

// the dividing line
// only layout purpose, no functionality
export var Divide = Line.template($ => ({
	top: 0, left: device_list_item_padding, right: device_list_item_padding, bottom: 0,
	height: $.height, width: $.length, skin: skins.foreground.device,
}));

// the setting-options bar
// shown as something like "TYPE	On/Off >"
// click each of the instance of this template, they'll react differently
// for example, click "TIMING" bar, to visit "timing" page
export var SettingOptions = Line.template($ => ({
	top: device_list_item_padding, left: device_list_item_padding, right: device_list_item_padding, bottom: device_list_item_padding,
	height: device_list_setting_height,
	active: true,
	contents: [
		new Label({
			string: $.label,
			style: texts.device.content,
			width: 100,
		}),
		new Blank({length: 100}),
		new Label({
			string: getStr($.idx, $.label),
			style: texts.device.content,
			width: 60,
		}),
		new Label({
			string: ">",
			style: texts.device.content,
		}),
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			trace("selecting " + $.label + "\n")
			var command = $.label;
			if (command == "TIMING") {
				application.remove(TMP_SCREEN);
				TimingContent = TimingContentTemplate({idx: $.idx});
	        	TimingScreen = new TimingScreenTemplate({ TimingContent });
	        	TMP_SCREEN = TimingScreen;
	        	application.add(TMP_SCREEN);
			} 
        	
		}
	})
	
}));
// Basically the same but a little bit different
var FavoriteOnOff = Line.template($ => ({
	top: device_list_item_padding, left: device_list_item_padding, right: device_list_item_padding, bottom: device_list_item_padding,
	height: device_list_setting_height,
	active: true,
	contents: [
		new Label({
			string: $.label,
			style: texts.device.content,
			width: 100,
		}),
		new Blank({length: 40}),
		new Picture({			top: 0,			right: 20,			url: getOnOff($.idx),			name: "img",			height: 20,		})
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			// update on / off
			if (container.img.url == on_uri) {
				// turn off
				container.img.url = img_off;
				// update favorite status
				DATA.init[$.idx].favorite = 0;
			}
			else if (container.img.url == off_uri) {
				// turn on
				container.img.url = img_on;
				// update favorite status
				DATA.init[$.idx].favorite = 1;
			}
			else {
			}
        	save_data(DATA); // update data file
			// synch_data(); // update the hardware simulator
		}
	})
	
}));

function getOnOff(idx) {
	if (DATA.init[idx].favorite)
		return img_on;
	return img_off;
}

// the title part of the device screen, contains brief discription & back button
var DeviceTopBar = Container.template($ => ({
	top: device_list_item_padding, left: device_list_item_padding, right: device_list_item_padding, bottom: device_list_item_padding,
	height: device_list_topbar_height,
	contents: [
		new Column( { contents: [
			new Line( { contents: [
				new BackTemplate(),
				new Blank({length: device_list_topbar_width}),
			] }),
			
			new Label({
				string: DATA.init[$.idx].DeviceName,
				style: texts.device.title,
			}),
			new Label({
				string: DATA.init[$.idx].DeviceGroup,
				style: texts.device.subtitle,
			}),
		
		]}),
	]
}));

// the template of the back button on top left of the screen
// by clicking it users would go back to "home" page
let BackTemplate = Container.template($ => ({
	active: true, //width: device_list_topbar_width,
	contents: [
		new Label({
			top: 25,
			string: "< BACK",
			style: texts.device.topbutton,
		})
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			save_data(DATA);
			application.remove(TMP_SCREEN);
        	HomeContent = HomeContentTemplate({});
        	LoadHomeContent(HomeContent);
        	HomeScreen = new HomeScreenTemplate({ HomeContent });
        	TMP_SCREEN = HomeScreen;
        	application.add(TMP_SCREEN);
		}
	})
}));

// just for indentation, similar with Division, nothing special
let Blank = Container.template($ => ({
	width: $.length,
}));
