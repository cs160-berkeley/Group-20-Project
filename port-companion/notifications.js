/*  * this is the part where notifications screen is implemented; includes: * 	Variables: *		NotificationsContent	- an instance of NotificationsContentTemplate, notifications page's content *		NotificationsScreen	- an instance of NotificationsScreenTemplate, the whole notifications page's screen *	Functions: *		LoadNotificationsContent - take in NotificationsContent as its parameter, add the device data to the NotificationsContent *		getStatusURL - 	an assistant function of template OnOffTemplate,  *						used to modify the "on / off" / "lock / unlock" image used to symbolize each device's status *						device type is taken into consideration * 	Templates: *		NotificationsScreenTemplate - the template of the whole notifications screen * 			NotificationsContentTemplate - serves as a parameter of the whole screen's template, contains the main contents *				NotificationsTopBar - the title of notifications screen, scrolling with content, located on the top * 				DeviceItemTemplate - for each of the listed items (that is, devices) in the data file *					DeviceEntryTemplate - 	appearance is the label telling users the device's name / location  *											functionality is to click it and enter the "device" page *					OnOffTemplate 	- 	appearance is the on / off, or lock / unlock button on the right *										functionality is to update DATA and to change the appearance of itself by calling getStatusURL *			iconTemplate - serves as layout elements stick to the bottom of the screen *				iconButtonTemplate - 	the image used as icon is loaded here *										implemented this way so that we might be able to adapt the icons more easily * 				 */import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';// parameters & frequently-used functionsimport {
	NOTIFICATIONS,
	front_door_idx,
	back_door_idx,
	img_cross,
	img_check,	TMP_SCREEN,	img_home,	img_fave,	img_note,	img_sett,	img_plus,	img_off,	img_on,	img_lock,	img_unlock,	on_uri,	off_uri,	lock_uri,	unlock_uri,	BAR_HEIGHT_TOP,	BAR_HEIGHT_BOTTOM,	skins,	texts,	notifications_list_topbar_height,	notifications_list_item_height,	notifications_list_item_padding_w,	notifications_list_item_padding_h,	notifications_list_tag_width,	notifications_list_topbar_img_size,	bottom_bar_padding,	bottom_bar_img_size,	// load_data,	save_data,	DATA,	deviceURL,	synch_data} from "global_settings"import {	DeviceScreenTemplate,	DeviceContentTemplate,	DeviceScreen,	DeviceContent} from "device";import {	HomeContentTemplate,	HomeScreenTemplate,	HomeContent,	HomeScreen,	LoadHomeContent,} from "home";import {	SetContentTemplate,	SetScreenTemplate,	SetContent,	SetScreen,	LoadSetContent,} from "set";

import {
	FavoritesContent,	FavoritesScreen,
	FavoritesContentTemplate,
	FavoritesScreenTemplate,
	LoadFavoritesContent
} from "favorites";// the Content and Screen (screen = content with scroll bar) variablesexport var NotificationsContent = undefined;export var NotificationsScreen;// notifications screen template, used to implement NotificationsScreenexport var NotificationsScreenTemplate = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,    skin: skins.background.notifications,    contents: [        VerticalScroller($, {             active: true, top: BAR_HEIGHT_TOP, bottom: BAR_HEIGHT_BOTTOM,            contents: [                $.NotificationsContent,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),        // bottom bar // the navigation bar for now        new Line({             bottom: 0, height: BAR_HEIGHT_BOTTOM, left: 0, right: 0, skin: skins.navbar,             contents: [                new iconTemplate({icon_img: img_home, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "home", activate: false}),                new iconTemplate({icon_img: img_fave, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "favorites", activate: false}),                new iconTemplate({icon_img: img_note, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "notifications", activate: true}),                new iconTemplate({icon_img: img_sett, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "settings", activate: false}),            ]        }),
        // topbar?
        // new PopBar({device_name: "Front Door", device_action: "Unlocked"}),    ]}));

var PopBar = Line.template($ => ({
	top: 0, height: BAR_HEIGHT_BOTTOM, left: 0, right: 0, skin: skins.navbar,
	// wait: 1000,
	active: true,
	contents: [
		new PopTextTemplate({device_name: $.device_name, device_action: $.device_action}),
		new Column({width: 30}),
		new UndoButtonTemplate({device_name: $.device_name, device_action: $.device_action, message_idx: $.message_idx})
	],
	behavior: Behavior({
   		// onComplete:
		onTouchEnded: function(container) {
			// trace("do something\n");
			// remove it
			NotificationsScreen.remove(NotificationsScreen.popbar);
		}
	}),
	name: "popbar"
}));

var PopTextTemplate = Line.template($ => ({
	left: 20, //width: 200,
	contents: [
		new Label({			string: $.device_name, // "Front Door"			style: texts.notifications.poptext_emph,		}),
		new Label({			string: " has been ",			style: texts.notifications.poptext,		}),
		new Label({			string: $.device_action, // "Unlocked",			style: texts.notifications.poptext_emph,		}),
	]
}));

var UndoButtonTemplate = Column.template($ => ({
	active: true,
	right: 20,
	contents: [
		new Label({
			string: "UNDO",
			style: texts.notifications.poptext_undo
		}),
	],
	behavior: Behavior({		onTouchEnded: function(container) {			// undo the action
			// trace("undo\n");
			// the data
			// device_name: $.device_name, device_action: $.device_action, message_idx: $.message_idx
			// DATA.init[front_door_idx].value = request;
			var value;
			var index;
			if ($.device_name == "Front Door") {
				index = front_door_idx;
			}
			else if ($.device_name == "Back Door") {
				index = back_door_idx;
			}
			if ($.device_action == "Unlocked") {
				value = 0;
			}
			else if ($.device_action == "Locked") {
				value = 1;
			}
			// trace(index + "," + value + "\n");
			DATA.init[index].value = value;
			save_data(DATA);
			synch_data();
			// the interface
			var item_index = $.message_idx + 1;
			var item = NotificationsContent[item_index];
			item.image.cross.cross_img.url = getImageURL(img_cross, false); //img_cross.idel;
			item.image.cross.active = true;
			item.image.check.check_img.url = getImageURL(img_check, false); //img_check.idel;
			item.image.check.active = true;
			item.text.state_string.string = getReqState(false); //"required";
			item.skin = getMessageSkin(false);
			NOTIFICATIONS[$.message_idx].done = false;
			// remove it
			NotificationsScreen.remove(NotificationsScreen.popbar);		}	})
}));// the bottom navigate bar's elements' template // not implemented for nowvar iconTemplate = Column.template($ => ({ 	top: 0, left: 0, right: 0,	active:true,	contents: [				new iconButtonTemplate({			name: $.hint, 			url: $.activate? $.icon_img.activated: $.icon_img.idel,			padding: $.padding, size: 25,		}),				new Label({			string: $.hint,			style: texts.notifications.navhint,		}),	],	behavior: Behavior({		onTouchEnded: function(container) {			save_data(DATA);			// trace("going to page " + $.hint + "\n");			if ($.hint == "home") {				trace("going to home page\n");				application.remove(TMP_SCREEN);				HomeContent = HomeContentTemplate({});        		LoadHomeContent(HomeContent);        		HomeScreen = new HomeScreenTemplate({ HomeContent });        		TMP_SCREEN = HomeScreen;        		application.add(TMP_SCREEN);			}			else if ($.hint == "favorites") {				trace("staying on favorites page\n");				application.remove(TMP_SCREEN)				FavoritesContent = FavoritesContentTemplate({});        		LoadFavoritesContent(FavoritesContent);        		FavoritesScreen = new FavoritesScreenTemplate({ FavoritesContent });        		TMP_SCREEN = FavoritesScreen;        		application.add(TMP_SCREEN);        					}			else if ($.hint == "notifications") {				trace("staying on notifications page\n");
				/*
				application.remove(TMP_SCREEN)
				NotificationsContent = NotificationsContentTemplate({});
        		LoadNotificationsContent(NotificationsContent);
        		NotificationsScreen = new NotificationsScreenTemplate({ NotificationsContent });
        		TMP_SCREEN = NotificationsScreen;
        		application.add(TMP_SCREEN);
				*/			}			else if ($.hint == "settings") {				trace("going to settings page\n");				application.remove(TMP_SCREEN);				SetContent = SetContentTemplate({});        		LoadSetContent(SetContent);        		SetScreen = new SetScreenTemplate({ SetContent });        		TMP_SCREEN = SetScreen;        		application.add(TMP_SCREEN);			}		}	})}));let iconButtonTemplate = Container.template($ => ({ // the icons in the bottom navigation bar	contents: [		new Picture({			name: $.name,			url: $.url,			top: $.padding, left: $.padding, right: $.padding, width: $.size, height: $.size,		}),	],}));

let crossButtonTemplate = Container.template($ => ({ // the icons in the bottom navigation bar
	active: getActive($.done),//true,	contents: [		new Picture({			name: "cross_img",			url: getImageURL(img_cross, $.done), //img_cross.activated,			top: $.padding * 3, left: $.padding, right: $.padding, width: $.size, height: $.size,		}),	],
	// idx: $.idx, 
	behavior: Behavior({
		onTouchEnded: function(container) {
			// trace("index of this item is " + $.idx + "\n");
			var item_index = $.idx + 1;
			var item = NotificationsContent[item_index];
			item.image.cross.cross_img.url = getImageURL(img_cross, true); //img_cross.idel;
			item.image.cross.active = false;
			item.image.check.check_img.url = getImageURL(img_check, true); //img_check.idel;
			item.image.check.active = false;
			item.text.state_string.string = getReqState(true);// "required";
			// trace(item.text.state_string.string + "\n");
			item.skin = skins.highlight.notifications;
			NOTIFICATIONS[$.idx].done = true;
		}
	}),
	name: "cross"}));

function getActive(done) {
	if (done) return false;
	return true;
}

function getImageURL(image, done) {
	if (done) return image.idel;
	return image.activated;
}

let checkButtonTemplate = Container.template($ => ({ // the icons in the bottom navigation bar
	active: getActive($.done),	contents: [		new Picture({			name: "check_img",			url: getImageURL(img_check, $.done), // img_check.activated,			top: $.padding * 3, left: $.padding, right: $.padding, width: $.size, height: $.size,		}),	],
	name: "check",
	behavior: Behavior({
		onTouchEnded: function(container) {
			var item_index = $.idx + 1;
			var item = NotificationsContent[item_index];
			item.image.cross.cross_img.url = getImageURL(img_cross, true); // img_cross.idel;
			item.image.cross.active = false;
			item.image.check.check_img.url = getImageURL(img_check, true); //img_check.idel;
			item.image.check.active = false;
			item.text.state_string.string = getReqState(true); //"required";
			item.skin = getMessageSkin(true);
			NOTIFICATIONS[$.idx].done = true;
			// unlocking / locking
			var request;
			var door_name;
			var door_state;
			// unlocking: 1, locking: 0
			if (item.text.action.string == "unlock") {
				request = 1;
				door_state = "Unlocked";
			}
			else if (item.text.action.string == "lock") {
				request = 0;
				door_state = "Locked";
			}
			//trace("request " + request + "\n");
			if (item.text.door_name.string == "front door") {
				door_name = "Front Door";
				var temp_front_door = DATA.init[front_door_idx].value;
				//trace("temp front " + temp_front_door + "\n");
				if (temp_front_door == request)
					trace("front door already " + item.text.action.string + "ed\n");
				else
					DATA.init[front_door_idx].value = request;
			}
			else if (item.text.door_name.string == "back door") {
				door_name = "Back Door";
				var temp_back_door = DATA.init[back_door_idx].value;
				//trace("temp back " + temp_back_door + "\n");
				if (temp_back_door == request)
					trace("back door already " + item.text.action.string + "ed\n");
				else
					DATA.init[back_door_idx].value = request;
			}
			save_data(DATA);
			synch_data();
			// pop-up bar
			if (NotificationsScreen.popbar)
				NotificationsScreen.remove(NotificationsScreen.popbar);
			var pop_bar = new PopBar({device_name: door_name, device_action: door_state, message_idx: $.idx});
			NotificationsScreen.add(pop_bar);
		}
	}),}));

function getReqState(done) {
	if (done) return "required";
	return "requires";
}

function str(num) {
	return num.toString();
}

function getReqAction(action) {
	if (action) return "unlock";
	return "lock";
}

function getMessageSkin(done) {
	if (done) return skins.highlight.notifications;
	return skins.foreground.notifications;
}

var doorMessageTemplate = Column.template($ => ({
    top: notifications_list_item_padding_h, bottom: notifications_list_item_padding_h,
    left: notifications_list_item_padding_w, right: notifications_list_item_padding_w,
    height: notifications_list_item_height,
    skin: getMessageSkin($.done),
    contents: [
    	// the notification content
    	new Line ( {
    		top: notifications_list_item_padding_h,
	    	contents: [
		    	new Label({
		    		string: $.kid_name,
					style: texts.notifications.content,
					name: "kid_name",
		    	}),
		    	new Label({
		    		string: " ",
					style: texts.notifications.content,
		    	}),
		    	new Label({
		    		string: getReqState($.done),
					style: texts.notifications.content,
					name: "state_string"
		    	}),
		    	new Label({
		    		string: " to ",
					style: texts.notifications.content,
		    	}),
		    	new Label({
		    		string: getReqAction($.action),
					style: texts.notifications.emph,
					name: "action"
		    	}),
		    	new Label({
		    		string: " ",
					style: texts.notifications.content,
		    	}),
		    	new Label({
		    		string: $.door_name,
					style: texts.notifications.content,
					name: "door_name"
		    	}),
	    	],
	    	name: "text"
    	}),
    	// the buttons
    	new Line ({
    		contents: [
    			new crossButtonTemplate({idx: $.idx, padding: 6, size: 50, done: $.done}),
    			new Column({width: 50}),
    			new checkButtonTemplate({idx: $.idx, padding: 6, size: 50, done: $.done})
    		],
    		name: "image"
    	})
    			
    ],
    name: str($.idx)
}));// notifications content template, used to implement NotificationsContentexport let NotificationsContentTemplate = Column.template($ => ({     top: 10, left: 0, right: 0,    contents: [    	new NotificationsTopBar(),	// the top bar    	// device list would be added latter by the function LoadNotificationsContent    	// those devices are implemented by DeviceItemTemplate
    	/// auto-load pre-test
    	/*
    	new doorMessageTemplate({idx: 0, kid_name: "David", state: 0, door_name: "front door"}),
    	new doorMessageTemplate({idx: 1, kid_name: "Susan", state: 0, door_name: "back door"}),
    	*/
    	///
    	/// hard-code draft
    	/*
    	new Column ({
    		top: notifications_list_item_padding_h, bottom: notifications_list_item_padding_h,
    		left: notifications_list_item_padding_w, right: notifications_list_item_padding_w,
    		height: notifications_list_item_height,
    		skin: skins.foreground.notifications,
    		contents: [
    			// the notification content
    			new Line ( {
    				top: notifications_list_item_padding_h,
	    			contents: [
		    			new Label({
		    				string: "David",
							style: texts.notifications.content,
		    			}),
		    			new Label({
		    				string: " ",
							style: texts.notifications.content,
		    			}),
		    			new Label({
		    				string: "requested",
							style: texts.notifications.content,
		    			}),
		    			new Label({
		    				string: " to ",
							style: texts.notifications.content,
		    			}),
		    			new Label({
		    				string: "unlock",
							style: texts.notifications.emph,
		    			}),
		    			new Label({
		    				string: " ",
							style: texts.notifications.content,
		    			}),
		    			new Label({
		    				string: "front door",
							style: texts.notifications.content,
		    			}),
	    			]
    			}),
    			// the buttons
    			new Line ({
    				contents: [
    					new crossButtonTemplate({padding: 6, size: 50}),
    					new Column({width: 50}),
    					new checkButtonTemplate({padding: 6, size: 50})
    				]
    			})
    			
    		]
    	}),
    	*/
    	///    ],}));

// update
function empty(container) {
	var content = container;
	var len = container.length;
	for (var i = 1; i < len; i++) {
		container.remove(container[1]);
	} 
}
export function UpdateNotificationsContent(notificationsContent) {
	empty(notificationsContent);	var len = NOTIFICATIONS.length;	for (var i = 0; i < len; i++) {		var data_elem = NOTIFICATIONS[i];		var item = new doorMessageTemplate({
	    	idx: i, 
	    	kid_name: data_elem.kid_name, 
	    	// state: data_elem.state, 
	    	action: data_elem.action,
	    	door_name: data_elem.door_name,
	    	done: data_elem.done
	    });		notificationsContent.add(item);	}	}
// functions used to load device data contents to notifications page, from the device data stored in a fileexport function LoadNotificationsContent(notificationsContent) {		var len = NOTIFICATIONS.length;	for (var i = 0; i < len; i++) {		var data_elem = NOTIFICATIONS[i];		var item = new doorMessageTemplate({
	    	idx: i, 
	    	kid_name: data_elem.kid_name, 
	    	state: data_elem.state, 
	    	action: data_elem.action,
	    	door_name: data_elem.door_name,
	    	done: data_elem.done
	    });		notificationsContent.add(item);	}
	}// the "top" navigate bar of notifications screen (not really stick to the top, it goes up and down with the scrollervar NotificationsTopBar = Container.template($ => ({	// top-bar	top: notifications_list_item_padding_h, left: notifications_list_item_padding_w, right: notifications_list_item_padding_w, bottom: notifications_list_item_padding_h,	height: notifications_list_topbar_height,	contents: [		new Label({			string: "Notifications",			style: texts.notifications.title,		}),		/*		new Line({						contents: [				new AddDeviceTemplate({}),			]		}),*/	]}));