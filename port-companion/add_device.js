import {
    HorizontalScroller,

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
export var AddDeviceContent;

export var AddDeviceContentTemplate = Column.template($ => ({
    	new AddDeviceTopBar(),
    	new Line( {
    		contents: [
    			new Column( {
    				width: 200,
    				contents: [
    					new Label({
						new Divide({height: 1, length: 200}),
						new Label({
						new Divide({height: 1, length: 200}),
    				]
    			}),
    			new Column ({
    				width: 100,
    				contents: [
    					new Picture({
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
		*/

var AddDeviceTopBar = Container.template($ => ({
		new Column( { contents: [
			new Line( { contents: [
				new BackTemplate(),
				new Blank(),
				new SaveTemplate()
			] }),
		]}),

let BackTemplate = Container.template($ => ({
	active: true,
	contents: [
		new Label({
			style: darkGraySmallText,
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

let SaveTemplate = Container.template($ => ({
	active: true,
	contents: [
		new Label({
			style: darkGraySmallText,
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