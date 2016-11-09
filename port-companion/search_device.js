/* 
 * this is the part where search screen is implemented; includes:
 * 	Variables:
 *		SearchContent	- an instance of SearchContentTemplate, search page's content
 *		SearchScreen	- an instance of SearchScreenTemplate, the whole search page's screen
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
 *				SearchTopBar - the title part of the timing screen, contains brief discription & back button
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


import {
	load_json,
	save_data,
	DATA,
	midGraySkin,
	lightGraySkin,
	lightGraySmallText,
	darkGraySmallText,
	newDevicesFile

import {
	HomeContentTemplate,
	HomeScreenTemplate,
	HomeContent,
	HomeScreen,
	LoadHomeContent,
} from "home";

import {
	AddDeviceScreen,
	AddDeviceContent,
	AddDeviceContentTemplate
} from "add_device";

var NUM_NEW = 0;
export var SELECTED = -1;
export var newDeviceData;

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
}

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
}));
		new Column( { contents: [
			new Line( { contents: [
				new CancelTemplate(),
				new Blank(),
				new AddTemplate()
			] }),
		]}),

let CancelTemplate = Container.template($ => ({
	active: true,
	contents: [
		new Label({
			style: lightGraySmallText,
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
		new Label({
			style: darkGraySmallText,
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