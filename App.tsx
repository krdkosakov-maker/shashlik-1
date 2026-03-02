import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import BookingForm from "@/components/BookingForm";
import OrderForm from "@/components/OrderForm";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";

function App() {
  const [activeSection, setActiveSection] = useState("home");

  // Seed database on first load
  const { data: menuItems } = useQuery({
    queryKey: ["menuItems"],
    queryFn: async () => {
      // Check if we need to seed
      const items = await client.getMenuItems();
      if (items.length === 0) {
        await client.seed();
        return await client.getMenuItems();
      }
      return items;
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "menu", "gallery", "booking", "order", "reviews", "contact"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <Navigation activeSection={activeSection} />
      
      <main>
        <section id="home">
          <Hero />
        </section>

        <section id="menu" className="py-20">
          <Menu menuItems={menuItems || []} />
        </section>

        <section id="gallery" className="py-20">
          <Gallery />
        </section>

        <section id="booking" className="py-20">
          <BookingForm />
        </section>

        <section id="order" className="py-20">
          <OrderForm menuItems={menuItems || []} />
        </section>

        <section id="reviews" className="py-20">
          <Reviews />
        </section>

        <section id="contact" className="py-20">
          <Contact />
        </section>
      </main>

      <footer className="bg-zinc-950 border-t border-orange-900/20 py-8">
        <div className="container mx-auto px-4 text-center text-zinc-400">
          <p>© 2026 Шашлычная №1. Все права защищены.</p>
          <p className="text-sm mt-2">Краснодар, улица Автолюбителей, 1/2Я</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
