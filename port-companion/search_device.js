/* 
 * this is the part where search screen is implemented; includes:
 * 	Variables:
 *		SearchContent	- an instance of SearchContentTemplate, search page's content
 *		SearchScreen	- an instance of SearchScreenTemplate, the whole search page's screen
 *	Functions:
 *		
 * 	Templates:
 *		SearchScreenTemplate - the template of the whole search screen
 * 			SearchContentTemplate - serves as a parameter of the whole search screen's template, contains the main contents
 *				SearchTopBar - the title part of the timing screen, contains brief discription & back button
 *					
 *				
 * 				
 */


import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';import {
	load_json,
	save_data,
	DATA,	TMP_SCREEN,	midText,	whiteSkin,
	midGraySkin,
	lightGraySkin,
	lightGraySmallText,
	darkGraySmallText,	device_list_item_padding,	device_list_topbar_height,
	newDevicesFile} from "global_settings";

import {
	HomeContentTemplate,
	HomeScreenTemplate,
	HomeContent,
	HomeScreen,
	LoadHomeContent,
} from "home";

import {
	AddDeviceScreen,
	AddDeviceContent,	AddDeviceScreenTemplate,
	AddDeviceContentTemplate
} from "add_device";export var SearchScreen;export var SearchContent;

var NUM_NEW = 0;
export var SELECTED = -1;
export var newDeviceData;export var SearchScreenTemplate = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,    skin: lightGraySkin, //whiteSkin,    contents: [        VerticalScroller($, {             active: true, top: 0, bottom: 0,            contents: [                $.SearchContent,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),    ]}));

export function loadNewDevicesJSON(container) {
	var uri = newDevicesFile;
	var json_content = load_json(uri);
	var len = json_content.init.length;
	NUM_NEW = len;
	for (var i = 0; i < len; i++) {
		var data_elem = json_content.init[i];
		// trace(data_elem.DeviceName + "\n");
		var item = new NewDeviceTemplate({ idx: i, data: data_elem });
		container.add(item);
		/*
		var item = new DeviceItemTemplate({ 
			DeviceName: data_elem.DeviceName, 
			DeviceGroup: data_elem.DeviceGroup, 
			id: data_elem.id, 
			type: data_elem.type,
			value: data_elem.value,
			idx: i,
		});
		*/
		// container.add(item);
	}
	newDeviceData = json_content.init;
	// container.newdevice_0.skin = lightGraySkin; // it works
	// container[1].skin = lightGraySkin; // it also works
}

function updateSkins(container, idx) {
	if (SELECTED == idx)
		SELECTED = -1;
	else
		SELECTED = idx;
	for (var i = 0; i < NUM_NEW; i++) {
		if (SELECTED == i)
			//container["newdevice_" + i].skin = midGraySkin;
			container[i + 1].skin = midGraySkin;
		else
			//container["newdevice_" + i].skin = whiteSkin;
			container[i + 1].skin = whiteSkin;
	}
}export var SearchContentTemplate = Column.template($ => ({    top: 0, left: 0, right: 0,     contents: [    	new SearchTopBar(),    ]}));

var NewDeviceTemplate= Container.template($ => ({
	top: device_list_item_padding, left: device_list_item_padding, 
	right: device_list_item_padding, bottom: device_list_item_padding, 
	height: device_list_topbar_height,
	skin: whiteSkin,
	idx: $.idx,
	active: true, // active the behavior
	contents: [
		new Label({
			string: $.data.DeviceName,
			style: midText,
		}),
	],
	name: "newdevice_" + "0",//$.idx,
	behavior: Behavior({
		onTouchEnded: function(container) {
			updateSkins(SearchContent, $.idx);
		}
	})
}));var SearchTopBar = Container.template($ => ({	// top-bar	top: device_list_item_padding, left: device_list_item_padding, right: device_list_item_padding, bottom: device_list_item_padding,	height: device_list_topbar_height,	contents: [
		new Column( { contents: [
			new Line( { contents: [
				new CancelTemplate(),
				new Blank(),
				new AddTemplate()
			] }),			new Label({				string: "SELECT DEVICE TO ADD",				style: midText,			}),
		]}),		/*		new Line({						contents: [				//				new AddSearchTemplate({}),			]		}),		*/	]}));

let CancelTemplate = Container.template($ => ({
	active: true,
	contents: [
		new Label({			string: "CANCEL",
			style: lightGraySmallText,			// top: 50, left: 240, right: home_list_item_padding, width: home_list_topbar_img_size, height: home_list_topbar_img_size,		})
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			application.remove(TMP_SCREEN);
        	HomeContent = HomeContentTemplate({});
        	LoadHomeContent(HomeContent);
        	HomeScreen = new HomeScreenTemplate({ HomeContent });
        	TMP_SCREEN = HomeScreen;
        	application.add(TMP_SCREEN);
		}
	})
}));

let AddTemplate = Container.template($ => ({
	active: true,
	contents: [
		new Label({			string: "ADD",
			style: darkGraySmallText,		})
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			if (SELECTED == -1) {
				trace("nothing is selected\n");
				return;
			}
			// DATA.init[DATA.init.length] = newDeviceData[SELECTED];
			// save_data(DATA);
			application.remove(TMP_SCREEN);
        	AddDeviceContent = AddDeviceContentTemplate({});
        	AddDeviceScreen = new AddDeviceScreenTemplate({ AddDeviceContent });
        	TMP_SCREEN = AddDeviceScreen;
        	application.add(TMP_SCREEN);
		}
	})
}));

let Blank = Container.template($ => ({
	width: 200
}));