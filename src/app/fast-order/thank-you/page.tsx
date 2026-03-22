export default function ThankYouPage() {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Děkujeme za objednávku 💛
        </h1>
  
        <p className="text-sm mb-6">
          Jakmile platba dorazí, pošleme vám e-mail s potvrzením objednávky
          a všemi detaily k vyzvednutí.
        </p>
  
        <p className="text-xs text-muted-foreground">
          Zpracování platby může chvíli trvat.
        </p>
      </div>
    );
  }
  