/* 
 * this is the part where home screen is implemented 
 */


import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,
    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';

// parameters & frequently-used functions
import {
	TMP_SCREEN,
	img_home,
	img_fave,
	img_note,
	img_sett,
	img_plus,
	img_off,
	img_on,
	img_lock,
	img_unlock,
	on_uri,
	off_uri,
	lock_uri,
	unlock_uri,
	hintText,
	midText,
	smallText,
	largeText,
	BAR_HEIGHT_TOP,
	BAR_HEIGHT_BOTTOM,
	whiteSkin,
	lightGraySkin,
	darkGraySkin,
	home_list_topbar_height,
	home_list_item_height,
	home_list_item_padding,
	home_list_tag_width,
	bottom_bar_padding,
	bottom_bar_img_size,
	home_list_topbar_img_size,
	// load_data,
	save_data,
	DATA,
} from "global_settings"


import {
	DeviceScreenTemplate,
	DeviceContentTemplate,
	DeviceScreen,
	DeviceContent
} from "device";

import {
	SearchScreenTemplate,
	SearchContentTemplate,
	SearchScreen,
	SearchContent,
	loadNewDevicesJSON
} from "search_device";

// the Content and Screen (screen = content with scroll bar) variables
export var HomeContent;
export var HomeScreen;

// home screen template, used to implement HomeScreenexport var HomeScreenTemplate = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,
    skin: whiteSkin,    contents: [        VerticalScroller($, {             active: true, top: BAR_HEIGHT_TOP, bottom: BAR_HEIGHT_BOTTOM,            contents: [                $.HomeContent,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),
        // top bar // not needed for now
        /*        new Container({             top: 0, height: BAR_HEIGHT_TOP, left: 0, right: 0, skin: darkGraySkin,            style: titleStyle,             contents: [                new Label({ string: "HoM" }),            ]        }),
        */
        // bottom bar // the navigation bar for now
        new Line({             bottom: 0, height: BAR_HEIGHT_BOTTOM, left: 0, right: 0, skin: lightGraySkin,             contents: [
                new iconTemplate({icon_img: img_home, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "home", activate: true}),
                new iconTemplate({icon_img: img_fave, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "favorites", activate: false}),
                new iconTemplate({icon_img: img_note, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "notifications", activate: false}),
                new iconTemplate({icon_img: img_sett, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "settings", activate: false}),            ]        }),    ]}));
// the bottom navigate bar's elements' template // not implemented for now
var iconTemplate = Column.template($ => ({ 
	top: 0, left: 0, right: 0,
	active:true,
	contents: [
		
		new iconButtonTemplate({
			name: $.hint, 
			url: $.activate? $.icon_img.activated: $.icon_img.idel,
			padding: $.padding, size: $.size,
		}),
		
		new Label({
			string: $.hint,
			style: hintText,
		}),
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			save_data(DATA);
			trace("going to page " + $.hint + "\n");
		}
	})
}));
let iconButtonTemplate = Container.template($ => ({ // the icons in the bottom navigation bar
	contents: [
		new Picture({
			name: $.name,			url: $.url,			top: $.padding, left: $.padding, right: $.padding, width: $.size, height: $.size,		}),
	],
}));

// home content template, used to implement HomeContent
export let HomeContentTemplate = Column.template($ => ({     top: 0, left: 0, right: 0,    contents: [
    	new HomeTopBar(),	// the top bar
    	// device list would be added latter by the function LoadHomeContent
    	// those devices are implemented by DeviceItemTemplate    ],}));
// functions used to load device data contents to home page, from the device data stored in a file
export function LoadHomeContent(homeContent) {
	var len = DATA.init.length;
	for (var i = 0; i < len; i++) {
		var data_elem = DATA.init[i];
		var item = new DeviceItemTemplate({ 
			DeviceName: data_elem.DeviceName, 
			DeviceGroup: data_elem.DeviceGroup, 
			id: data_elem.id, 
			type: data_elem.type,
			value: data_elem.value,
			idx: i,
		});
		homeContent.add(item);
	}
}
// the "top" navigate bar of home screen (not really stick to the top, it goes up and down with the scroller
var HomeTopBar = Container.template($ => ({
	// top-bar
	top: home_list_item_padding, left: home_list_item_padding, right: home_list_item_padding, bottom: home_list_item_padding,
	height: home_list_topbar_height,
	contents: [
		new Label({
			string: "My Home",
			style: largeText,
		}),
		new Line({			
			contents: [
				new AddDeviceTemplate({}),
			]
		}),
	]
}));

// the plus button's template, click it to add devices
// by clicking it you'll jump to "search_device" screen
let AddDeviceTemplate = Container.template($ => ({
	active: true,
	contents: [
		new Picture({			url: img_plus,			top: 50, left: 240, right: home_list_item_padding, width: home_list_topbar_img_size, height: home_list_topbar_img_size,		})
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			save_data(DATA);
			application.remove(TMP_SCREEN);
			SearchContent = SearchContentTemplate({});
			loadNewDevicesJSON(SearchContent);
        	SearchScreen = new SearchScreenTemplate({ SearchContent });
        	TMP_SCREEN = SearchScreen;
        	application.add(TMP_SCREEN);
		}
	})
}));

// the function getStatusURL is an assistant function of template OnOffTemplate (used in DeviceItemTemplate)
// used to modify the "on / off" / "lock / unlock" image used to symbolize each device's status
// device type is taken into consideration
function getStatusURL(type, value) {
	var goal_image;
	if (type == "binary") {
		if (value)
			goal_image = img_on;
		else
			goal_image = img_off;
	}
	else if (type == "lock") {
		if (value)
			goal_image = img_unlock;
		else
			goal_image = img_lock;
	}
	return goal_image;
}
// device item template, used to implement an item in the device list
export var DeviceItemTemplate = Line.template($ => ({
	top: home_list_item_padding, left: home_list_item_padding, right: home_list_item_padding, bottom: home_list_item_padding, 
	height: home_list_item_height,
	skin: lightGraySkin,
	idx: $.idx,
	contents: [
		new Column ({
			left: home_list_item_padding,
			width: home_list_tag_width,
			contents: [
				// when you click this part you'll enter a device's page
				new DeviceEntryTemplate({DeviceName: $.DeviceName, DeviceGroup: $.DeviceGroup, idx: $.idx}),
			]
		}),
		
		new Column ({
			top: home_list_item_padding, left: home_list_item_padding, right: home_list_item_padding, bottom: home_list_item_padding, 
			contents: [
				new OnOffTemplate( { img_url: getStatusURL($.type, $.value), id: $.id, idx: $.idx } ),
			],
		}),
	],
	type: $.type,
	name: $.id,
}));

// the Labels (group of labels), such as "Night Light", clicked to enter a page of the device, where you can change its settings
// by clicking it you'll jump to "device" screen
let DeviceEntryTemplate = Container.template($ => ({
	active: true,
	idx: $.idx,
	// on: false,
	contents: [
		new Column ( {
			contents: [
				new Label({
					string: $.DeviceName,
					style: midText,
				}),
				new Label({
					string: $.DeviceGroup,
					style: smallText,
				}),
			]
		}),
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			application.remove(TMP_SCREEN);
			DeviceContent = DeviceContentTemplate({idx: $.idx});
        	DeviceScreen = new DeviceScreenTemplate({ DeviceContent });
        	TMP_SCREEN = DeviceScreen;
        	application.add(TMP_SCREEN);
		}
	})
}));

// the switcher template, used for every devices, a part of DeviceItemTemplate
let OnOffTemplate = Container.template($ => ({
	active: true,
	// on: false,
	contents: [
		new Picture({			url: $.img_url,
			name: "img",		})
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			// application.remove(TMP_SCREEN);
			// container is this item
			if (container.img.url == on_uri) { // turn off
				trace("turning off " + $.id + "\n");
				//trace(container.img.url + "\n");
				container.img.url = img_off;
				DATA.init[$.idx].value = 0;
				//trace(container.img.url + "\n");
			}
			else if (container.img.url == lock_uri) {
				trace("unlocking " + $.id + "\n");
				container.img.url = img_unlock;
				DATA.init[$.idx].value = 1;
			}
			else if (container.img.url == off_uri) { // turn on
				trace("turning on " + $.id + "\n");
				//trace(container.img.url + "\n");
				container.img.url = img_on;
				DATA.init[$.idx].value = 1;
				//trace(container.img.url + "\n");
			}
			else if (container.img.url == unlock_uri) {
				trace("locking " + $.id + "\n");
				container.img.url = img_lock;
				DATA.init[$.idx].value = 0;
			}
			// container.img.url = container.on? img_on: img_off;
		}
	})
}));
