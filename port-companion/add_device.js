import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,
    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';

import {
	DATA,
	save_data,
	synch_data,
	TMP_SCREEN,
	largeText,
	whiteSkin,
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

export var AddDeviceScreen;
export var AddDeviceContent;export var AddDeviceScreenTemplate = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,    skin: whiteSkin,    contents: [        VerticalScroller($, {             active: true, top: 0, bottom: 0,            contents: [                $.AddDeviceContent,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),    ]}));

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

var AddDeviceTopBar = Container.template($ => ({	// top-bar	top: device_list_item_padding, left: device_list_item_padding, right: device_list_item_padding, bottom: device_list_item_padding,	height: device_list_topbar_height,	contents: [
		new Column( { contents: [
			new Line( { contents: [
				new BackTemplate(),
				new Blank(),
				new SaveTemplate()
			] }),			new Label({				string: newDeviceData[SELECTED].DeviceName,				style: largeText,			}),
		]}),	]}));

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
			application.remove(TMP_SCREEN);
			SearchContent = SearchContentTemplate({});
			loadNewDevicesJSON(SearchContent);
        	SearchScreen = new SearchScreenTemplate({ SearchContent });
        	TMP_SCREEN = SearchScreen;
        	application.add(TMP_SCREEN);
		}
	})
}));

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

let Blank = Container.template($ => ({
	width: 200
}));
