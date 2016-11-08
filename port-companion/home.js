import {
    HorizontalScroller,

import {
	TMP_SCREEN,
	img_home,
	img_fave,
	img_note,
	img_sett,
	img_plus,
	img_off,
	img_on,
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
} from "global_settings"




    skin: whiteSkin,
        // top bar
        /*
        */
        // bottom
        new Line({ 
                new iconTemplate({icon_img: img_home, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "home", activate: true}),
                new iconTemplate({icon_img: img_fave, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "favorites", activate: false}),
                new iconTemplate({icon_img: img_note, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "notifications", activate: false}),
                new iconTemplate({icon_img: img_sett, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "settings", activate: false}),

var iconTemplate = Column.template($ => ({ 
	top: 0, left: 0, right: 0,
	// active:true,
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
	//bahavior
	behavior: Behavior({
		onTouchEnded: function(container) {
			application.remove(TMP_SCREEN);
		}
	})
}));

let iconButtonTemplate = Container.template($ => ({
	active: true,
	// on: false,
	contents: [
		new Picture({
			name: $.name,
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			// application.remove(TMP_SCREEN);
			trace("going to page " + $.name + "\n");
		}
	})
}));


export let HomeContentTemplate = Column.template($ => ({ 
    	// title
    	new HomeTopBar(),
    	// device list
    	new DeviceItemTemplate({ DeviceName: "Night Light", DeviceGroup: "David's Room", id: "night_light", type: "binary" }),
    	new DeviceItemTemplate({ DeviceName: "Front Door", DeviceGroup: "Home", id: "front_door", type: "binary" }),
    	new DeviceItemTemplate({ DeviceName: "Oven", DeviceGroup: "Kittchen", id: "oven", type: "binary" }),

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
				//
				new AddDeviceTemplate({}),
			]
		}),
	]
}));

let AddDeviceTemplate = Container.template($ => ({
	active: true,
	contents: [
		new Picture({
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			application.remove(TMP_SCREEN);
		}
	})
}));


export var DeviceItemTemplate = Line.template($ => ({
	top: home_list_item_padding, left: home_list_item_padding, right: home_list_item_padding, bottom: home_list_item_padding, 
	height: home_list_item_height,
	skin: lightGraySkin,
	contents: [
		new Column ({
			left: home_list_item_padding,
			width: home_list_tag_width,
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
		
		new Column ({
			top: home_list_item_padding, left: home_list_item_padding, right: home_list_item_padding, bottom: home_list_item_padding, 
			contents: [
				new OnOffTemplate( { img_url: img_off } ),
			],
		}),
	],
	type: $.type,
	name: $.id,
}));

let OnOffTemplate = Container.template($ => ({
	active: true,
	// on: false,
	contents: [
		new Picture({
			name: "img",
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			// application.remove(TMP_SCREEN);
			// container is this item
			var on_uri = mergeURI(application.url, img_on);
			if (container.img.url == on_uri) { // turn off
				//trace("turning off\n");
				//trace(container.img.url + "\n");
				container.img.url = img_off;
				//trace(container.img.url + "\n");
			}
			else { // turn on
				//trace("turning on\n");
				//trace(container.img.url + "\n");
				container.img.url = img_on;
				//trace(container.img.url + "\n");
			}
			// container.img.url = container.on? img_on: img_off;
		}
	})
}));