import ArenaPage from "../pages/ArenaPage";
import CollectionPage from "../pages/CollectionPage";
import SettingsPage from "../pages/SettingsPage";

export const routes = [
  {
    path: '/',
    content: <ArenaPage />
  },
  {
    path: '/library',
    content: <CollectionPage />
  },
  {
    path: '/settings',
    content: <SettingsPage />
  }
]