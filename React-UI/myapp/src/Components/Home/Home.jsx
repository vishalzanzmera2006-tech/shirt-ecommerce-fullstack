import Herosection from "../Home/Herosection"
import BestSellers from "./BestSellers"
// import Craftsmanship from "./Craftsmanship"
import CustomerReviews from "./CustomerReviews"
import FashionBanner from "./FashionBanner"
import Lookbook from "./Lookbook"
import NewArrivals from "./NewArrivals"
import ShopByCategory from './ShopByCategories'
// import SignatureCollection from "./SignatureCollection"
import TrustPillars from "./TrustPillars"
import WhyUs from "./WhyUs"


function Home() {
    return (
        <div>
            <Herosection />
            <TrustPillars />
            <ShopByCategory />
            <NewArrivals />
            <FashionBanner />
            {/* <Craftsmanship /> */}
            {/* <SignatureCollection /> */}
            <BestSellers />
            <Lookbook />
            <CustomerReviews />
            <WhyUs />
        </div>
    )
}

export default Home
