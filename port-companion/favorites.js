/* 
	favorites_list_topbar_img_size,
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
	NotificationsContent,
	NotificationsContentTemplate,
	NotificationsScreenTemplate,
	LoadNotificationsContent
} from "notifications";
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
			}
		// trace(data_elem.favorite + "\n");
		if (!data_elem.favorite) continue;
		/*
/*
*/