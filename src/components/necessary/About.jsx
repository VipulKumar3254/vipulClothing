import vipul from "../../assets/vipul.jpg"
const About = ()=>{
    return (
        <>
        <div class="container">
        <div class="row">
    <div class="col-md-10 col-12 order-md-1 order-2">
        <h3>Our Manager</h3>
        <p>Hello, I’m Vipul, the founder of this garment shop. My vision is to offer high-quality, stylish clothing while making sure you have a convenient and enjoyable shopping experience. I understand how busy life can be, which is why I introduced our 1-day delivery service – to save you time and ensure you get your purchases quickly.  
        Our motto, "Quality that speaks, service that impresses," reflects our commitment to providing products that not only look great but also last. Every garment we offer is carefully selected for its durability, comfort, and design, so you can feel confident and stylish every time you wear it.  
        At our shop, we focus on making every customer feel valued. We believe in offering more than just clothing; we provide a service that’s reliable, fast, and tailored to your needs. From the moment you place your order, we aim to make your shopping experience as smooth and satisfying as possible.  
        We’re not just about fashion; we’re about building relationships with our customers. Your satisfaction is our priority, and we work hard to ensure that every item you purchase exceeds your expectations. Thank you for choosing us, and we look forward to being part of your fashion journey.</p>
    </div>
    <div class="col-md-2 col-12 order-md-2 order-1">
        <img src={vipul} alt="Your Image" class="img-fluid"/>
    </div>
</div>

</div>

        <div className="container">
        <h3 className="mt-3">We are based in Gyaspur Sonipat</h3>
        <p className="fs-6">Welcome to our garment shop, located in the heart of Gyaspur, Sonipat. We take pride in offering a wide range of high-quality clothing that blends both comfort and style. Our collection is carefully curated to ensure durability, excellent fabric, and attention to detail in every stitch. Whether you're looking for casual wear, formal attire, or something in between, we prioritize delivering top-notch products that cater to all your fashion needs. At our shop, we believe in providing great value with every purchase, making sure you leave satisfied with both the quality and fit of your garments.</p>
        </div>
        <div className="container">
            <h3>Our 1 day Delivery</h3>
            <p>
            At our garment shop in Gyaspur, Sonipat, we understand the importance of convenience and quick service. That’s why we offer a fast, 1-day delivery service to ensure you get your favorite clothes as soon as possible. Whether you're in need of a last-minute outfit or simply prefer the convenience of swift delivery, our 1-day service guarantees that your order will reach you promptly and efficiently. This not only saves you time but also provides peace of mind, knowing that your garments will be delivered right to your doorstep without any hassle. Experience shopping made easy with our reliable and fast delivery service, designed to meet your busy lifestyle!</p>
        </div>
        </>
    )

}


export default About;