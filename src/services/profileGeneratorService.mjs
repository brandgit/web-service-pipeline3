import axios from 'axios';

class ProfileGeneratorService {
  constructor() {
    this.randomUserApi = 'https://randomuser.me/api/';
    this.randommerApi = 'https://randommer.io/api';
    this.randommerApiKey = process.env.RANDOMMER_API_KEY;
    
    // APIs supplémentaires
    this.quoteApi = 'https://api.quotable.io';
    this.jokeApi = 'https://v2.jokeapi.dev';
  }

  async generateCompleteProfile() {
    try {
      // Appels parallèles pour optimiser le temps de réponse
      const [user, phone, iban, creditCard, randomName, pet, quote, joke] = await Promise.all([
        this.getRandomUser(),
        this.getRandomPhoneNumber(),
        this.getRandomIban(),
        this.getRandomCreditCard(),
        this.getRandomName(),
        this.getRandomPet(),
        this.getRandomQuote(),
        this.getRandomJoke()
      ]);

      // Combinaison des résultats
      return {
        user,
        phone_number: phone,
        iban,
        credit_card: creditCard,
        random_name: randomName,
        pet,
        quote,
        joke
      };
    } catch (error) {
      console.error('Erreur lors de la génération du profil complet:', error);
      throw error;
    }
  }

  async getRandomUser() {
    try {
      const response = await axios.get(this.randomUserApi);
      const userData = response.data.results[0];
      
      return {
        name: `${userData.name.first} ${userData.name.last}`,
        email: userData.email,
        gender: userData.gender,
        location: `${userData.location.city}, ${userData.location.country}`,
        picture: userData.picture.large
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur aléatoire:', error);
      throw error;
    }
  }

  async getRandomPhoneNumber() {
    try {
      const response = await axios.get(`${this.randommerApi}/Phone/Generate`, {
        headers: {
          'X-Api-Key': this.randommerApiKey
        },
        params: {
          CountryCode: 'FR',
          Quantity: 1
        }
      });
      
      return response.data[0];
    } catch (error) {
      console.error('Erreur lors de la récupération du numéro de téléphone:', error);
      return '+33 6 12 34 56 78'; // Valeur par défaut en cas d'erreur
    }
  }

  async getRandomIban() {
    try {
      const response = await axios.get(`${this.randommerApi}/Finance/Iban`, {
        headers: {
          'X-Api-Key': this.randommerApiKey
        },
        params: {
          countryCode: 'FR'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'IBAN:', error);
      return 'FR1420041010050500013M02606'; // Valeur par défaut en cas d'erreur
    }
  }

  async getRandomCreditCard() {
    try {
      const response = await axios.get(`${this.randommerApi}/Finance/CreditCard`, {
        headers: {
          'X-Api-Key': this.randommerApiKey
        }
      });
      
      // Format attendu dans la spécification
      return {
        card_number: response.data.CardNumber,
        card_type: response.data.CardType,
        expiration_date: `${response.data.Month}/${response.data.Year}`,
        cvv: response.data.CVV
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la carte de crédit:', error);
      // Valeur par défaut en cas d'erreur
      return {
        card_number: '4111111111111111',
        card_type: 'VISA',
        expiration_date: '12/2026',
        cvv: '123'
      };
    }
  }

  async getRandomName() {
    try {
      const response = await axios.get(`${this.randommerApi}/Name/FirstNames`, {
        headers: {
          'X-Api-Key': this.randommerApiKey
        },
        params: {
          quantity: 1
        }
      });
      
      return response.data[0];
    } catch (error) {
      console.error('Erreur lors de la récupération du nom aléatoire:', error);
      return 'Alice'; // Valeur par défaut en cas d'erreur
    }
  }

  async getRandomPet() {
    try {
      const response = await axios.get(`${this.randommerApi}/Misc/RandomAnimal`, {
        headers: {
          'X-Api-Key': this.randommerApiKey
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'animal de compagnie:', error);
      return 'Cat'; // Valeur par défaut en cas d'erreur
    }
  }

  // API supplémentaire 1: Citation aléatoire
  async getRandomQuote() {
    try {
      const response = await axios.get(`${this.quoteApi}/random`);
      
      return {
        content: response.data.content,
        author: response.data.author
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la citation:', error);
      return {
        content: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs'
      };
    }
  }

  // API supplémentaire 2: Blague aléatoire
  async getRandomJoke() {
    try {
      const response = await axios.get(`${this.jokeApi}/joke/Programming`);
      
      if (response.data.type === 'single') {
        return {
          type: response.data.category,
          content: response.data.joke
        };
      } else {
        return {
          type: response.data.category,
          content: `${response.data.setup} ${response.data.delivery}`
        };
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la blague:', error);
      return {
        type: 'Programming',
        content: 'Why do programmers prefer dark mode? Because light attracts bugs.'
      };
    }
  }
}

export default ProfileGeneratorService; 