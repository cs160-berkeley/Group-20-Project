/* 
 * this is the part where add device screen is implemented; includes:
 * 	Variables:
 *		AddDeviceContent	- an instance of AddDeviceContentTemplate, search page's content
 *		AddDeviceScreen		- an instance of AddDeviceScreenTemplate, the whole search page's screen
 * 	Templates:
 *		AddDeviceScreenTemplate - the template of the whole add device screen
 * 			AddDeviceContentTemplate - serves as a parameter of the whole add_device screen's template, contains the main contents
 *				AddDeviceTopBar - the title part of the add_device screen, contains brief discription & back button
 *					BackTemplate - 	a part of the "top bar", the back button on top left of the screen
 *									by clicking it, jumping back to "search_device"
 *					Blank - just for indentation
 *					SaveTemplate - 	the button to click to save device data to the device list
 *					
 *				
 * 				
 */


import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,
    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';

import {
	DATA,
	save_data,
	synch_data,
	TMP_SCREEN,
	largeText,
	skins,
	device_list_item_padding,
	device_list_topbar_height,
	// lightGraySmallText,
	darkGraySmallText,
	darkGrayMidText_thin
} from "global_settings";

import {
	HomeContentTemplate,
	HomeScreenTemplate,
	HomeContent,
	HomeScreen,
	LoadHomeContent,
} from "home";


import {
	Divide,
	// SettingOptions,
} from "device";

import {
	SearchScreenTemplate,
	SearchContentTemplate,
	SearchScreen,
	SearchContent,
	loadNewDevicesJSON,
	SELECTED,
	newDeviceData
} from "search_device";

// instances of templates of screen & contents
export var AddDeviceScreen;
export var AddDeviceContent;

// the template of the whole add device screenexport var AddDeviceScreenTemplate = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,    skin: skins.background.add_device,    contents: [        VerticalScroller($, {             active: true, top: 0, bottom: 0,            contents: [                $.AddDeviceContent,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),    ]}));

// the template of main contents on the screen "add_device"
export var AddDeviceContentTemplate = Column.template($ => ({    top: 0, left: 0, right: 0,     contents: [
    	new AddDeviceTopBar(),
    	new Line( {
    		contents: [
    			new Column( {
    				width: 200,
    				contents: [
    					new Label({							string: newDeviceData[SELECTED].DeviceName,							style: darkGrayMidText_thin,						}),
						new Divide({height: 1, length: 200}),
						new Label({							string: newDeviceData[SELECTED].DeviceGroup,							style: darkGrayMidText_thin,						}),
						new Divide({height: 1, length: 200}),
    				]
    			}),
    			new Column ({
    				width: 100,
    				contents: [
    					new Picture({							url: newDeviceData[SELECTED].img,						}),
    				]
    			})
    		]
    	}),
    	/*
    	new SettingOptions({label: "TYPE", idx: $.idx}),
		new Divide({height: 1, length: 200}),
		new SettingOptions({label: "TIMING", idx: $.idx}),
		new Divide({height: 1, length: 200}),
		new SettingOptions({label: "ALERT", idx: $.idx}),
		new Divide({height: 1, length: 200}),
		*/    ]}));

// the top bar of add_device screen
var AddDeviceTopBar = Container.template($ => ({	// top-bar	top: device_list_item_padding, left: device_list_item_padding, right: device_list_item_padding, bottom: device_list_item_padding,	height: device_list_topbar_height,	contents: [
		new Column( { contents: [
			new Line( { contents: [
				new BackTemplate(),
				new Blank(),
				new SaveTemplate()
			] }),			new Label({				string: newDeviceData[SELECTED].DeviceName,				style: largeText,			}),
		]}),	]}));

// the button to click to go back to search_device screen
let BackTemplate = Container.template($ => ({
	active: true,
	contents: [
		new Label({			string: "< BACK",
			style: darkGraySmallText,			// top: 50, left: 240, right: home_list_item_padding, width: home_list_topbar_img_size, height: home_list_topbar_img_size,		})
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			//save_data(DATA);
			//synch_data();
			SELECTED = -1; // back to unselected stage
			application.remove(TMP_SCREEN);
			SearchContent = SearchContentTemplate({});
			loadNewDevicesJSON(SearchContent);
        	SearchScreen = new SearchScreenTemplate({ SearchContent });
        	TMP_SCREEN = SearchScreen;
        	application.add(TMP_SCREEN);
		}
	})
}));

// the button to click to save device data to the device list
let SaveTemplate = Container.template($ => ({
	active: true,
	contents: [
		new Label({			string: "SAVE",
			style: darkGraySmallText,		})
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			DATA.init[DATA.init.length] = newDeviceData[SELECTED];
			save_data(DATA);
			synch_data();
			application.remove(TMP_SCREEN);
        	HomeContent = HomeContentTemplate({});
        	LoadHomeContent(HomeContent);
        	HomeScreen = new HomeScreenTemplate({ HomeContent });
        	TMP_SCREEN = HomeScreen;
        	application.add(TMP_SCREEN);
		}
	})
}));

// just for indentation
let Blank = Container.template($ => ({
	width: 200
}));
