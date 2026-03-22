export default function ThankYouPage() {
    return (
      <div className="container mx-auto px-4 py-20 max-w-xl text-center">
  
        <h1 className="text-3xl font-bold mb-6">
          Děkujeme za rezervaci
        </h1>
  
        <p className="text-lg mb-6">
          Vaše rezervace byla úspěšně vytvořena.
        </p>
  
        <p className="text-gray-600 mb-8">
          Po přijetí platby vám zašleme potvrzovací email
          s informacemi ke kurzu.
        </p>
  
        <p className="text-sm text-gray-500">
          Pokud email neobdržíte do 24 hodin,
          kontaktujte nás prosím.
        </p>
  
      </div>
    );
  }