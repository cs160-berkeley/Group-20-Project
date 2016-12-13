/*  * this is the part where favorites screen is implemented; includes: * 	Variables: *		FavoritesContent	- an instance of FavoritesContentTemplate, favorites page's content *		FavoritesScreen	- an instance of FavoritesScreenTemplate, the whole favorites page's screen *	Functions: *		LoadFavoritesContent - take in FavoritesContent as its parameter, add the device data to the FavoritesContent *		getStatusURL - 	an assistant function of template OnOffTemplate,  *						used to modify the "on / off" / "lock / unlock" image used to symbolize each device's status *						device type is taken into consideration * 	Templates: *		FavoritesScreenTemplate - the template of the whole favorites screen * 			FavoritesContentTemplate - serves as a parameter of the whole screen's template, contains the main contents *				FavoritesTopBar - the title of favorites screen, scrolling with content, located on the top * 				DeviceItemTemplate - for each of the listed items (that is, devices) in the data file *					DeviceEntryTemplate - 	appearance is the label telling users the device's name / location  *											functionality is to click it and enter the "device" page *					OnOffTemplate 	- 	appearance is the on / off, or lock / unlock button on the right *										functionality is to update DATA and to change the appearance of itself by calling getStatusURL *			iconTemplate - serves as layout elements stick to the bottom of the screen *				iconButtonTemplate - 	the image used as icon is loaded here *										implemented this way so that we might be able to adapt the icons more easily * 				 */import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow,    HorizontalScroller,    HorizontalScrollbar,    LeftScrollerShadow,    RightScrollerShadow} from 'lib/scroller';// parameters & frequently-used functionsimport {	TMP_SCREEN,	img_home,	img_fave,	img_note,	img_sett,	img_plus,	img_off,	img_on,	img_lock,	img_unlock,	on_uri,	off_uri,	lock_uri,	unlock_uri,	BAR_HEIGHT_TOP,	BAR_HEIGHT_BOTTOM,	skins,	texts,	favorites_list_topbar_height,	favorites_list_item_height,	favorites_list_item_padding_w,	favorites_list_item_padding_h,	favorites_list_tag_width,
	favorites_list_topbar_img_size,	bottom_bar_padding,	bottom_bar_img_size,	// load_data,	save_data,	DATA,	deviceURL,	synch_data} from "global_settings"import {	DeviceScreenTemplate,	DeviceContentTemplate,	DeviceScreen,	DeviceContent} from "device";/*import {	SearchScreenTemplate,	SearchContentTemplate,	SearchScreen,	SearchContent,	loadNewDevicesJSON,	SELECTED} from "search_device";
*/
import {
	HomeContentTemplate,
	HomeScreenTemplate,
	HomeContent,
	HomeScreen,
	LoadHomeContent,
} from "home";

import {
	SetContentTemplate,
	SetScreenTemplate,
	SetContent,
	SetScreen,
	LoadSetContent,
} from "set";

import {
	NotificationsContent,	NotificationsScreen,
	NotificationsContentTemplate,
	NotificationsScreenTemplate,
	LoadNotificationsContent
} from "notifications";// the Content and Screen (screen = content with scroll bar) variablesexport var FavoritesContent;export var FavoritesScreen;// favorites screen template, used to implement FavoritesScreenexport var FavoritesScreenTemplate = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,    skin: skins.background.favorites,    contents: [        VerticalScroller($, {             active: true, top: BAR_HEIGHT_TOP, bottom: BAR_HEIGHT_BOTTOM,            contents: [                $.FavoritesContent,                VerticalScrollbar(),           //      TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             }),        // bottom bar // the navigation bar for now        new Line({             bottom: 0, height: BAR_HEIGHT_BOTTOM, left: 0, right: 0, skin: skins.navbar,             contents: [                new iconTemplate({icon_img: img_home, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "home", activate: false}),                new iconTemplate({icon_img: img_fave, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "favorites", activate: true}),                new iconTemplate({icon_img: img_note, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "notifications", activate: false}),                new iconTemplate({icon_img: img_sett, padding: bottom_bar_padding, size: bottom_bar_img_size, hint: "settings", activate: false}),            ]        }),    ]}));// the bottom navigate bar's elements' template // not implemented for nowvar iconTemplate = Column.template($ => ({ 	top: 0, left: 0, right: 0,	active:true,	contents: [				new iconButtonTemplate({			name: $.hint, 			url: $.activate? $.icon_img.activated: $.icon_img.idel,			padding: $.padding, size: 25,		}),				new Label({			string: $.hint,			style: texts.favorites.navhint,		}),	],	behavior: Behavior({		onTouchEnded: function(container) {			save_data(DATA);			// trace("going to page " + $.hint + "\n");
			if ($.hint == "home") {
				trace("going to home page\n");
				application.remove(TMP_SCREEN);
				HomeContent = HomeContentTemplate({});
        		LoadHomeContent(HomeContent);
        		HomeScreen = new HomeScreenTemplate({ HomeContent });
        		TMP_SCREEN = HomeScreen;
        		application.add(TMP_SCREEN);
			}
			else if ($.hint == "favorites") {
				trace("staying on favorites page\n");
				/*
				application.remove(TMP_SCREEN)
				FavoritesContent = FavoritesContentTemplate({});
        		LoadFavoritesContent(FavoritesContent);
        		FavoritesScreen = new FavoritesScreenTemplate({ FavoritesContent });
        		TMP_SCREEN = FavoritesScreen;
        		application.add(TMP_SCREEN);
        		*/
			}
			else if ($.hint == "notifications") {
				trace("going to notifications page\n");
				application.remove(TMP_SCREEN);
				NotificationsContent = NotificationsContentTemplate({});
        		LoadNotificationsContent(NotificationsContent);
        		NotificationsScreen = new NotificationsScreenTemplate({ NotificationsContent });
        		TMP_SCREEN = NotificationsScreen;
        		application.add(TMP_SCREEN);
			}
			else if ($.hint == "settings") {
				trace("going to settings page\n");
				application.remove(TMP_SCREEN);
				SetContent = SetContentTemplate({});
        		LoadSetContent(SetContent);
        		SetScreen = new SetScreenTemplate({ SetContent });
        		TMP_SCREEN = SetScreen;
        		application.add(TMP_SCREEN);
			}		}	})}));let iconButtonTemplate = Container.template($ => ({ // the icons in the bottom navigation bar	contents: [		new Picture({			name: $.name,			url: $.url,			top: $.padding, left: $.padding, right: $.padding, width: $.size, height: $.size,		}),	],}));// favorites content template, used to implement FavoritesContentexport let FavoritesContentTemplate = Column.template($ => ({     top: 10, left: 0, right: 0,    contents: [    	new FavoritesTopBar(),	// the top bar    	// device list would be added latter by the function LoadFavoritesContent    	// those devices are implemented by DeviceItemTemplate    ],}));// functions used to load device data contents to favorites page, from the device data stored in a fileexport function LoadFavoritesContent(favoritesContent) {	var len = DATA.init.length;	for (var i = 0; i < len; i++) {		var data_elem = DATA.init[i];
		// trace(data_elem.favorite + "\n");
		if (!data_elem.favorite) continue;		var item = new DeviceItemTemplate({ 			DeviceName: data_elem.DeviceName, 			DeviceGroup: data_elem.DeviceGroup, 			id: data_elem.id, 			type: data_elem.type,			value: data_elem.value,			idx: i,		});		favoritesContent.add(item);	}}// the "top" navigate bar of favorites screen (not really stick to the top, it goes up and down with the scrollervar FavoritesTopBar = Container.template($ => ({	// top-bar	top: favorites_list_item_padding_h, left: favorites_list_item_padding_w, right: favorites_list_item_padding_w, bottom: favorites_list_item_padding_h,	height: favorites_list_topbar_height,	contents: [		new Label({			string: "My Favorites",			style: texts.favorites.title,		}),
		/*		new Line({						contents: [				new AddDeviceTemplate({}),			]		}),*/	]}));// the plus button's template, click it to add devices// by clicking it you'll jump to "search_device" screen
/*let AddDeviceTemplate = Container.template($ => ({	active: true,	contents: [		new Picture({			url: img_plus,			top: 0, left: 260, right: favorites_list_item_padding_w, width: favorites_list_topbar_img_size, height: favorites_list_topbar_img_size,		})	],	behavior: Behavior({		onTouchEnded: function(container) {			save_data(DATA);			application.remove(TMP_SCREEN);			SELECTED = -1;			SearchContent = SearchContentTemplate({});			loadNewDevicesJSON(SearchContent);        	SearchScreen = new SearchScreenTemplate({ SearchContent });        	TMP_SCREEN = SearchScreen;        	application.add(TMP_SCREEN);		}	})}));
*/// the function getStatusURL is an assistant function of template OnOffTemplate (used in DeviceItemTemplate)// used to modify the "on / off" / "lock / unlock" image used to symbolize each device's status// device type is taken into considerationfunction getStatusURL(type, value) {	var goal_image;	if (type == "binary") {		if (value)			goal_image = img_on;		else			goal_image = img_off;	}	else if (type == "lock") {		if (value)			goal_image = img_unlock;		else			goal_image = img_lock;	}	return goal_image;}// device item template, used to implement an item in the device listexport var DeviceItemTemplate = Line.template($ => ({	top: favorites_list_item_padding_h, left: favorites_list_item_padding_w, right: favorites_list_item_padding_w, bottom: favorites_list_item_padding_h, 	height: favorites_list_item_height,	skin: skins.foreground.favorites,	idx: $.idx,	contents: [		new Column ({			left: favorites_list_item_padding_w,			width: favorites_list_tag_width,			contents: [				// when you click this part you'll enter a device's page				new DeviceEntryTemplate({DeviceName: $.DeviceName, DeviceGroup: $.DeviceGroup, idx: $.idx}),			]		}),				new Column ({			top: favorites_list_item_padding_h, left: favorites_list_item_padding_w, right: favorites_list_item_padding_w, bottom: favorites_list_item_padding_h, 			contents: [				new OnOffTemplate( { img_url: getStatusURL($.type, $.value), id: $.id, idx: $.idx } ),			],		}),	],	type: $.type,	name: $.id,}));// the Labels (group of labels), such as "Night Light", clicked to enter a page of the device, where you can change its settings// by clicking it you'll jump to "device" screenlet DeviceEntryTemplate = Container.template($ => ({	active: true,	idx: $.idx,	// on: false,	contents: [		new Column ( {						contents: [				new Label({					string: $.DeviceName,					style: texts.favorites.content,				}),				new Label({					string: $.DeviceGroup,					style: texts.favorites.small,				}),			]		}),	],	behavior: Behavior({		onTouchEnded: function(container) {			application.remove(TMP_SCREEN);			DeviceContent = DeviceContentTemplate({idx: $.idx});        	DeviceScreen = new DeviceScreenTemplate({ DeviceContent });        	TMP_SCREEN = DeviceScreen;        	application.add(TMP_SCREEN);		}	})}));// the switcher template, used for every devices, a part of DeviceItemTemplatelet OnOffTemplate = Container.template($ => ({	active: true, 	// on: false,	contents: [		new Picture({			top: 18,			right: 18,			url: $.img_url,			name: "img",			height: 25,		})	],	behavior: Behavior({		onTouchEnded: function(container) {			// application.remove(TMP_SCREEN);			// container is this item			if (container.img.url == on_uri) { // turn off				trace("turning off " + $.id + "\n");				//trace(container.img.url + "\n");				container.img.url = img_off;				DATA.init[$.idx].value = 0;				//trace(container.img.url + "\n");			}			else if (container.img.url == lock_uri) {				trace("unlocking " + $.id + "\n");				container.img.url = img_unlock;				DATA.init[$.idx].value = 1;			}			else if (container.img.url == off_uri) { // turn on				trace("turning on " + $.id + "\n");				//trace(container.img.url + "\n");				container.img.url = img_on;				DATA.init[$.idx].value = 1;				//trace(container.img.url + "\n");			}			else if (container.img.url == unlock_uri) {				trace("locking " + $.id + "\n");				container.img.url = img_lock;				DATA.init[$.idx].value = 0;			}			// container.img.url = container.on? img_on: img_off;			save_data(DATA); // update data file			// update the hardware simulator			synch_data();		}	})}));