import { CartProvider } from './cart';
import { useRoute } from './router';
import { Header, AnnouncementBar } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CookieBanner } from './components/CookieBanner';
import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductPage } from './pages/ProductPage';
import { DesignPage } from './pages/DesignPage';
import { CustomiserPage } from './pages/CustomiserPage';
import { FaqPage } from './pages/FaqPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { LogoUploadPage } from './pages/LogoUploadPage';
import { MoreDesignsPage } from './pages/MoreDesignsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CartPage } from './pages/CartPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { WhatsAppButton } from './components/WhatsAppButton';
import { SubscribeModal } from './components/SubscribeModal';

function Pages() {
  const route = useRoute();

  switch (route.name) {
    case 'home': return <HomePage />;
    case 'collections': return <CollectionsPage />;
    case 'collection': return <CollectionPage slug={route.slug} />;
    case 'product': return <ProductPage slug={route.slug} />;
    case 'design': return <DesignPage id={route.id} />;
    case 'customiser': return <CustomiserPage />;
    case 'faq': return <FaqPage />;
    case 'reviews': return <ReviewsPage />;
    case 'logo-upload': return <LogoUploadPage />;
    case 'more-designs': return <MoreDesignsPage />;
    case 'checkout': return <CheckoutPage />;
    case 'cart': return <CartPage />;
    case 'privacy-policy': return <PrivacyPolicyPage />;
    case 'terms-of-service': return <TermsOfServicePage />;
    case 'refund-policy': return <RefundPolicyPage />;
    default: return <HomePage />;
  }
}

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#0a0a0f] relative">
        <div className="page-gradient-bg" />
        <div className="relative z-10 flex flex-col flex-1">
          <AnnouncementBar />
          <Header />
          <main className="flex-1">
            <Pages />
          </main>
          <Footer />
          <WhatsAppButton />
          <CartDrawer />
          <CookieBanner />
          <SubscribeModal />
        </div>
      </div>
    </CartProvider>
  );
}
