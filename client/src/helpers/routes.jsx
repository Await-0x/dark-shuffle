import ArenaPage from "../pages/ArenaPage";
import CollectionPage from "../pages/CollectionPage";
import DonationPage from "../pages/DonationPage";

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
    path: '/donations',
    content: <DonationPage />
  }
]