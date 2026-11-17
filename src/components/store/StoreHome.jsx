"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import TodayDeals from "./TodayDeals";

const H = "/stitch-assets/hd/";
const photos = {
  hero: H + "desktop/hero-feature.jpg",
  heroSide: H + "desktop/hero-side.jpg",
  summer: H + "desktop/summer-vibes.jpg",
  categories: [
    H + "desktop/category-jackets.jpg",
    H + "desktop/category-jeans.jpg",
    H + "desktop/category-shirts.jpg",
    H + "desktop/category-tshirts.jpg",
    H + "desktop/category-joggers.jpg",
  ],
  offer: H + "desktop/offer.jpg",
  atelier: H + "desktop/story-atelier.jpg",
  craft: H + "desktop/story-craft.jpg",
  mobileHero: H + "mobile/hero.jpg",
  mobileCategories: [
    H + "mobile/category-jackets.jpg",
    H + "mobile/category-jeans.jpg",
    H + "mobile/category-shirts.jpg",
    H + "mobile/category-tshirts.jpg",
    H + "mobile/category-joggers.jpg",
    H + "mobile/category-polos.jpg",
  ],
  lookbook: H + "mobile/lookbook.jpg",
};
const categories = [
  ["Jackets", "/jackets"],
  ["Jeans", "/jeans-for-men"],
  ["Shirts", "/shirts-for-men"],
  ["T-Shirts", "/tshirts-for-men"],
  ["Joggers", "/joggers-for-men"],
];
function Heading({ eyebrow, children, href, link = "Explore all" }) {
  return (
    <div className="store-section-heading">
      <div>
        <span>{eyebrow}</span>
        <h2>{children}</h2>
      </div>
      {href && <Link href={href}>{link} ↗</Link>}
    </div>
  );
}
function FlashCountdown() {
  const [seconds, setSeconds] = useState(8 * 3600 + 42 * 60 + 19);
  useEffect(() => {
    const id = setInterval(
      () => setSeconds((v) => (v > 0 ? v - 1 : 8 * 3600 + 42 * 60 + 19)),
      1000,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <span>
      {[
        Math.floor(seconds / 3600),
        Math.floor((seconds % 3600) / 60),
        seconds % 60,
      ]
        .map((v) => String(v).padStart(2, "0"))
        .join(" : ")}
    </span>
  );
}

export default function StoreHome() {
  const [deals, setDeals] = useState([]);
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const ds = await getDocs(
          query(collection(db, "products"), where("isDeal", "==", true)),
        );
        if (live)
          setDeals(ds.docs.map((d) => ({ id: d.id, ...d.data() })).slice(0, 4));
      } catch (err) {
        console.error("Could not load storefront products", err);
      }
    })();
    return () => {
      live = false;
    };
  }, []);
  return (
    <main className="store-home">
      <nav className="store-category-pills" aria-label="Shop categories">
        {[
          "All",
          ["T-Shirts", "/tshirts-for-men"],
          ["Joggers", "/joggers-for-men"],
          ["Shirts", "/shirts-for-men"],
          ["Jackets", "/jackets"],
          ["Jeans", "/jeans-for-men"],
        ].map((item, i) => {
          const label = Array.isArray(item) ? item[0] : item;
          const href = Array.isArray(item) ? item[1] : "/";
          return (
            <Link
              className={i === 0 ? "is-active" : ""}
              key={label}
              href={href}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="store-first-screen">
        <section className="store-hero">
          <div className="store-hero-desktop">
            <div className="store-hero-editorial">
              <span className="store-hero-badge">
                <i />
                SUMMER VIBES • DROP 01
              </span>
              <span className="store-hero-kicker">SONIPAT • NEW SEASON</span>
              <h1>
                Summer ’25
                <br />
                <em>New Collection</em>
              </h1>
              <p>
                Light and breezy fits for the season. Crafted for effortless
                everyday elegance, durable movement, and refined understated
                silhouette.
              </p>
              <div className="store-hero-actions">
                <Link className="store-dark-button" href="/newArrivals">
                  Shop now <span aria-hidden="true">→</span>
                </Link>
                <Link className="store-outline-button" href="/jackets">
                  Explore lookbook
                </Link>
              </div>
              <div className="store-hero-stats">
                <div>
                  <b>100%</b>
                  <span>Pure Cotton Weaves</span>
                </div>
                <div>
                  <b>₹250+</b>
                  <span>Starting Price Point</span>
                </div>
                <div>
                  <b>4.9★</b>
                  <span>Verified Shoppers</span>
                </div>
              </div>
            </div>
            <div className="store-hero-mosaic">
              <div className="store-hero-col-main">
                <Link href="/newArrivals" className="store-hero-feature-photo">
                  <Image
                    src={photos.hero}
                    alt="Summer collection, earth tone layering"
                    fill
                    priority
                    sizes="(max-width: 1100px) 48vw, 32vw"
                  />
                  <span className="store-hero-chip">FEATURED POLO</span>
                </Link>
                <Link href="/newArrivals" className="store-hero-caption">
                  <span>
                    <small>CAPSULE WARDROBE</small>
                    <b>Earth Tone Layering</b>
                  </span>
                  <i aria-hidden="true">↗</i>
                </Link>
              </div>
              <div className="store-hero-col-side">
                <Link href="/about" className="store-hero-note-card">
                  <span>SPECIAL LAUNCH</span>
                  <strong>
                    Handpicked
                    <br />
                    Silhouettes
                  </strong>
                  <small>
                    From Gyaspur, Sonipat workshop to all
                    <br />
                    states in India.
                  </small>
                </Link>
                <Link href="/jackets" className="store-hero-secondary-photo">
                  <Image
                    src={photos.heroSide}
                    alt="Kumar Fashion summer looks"
                    fill
                    sizes="22vw"
                  />
                  <span className="store-hero-chip">JACKETS • NEW IN</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="store-hero-mobile">
            <div className="store-mobile-hero-art">
              <Image
                src={photos.mobileHero}
                alt="Summer Vibes collection"
                fill
                priority
                sizes="100vw"
              />
              <div className="store-mobile-hero-tag">
                <i /> SUMMER ’25 DROP
              </div>
              <div className="store-mobile-hero-overlay">
                <span>ATELIER COLLECTION</span>
                <h1>Summer Vibes</h1>
                <p>
                  Light, breathable woven fits meticulously curated for
                  effortless warm-weather tailoring.
                </p>
                <div>
                  <Link href="/newArrivals">Shop now</Link>
                  <Link
                    aria-label="Explore summer looks"
                    href="/shirts-for-men"
                  >
                    ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="store-promises">
          <div className="store-promises-inner">
            {[
              ["shipping", "Pan-India Shipping", "Free on orders above ₹999"],
              ["returns", "7-Day Easy Returns", "Hassle-free doorstep pickup"],
              [
                "genuine",
                "100% Genuine Apparel",
                "Direct from Sonipat atelier",
              ],
              ["support", "Instant Support", "+91 8307949189 • Direct"],
            ].map(([icon, title, text]) => (
              <div className="store-promise" key={icon}>
                <span className="store-promise-icon">
                  <img src={`/stitch-assets/trust/${icon}.svg`} alt="" />
                </span>
                <p>
                  <b>{title}</b>
                  <small>{text}</small>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="store-section store-deals">
        <TodayDeals deals={deals} />
      </section>

      <section className="store-summer">
        <div className="store-summer-copy">
          <span className="store-eyebrow">✳ &nbsp; COMFORT CAPSULE</span>
          <h2>Summer Vibes</h2>
          <p>
            Light and breezy fits for the season. Ultra-soft breathable fleece
            joggers available in Forest Olive, Charcoal Bark, and Deep Navy.
          </p>
          <div className="store-summer-actions">
            <Link className="store-dark-button" href="/joggers-for-men">
              Shop joggers ↗
            </Link>
            <strong>Starting at ₹499</strong>
          </div>
        </div>
        <div className="store-summer-photo">
          <Image
            src={photos.summer}
            alt="Summer Vibes joggers in seasonal colours"
            fill
            sizes="50vw"
          />
          <span>THE COMFORT CAPSULE</span>
        </div>
      </section>

      <section className="store-section store-shop-categories">
        <div className="store-category-heading">
          <Heading
            eyebrow="CURATED SELECTION"
            href="/newArrivals"
            link="All items ↗"
          >
            Shop by category
          </Heading>
          <p>
            Find your fit in our considered selection of everyday essentials.
          </p>
        </div>
        <div className="store-category-grid">
          {categories.map(([name, href], i) => (
            <Link href={href} key={href} className="store-category-card">
              <div>
                <Image
                  src={photos.categories[i]}
                  alt={`${name} collection`}
                  fill
                  sizes="20vw"
                />
                <span className="store-category-overlay">
                  <b>{name}</b>
                  <i>↗</i>
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="store-category-circles">
          {categories
            .concat([["Polos", "/shirts-for-men"]])
            .map(([name, href], i) => (
              <Link href={href} key={`${name}-circle`}>
                <span>
                  <Image
                    src={photos.mobileCategories[i]}
                    alt=""
                    fill
                    sizes="64px"
                  />
                </span>
                <b>{name}</b>
              </Link>
            ))}
        </div>
      </section>

      <section className="store-offer">
        <div className="store-offer-photo">
          <Image
            src={photos.offer}
            alt="The Kumar Fashion signature offer"
            fill
            sizes="(max-width: 1000px) 100vw, 58vw"
          />
          <div className="store-offer-alert">
            <b>LIMITED STOCK ALERT</b>
            <span>
              Over 840+ items dispatched this week from
              <br />
              Gyaspur facility.
            </span>
          </div>
        </div>
        <div className="store-offer-copy">
          <div className="store-offer-top">
            <span className="store-offer-badge">
              <img src="/stitch-assets/offer/tag.svg" alt="" />
              SIGNATURE MEGA OFFER
            </span>
            <h2>
              Get any Product at
              <br />
              <em>250/- only</em>
            </h2>
            <p>
              Don’t miss the chance to upgrade your wardrobe with our affordable
              premium collection. Unbeatable value across selected seasonal
              essentials.
            </p>
          </div>
          <div className="store-offer-bottom">
            <ul>
              {[
                "Selected Tees, Polos & Summer Shorts included",
                "Direct manufacturing pricing • No middlemen",
                "All sizes available from S to 3XL",
              ].map((text) => (
                <li className="store-offer-li" key={text}>
                  <img src="/stitch-assets/offer/check.svg" alt="" />
                  {text}
                </li>
              ))}
            </ul>
            <Link className="store-dark-button" href="/products-under-400">
              Shop now
            </Link>
          </div>
        </div>
        <div className="store-mobile-flash">
          <span className="store-mobile-flash-label">
            <i /> SEASONAL FLASH OFFER
          </span>
          <h2>
            Get any Product at <em>₹250/- only</em>
          </h2>
          <p>
            Don’t miss this chance to upgrade your wardrobe with our affordable
            luxury curation. Limited sizes &amp; early bird availability.
          </p>
          <div className="store-flash-countdown">
            <small>◷ &nbsp; OFFER CLOSES IN:</small>
            <b>
              <FlashCountdown />
            </b>
          </div>
          <div className="store-flash-perks">
            <span>✳ &nbsp; SELECTED STYLES</span>
            <span>↺ &nbsp; EASY RETURNS</span>
          </div>
          <Link href="/products-under-400">CLAIM OFFER NOW &nbsp; ↗</Link>
        </div>
      </section>

      <section className="store-mobile-lookbook">
        <div className="store-mobile-section-heading">
          <div>
            <span>LOOKBOOK</span>
            <h2>Curated Pairings</h2>
          </div>
          <button
            aria-label="Share lookbook"
            onClick={() => {
              if (navigator.share)
                navigator
                  .share({
                    title: "Kumar Fashion lookbook",
                    url: location.href,
                  })
                  .catch(() => {});
            }}
          >
            ↗
          </button>
        </div>
        <article className="store-lookbook-card">
          <div className="store-lookbook-photo">
            <Image
              src={photos.lookbook}
              alt="Earth and ochre layered looks"
              fill
              sizes="100vw"
            />
            <div>
              <span>STYLIST PICK #04</span>
              <h3>Earth &amp; Ochre Layering</h3>
              <p>Heavyweight twill jackets layered over mercerized cotton</p>
            </div>
          </div>
          <div className="store-lookbook-footer">
            <span>
              <b>#1</b>
              <i>#2</i>
            </span>
            <Link href="/jackets">View complete look ↗</Link>
          </div>
        </article>
      </section>

      <section className="store-story">
        <div className="store-story-copy">
          <span className="store-eyebrow">SONIPAT • HARYANA</span>
          <h2>The Kumar Fashion Story</h2>
          <p className="store-story-lead">
            Rooted in Gyaspur, Sonipat, Kumar Fashion Store was founded on a
            distinct philosophy: authentic Indian textile craftsmanship, refined
            contemporary cuts, and honest everyday pricing.
          </p>
          <p>
            We oversee each garment from raw thread weaving to final precision
            stitching, eliminating markups so discerning individuals can build
            enduring wardrobes without compromise.
          </p>
          <div className="store-story-stats">
            <div>
              <b>12,000+</b>
              <span>Happy Indian Patrons</span>
            </div>
            <div>
              <b>48 Hrs</b>
              <span>Dispatched Directly</span>
            </div>
          </div>
        </div>
        <div className="store-story-photos">
          <div>
            <Image
              src={photos.atelier}
              alt="At the Kumar Fashion atelier"
              fill
              sizes="(max-width: 1000px) 45vw, 24vw"
            />
          </div>
          <div>
            <Image
              src={photos.craft}
              alt="Craft details at our atelier"
              fill
              sizes="(max-width: 1000px) 45vw, 24vw"
            />
          </div>
        </div>
      </section>

      <section className="store-mobile-atelier">
        <div className="store-atelier-icon">⌂</div>
        <div>
          <span>FLAGSHIP STORE</span>
          <h2>Kumar Fashion Atelier</h2>
        </div>
        <p>
          Experience our bespoke fabrics, tailoring, and complete seasonal
          collections in person at Sonipat, Haryana.
        </p>
        <div className="store-atelier-actions">
          <a href="tel:+918307949189">☎ &nbsp; Call Atelier</a>
          <a
            href="https://www.instagram.com/vipulkumar_3254/"
            target="_blank"
            rel="noreferrer"
          >
            ◎ &nbsp; Instagram
          </a>
        </div>
        <div className="store-atelier-hours">
          <span>🟢 &nbsp; Mon - Sat: 10AM - 8:30PM</span>
          <a href="mailto:vipulkumar3254@gmail.com">Support Email</a>
        </div>
      </section>

      <section className="store-newsletter">
        <div>
          <span>✳ &nbsp; THE KUMAR EDIT</span>
          <h2>Receive drops, offers and style notes</h2>
          <p>A little inspiration, straight to your inbox.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert(
              "Thanks for your interest. Newsletter signup will be connected soon.",
            );
          }}
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            aria-label="Email address"
          />
          <button type="submit">Subscribe</button>
        </form>
      </section>
    </main>
  );
}
