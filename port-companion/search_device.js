/* 
 * this is the part where search screen is implemented; includes:
 * 	Variables:
 *		SearchContent	- an instance of SearchContentTemplate, search page's content
 *		SearchScreen	- an instance of SearchScreenTemplate, the whole search page's screen
 *		NUM_NEW 		- number of the new devices
 *		SELECTED		- the selected index of the device
 *		newDeviceData	- the new device's data list
 *	Functions:
 *		loadNewDevicesJSON - add local new device data automatically (instead of hard-coded, loading from local files)
 *		updateSkins - 	update the skin colors of the new device data,
 *						so as to show to the users which one of them is selected, or none of them is selected
 *						click once to select, click twice to cancel selection
 *						if you don't select any device, you won't be able to move on to the next step (add_device)
 *						called by passing parameter SearchContent, and calling Template NewDeviceTemplate
 * 	Templates:
 *		SearchScreenTemplate - the template of the whole search screen
 * 			SearchContentTemplate - serves as a parameter of the whole search screen's template, contains the main contents
 *				SearchTopBar - the title part of the search_device screen, contains brief discription & back button
 *					CancelTemplate - a part of the "top bar", the cancel button on top left of the screen
 *					Blank - just for indentation
 *					AddTemplate - 	a part of the "top bar", the add button on top right
 *									by clicking it, jump directly to "add_device" page,
 *										but nothing would happen if none of the devices are selected
 *				NewDeviceTemplate -	used to show new devices information, and make it possible to choose one to add
 *									by clicking on one of the instances to select, will be able to go to page "add_device"
 *					
 *				
 * 				
 */


import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';import {
	load_json,
	save_data,
	DATA,	TMP_SCREEN,
	skins,	texts,	device_list_item_padding,	device_list_topbar_height,
	device_list_item_padding_h,
	device_list_item_padding_w,
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
} from "add_device";

// the screen and contentexport var SearchScreen;export var SearchContent;

// the selected device information
var NUM_NEW = 0;
export var SELECTED = -1;
export var newDeviceData;

// the screen's whole templateexport var SearchScreenTemplate = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,    skin: skins.background.search_device, //whiteSkin,    contents: [        VerticalScroller($, {             active: true, top: 0, bottom: 0,            contents: [                $.SearchContent,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),    ]}));

// load new device information from the JSON file
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

// update the skins of the device list so as to indicate which device is selected
function updateSkins(container, idx) {
	if (SELECTED == idx)
		SELECTED = -1;
	else
		SELECTED = idx;
	for (var i = 0; i < NUM_NEW; i++) {
		if (SELECTED == i)
			//container["newdevice_" + i].skin = midGraySkin;
			container[i + 1].skin = skins.highlight.search_device;
		else
			//container["newdevice_" + i].skin = whiteSkin;
			container[i + 1].skin = skins.foreground.search_device;
	}
}

// the search screen's contentsexport var SearchContentTemplate = Column.template($ => ({    top: 0, left: 0, right: 0,     contents: [    	new SearchTopBar(),
    	// to be loaded latter on by function loadNewDevicesJSON, using template NewDeviceTemplate    ]}));

// new device's list item template
var NewDeviceTemplate= Container.template($ => ({
	top: device_list_item_padding_h, left: device_list_item_padding_w, 
	right: device_list_item_padding_w, bottom: device_list_item_padding_h, 
	height: device_list_topbar_height,
	skin: skins.foreground.search_device,
	idx: $.idx,
	active: true, // active the behavior
	contents: [
		new Label({
			string: $.data.DeviceName,
			style: texts.search_device.name,
		}),
	],
	name: "newdevice_" + "0",//$.idx,
	behavior: Behavior({
		onTouchEnded: function(container) {
			updateSkins(SearchContent, $.idx);
		}
	})
}));

// the top bar that contains title and buttonsvar SearchTopBar = Container.template($ => ({	// top-bar	top: device_list_item_padding, left: device_list_item_padding, right: device_list_item_padding, bottom: device_list_item_padding,	height: device_list_topbar_height,	contents: [
		new Column( { contents: [
			new Line( { contents: [
				new CancelTemplate(),
				new Blank(),
				new AddTemplate()
			] }),			new Label({
				top: device_list_item_padding*3,				string: "SELECT DEVICE TO ADD",				style: texts.search_device.title,			}),
		]}),		/*		new Line({						contents: [				//				new AddSearchTemplate({}),			]		}),		*/	]}));

// cancel button on top left of the screen
let CancelTemplate = Container.template($ => ({
	active: true,
	contents: [
		new Label({			string: "CANCEL",
			style: texts.search_device.topbutton,			// top: 50, left: 240, right: home_list_item_padding, width: home_list_topbar_img_size, height: home_list_topbar_img_size,		})
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

// the add button on top right of the screen
let AddTemplate = Container.template($ => ({
	active: true,
	contents: [
		new Label({			string: "ADD",
			style: texts.search_device.topbutton,		})
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

// the indentational blank
let Blank = Container.template($ => ({
	width: 200
}));