import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';

const Index = () => {
  const { products = [], categories = [], getFeaturedProducts, heroConfig, isLoadingHero } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const featuredProducts = getFeaturedProducts();
  
  const filteredProducts = (categoryId?: string) => {
    let filtered = categoryId
      ? products.filter((product) => product.category_id === categoryId)
      : products;
      
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          (product.description?.toLowerCase() || '').includes(term)
      );
    }
    
    return filtered;
  };

  const heroImages = [
    heroConfig?.image1,
    heroConfig?.image2,
    heroConfig?.image3,
  ].filter(Boolean) as string[];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* New Hero Section */}
      <section className="bg-white py-8 md:py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px] md:min-h-[600px]">
            {isLoadingHero ? (
              <div className="col-span-2 flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bakery-pink"></div>
              </div>
            ) : (
              <>
                {/* Text Content */}
                <div className="order-2 lg:order-1 text-center lg:text-left space-y-6">
                  <div className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                      {(heroConfig?.title || "").split(' ').map((word, i, arr) => 
                        i === arr.length - 1 ? 
                        <span key={i} className="text-bakery-pink block">{word}</span> : 
                        <span key={i} className="text-gray-800">{word} </span>
                      )}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                      {heroConfig?.subtitle || ""}
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <a 
                      href="#catalogo"
                      className="inline-flex items-center justify-center bg-bakery-pink hover:bg-bakery-pink/90 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                    >
                      {heroConfig?.buttonText}
                    </a>
                  </div>
                </div>

                {/* Image Carousel */}
                <div className="order-1 lg:order-2 relative">
                  <div className="relative w-full max-w-md mx-auto lg:max-w-none">
                    <Carousel
                      setApi={setApi}
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                      className="w-full"
                    >
                      <CarouselContent>
                        {heroImages.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="relative">
                              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                  src={image}
                                  alt={`Promoção ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                  loading={index === 0 ? "eager" : "lazy"}
                                />
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden md:flex -left-12 bg-white/80 hover:bg-white border-2 border-bakery-pink/20 hover:border-bakery-pink/40 text-bakery-pink" />
                      <CarouselNext className="hidden md:flex -right-12 bg-white/80 hover:bg-white border-2 border-bakery-pink/20 hover:border-bakery-pink/40 text-bakery-pink" />
                    </Carousel>
                    
                    {/* Carousel indicators */}
                    <div className="flex justify-center mt-4 gap-2">
                      {heroImages.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            current === index + 1 ? "bg-bakery-pink w-6" : "bg-bakery-pink/30"
                          }`}
                          onClick={() => api?.scrollTo(index)}
                          aria-label={`Ir para slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12" id="promocoes">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">Produtos em Destaque</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Catalog Section with Tabs */}
      <section id="catalogo" className="py-16 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">Nosso Cardápio</h2>
          
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="w-full flex overflow-x-auto mb-6 justify-start">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="todos">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts().map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts(category.id).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      
      {/* Call to Action */}
      <section id="call-to-action" className="bg-foreground text-primary-foreground py-16 scroll-mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Pronto para adoçar o seu dia?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Encomende já seu bolo personalizado ou kit festa e receba uma explosão de sabor onde você estiver!
          </p>
          <a
            href="https://wa.me/5527996487579"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-full inline-flex items-center"
          >
            <span className="mr-2">Chamar no WhatsApp</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </a>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;