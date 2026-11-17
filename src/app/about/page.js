import Image from "next/image";
<<<<<<< HEAD
import Link from "next/link";

export const metadata = { title: "About Kumar Fashion Store", description: "Learn more about Kumar Fashion Store, our values, and our team." };

export default function AboutPage() {
  return <main className="store-about-page">
    <section className="store-about-hero"><div><span className="store-eyebrow">OUR STORY · KUMAR FASHION STORE</span><h1>Style for<br/><em>everyday life.</em></h1><p>Thoughtful clothing, a personal touch, and an easier way to find the pieces you’ll reach for again and again.</p><Link className="store-dark-button" href="/newArrivals">Explore the collection ↗</Link></div><div className="store-about-image"><Image src="/stitch-assets/hd/desktop/story-atelier.jpg" alt="Inside the Kumar Fashion atelier" fill sizes="50vw"/></div></section>
    <section className="store-about-copy"><span className="store-eyebrow">A NOTE FROM VIPUL</span><h2>Fashion should feel<br/><em>like it belongs to you.</em></h2><p>Hello, I’m Vipul, founder of Kumar Fashion Store. I started the store with a simple idea: make it easier to find comfortable, well chosen clothing that fits into real life. Every day, we work to make your shopping experience feel personal, straightforward, and worth coming back to.</p><p>Based in Gyaspur, Sonipat, we bring together casual essentials and expressive styles for your wardrobe. Thank you for being part of our journey.</p><Link href="/contact" className="store-story-link">Say hello ↗</Link></section>
    <section className="store-about-place"><div className="store-about-image"><Image src="/stitch-assets/hd/desktop/story-craft.jpg" alt="Craft and detail at the Kumar Fashion atelier" fill sizes="50vw"/></div><div><span className="store-eyebrow">ROOTED IN SONIPAT</span><h2>From our place<br/><em>to your wardrobe.</em></h2><p>Our store is based in Gyaspur, Sonipat, Haryana. We’re here to help with your shopping questions and make finding your next favourite piece feel simple.</p><Link href="/contact">Find our contact details ↗</Link></div></section>
  </main>;
=======
import "@fontsource-variable/jost";

export const metadata = {
  title: "About Kumar Fashion Store",
  description: "Learn more about Kumar Fashion Store, our values, and our team.",
};

export default function About() {
  return (
    <>
      <div style={{ fontFamily: "Jost Variable" }}>
        <div className="container">
          <div className="row">
              <h1 className="text-center">Kumar fashion Store Management</h1>

            <div className="col-md-10 col-12 order-md-1 order-2">
              <h2>Meet Our Team</h2>
              <p>
                Hello, I&rsquo;m Vipul, the founder of the kumar fashion store. My
                vision is to offer high-quality, stylish clothing while making
                sure you have a convenient and enjoyable shopping experience. I
                understand how busy life can be, which is why I introduced our
                1-day delivery service &ndash; to save you time and ensure you
                get your purchases quickly. Our motto, &quot;Quality that
                speaks, service that impresses,&quot; reflects our commitment
                to providing products that not only look great but also last.
                Every garment we offer is carefully selected for its durability,
                comfort, and design, so you can feel confident and stylish every
                time you wear it. At our shop, we focus on making every customer
                feel valued. We believe in offering more than just clothing; we
                provide a service that&rsquo;s reliable, fast, and tailored to
                your needs. From the moment you place your order, we aim to make
                your shopping experience as smooth and satisfying as possible.
                kumar fashion store is  not just about fashion; we&rsquo;re about building
                relationships with our customers. Your satisfaction is our
                priority, and we work hard to ensure that every item you
                purchase exceeds your expectations. Thank you for kumar fashion store,
                and we look forward to being part of your fashion journey.
              </p>
            </div>
            <div className="col-md-2 col-12 order-md-2 order-1">
              <Image
                src={"/vipul.jpg"}
                width={"380"}
                height={"300"}
                alt="Your Image"
                className="img-fluid"
              />
            </div>
          </div>
        </div>

        <div className="container">
          <h3 className="mt-3">Kumar fashion store location</h3>
          <p className="fs-6">
            Welcome to our garment shop, located in the heart of Gyaspur,
            Sonipat. We take pride in offering a wide range of high-quality
            clothing that blends both comfort and style. Our collection is
            carefully curated to ensure durability, excellent fabric, and
            attention to detail in every stitch. Whether you&#39;re looking for
            casual wear, formal attire, or something in between, we prioritize
            delivering top-notch products that cater to all your fashion needs.
            At our shop, we believe in providing great value with every
            purchase, making sure you leave satisfied with both the quality and
            fit of your garments.
          </p>
        </div>
        {/* <div className="container">
          <h3>Our 1 day Delivery</h3>
          <p>
            At Kumar fashion store, we understand the
            importance of convenience and quick service. That&rsquo;s why we
            offer a fast, 1-day delivery service to ensure you get your favorite
            clothes as soon as possible. Whether you&#39;re in need of a
            last-minute outfit or simply prefer the convenience of swift
            delivery, our 1-day service guarantees that your order will reach
            you promptly and efficiently. This not only saves you time but also
            provides peace of mind, knowing that your garments will be delivered
            right to your doorstep without any hassle. Experience shopping made
            easy with our reliable and fast delivery service, designed to meet
            your busy lifestyle!
          </p>
        </div> */}
      </div>
    </>
  );
>>>>>>> origin/master
}
